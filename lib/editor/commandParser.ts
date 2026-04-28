export type CommandAction =
  | "update_text"
  | "update_color"
  | "update_value"
  | "update_goal"
  | "update_name"
  | "update_greeting"
  | "rename_screen"
  | "update_project_name"
  | "generate_screen"
  | "unknown";

export type ParsedCommand = {
  action: CommandAction;
  value: string | null;
  property: string | null;
  raw: string;
  confidence: "high" | "medium" | "low";
};

const NAMED_COLORS: Record<string, string> = {
  red: "#ff375f",
  green: "#30d158",
  blue: "#0a84ff",
  purple: "#7c5cfc",
  violet: "#7c5cfc",
  pink: "#ff375f",
  orange: "#ff9f0a",
  yellow: "#ffd60a",
  teal: "#5ac8fa",
  cyan: "#5ac8fa",
  white: "#ffffff",
  black: "#000000",
  gray: "#8e8e93",
  grey: "#8e8e93",
  indigo: "#5e5ce6",
  magenta: "#bf5af2",
};

function extractColor(input: string): string | null {
  const hexMatch = input.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/);
  if (hexMatch) return hexMatch[0];
  const lower = input.toLowerCase();
  for (const [name, hex] of Object.entries(NAMED_COLORS)) {
    if (lower.includes(name)) return hex;
  }
  return null;
}

function extractQuotedText(input: string): string | null {
  const match = input.match(/["']([^"']+)["']/);
  return match ? match[1] : null;
}

function extractNumber(input: string): string | null {
  const match = input.match(/\b(\d+)\b/);
  return match ? match[1] : null;
}

function extractAfterTo(input: string): string | null {
  const match = input.trim().match(/\bto\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

function stripContextPrefix(input: string): string {
  return input.replace(/^\[[^\]]+\]\s*/, "");
}

export function parseCommand(raw: string): ParsedCommand {
  const stripped = stripContextPrefix(raw);
  const lower = stripped.toLowerCase().trim();

  // ── Color ──────────────────────────────────────────────────────────────────
  const color = extractColor(lower);
  const colorIntent =
    /\b(color|colour|make|change|turn|set)\b/.test(lower) && color !== null;
  if (colorIntent) {
    return { action: "update_color", value: color, property: "color", raw, confidence: "high" };
  }

  // ── Goal ───────────────────────────────────────────────────────────────────
  if (/\b(goal|target)\b/.test(lower)) {
    const num = extractNumber(lower);
    if (num) {
      return { action: "update_goal", value: num, property: "goal", raw, confidence: "high" };
    }
  }

  // ── Value / progress ───────────────────────────────────────────────────────
  const valueIntent =
    /\b(value|progress|current)\b/.test(lower) ||
    (/\b(set|update|change)\b/.test(lower) && /\bto\s+\d/.test(lower));
  if (valueIntent) {
    const num = extractNumber(lower);
    if (num) {
      return { action: "update_value", value: num, property: "value", raw, confidence: "high" };
    }
  }

  // ── Greeting text ──────────────────────────────────────────────────────────
  if (/\bgreeting\b/.test(lower)) {
    const quoted = extractQuotedText(stripped);
    if (quoted) {
      return { action: "update_greeting", value: quoted, property: "greeting", raw, confidence: "high" };
    }
    const after = extractAfterTo(stripped);
    if (after) {
      return { action: "update_greeting", value: after, property: "greeting", raw, confidence: "medium" };
    }
  }

  // ── Name ───────────────────────────────────────────────────────────────────
  if (/\b(name|user|called|person)\b/.test(lower)) {
    const quoted = extractQuotedText(stripped);
    if (quoted) {
      return { action: "update_name", value: quoted, property: "name", raw, confidence: "high" };
    }
    const after = extractAfterTo(stripped);
    if (after) {
      return { action: "update_name", value: after, property: "name", raw, confidence: "medium" };
    }
  }

  // ── Project rename ─────────────────────────────────────────────────────────
  if (/\b(app|project)\b/.test(lower) && /\b(rename|name|call|title)\b/.test(lower)) {
    const quoted = extractQuotedText(stripped);
    if (quoted) {
      return { action: "update_project_name", value: quoted, property: "name", raw, confidence: "high" };
    }
    const after = extractAfterTo(stripped);
    if (after) {
      return { action: "update_project_name", value: after, property: "name", raw, confidence: "medium" };
    }
  }

  // ── Screen rename ──────────────────────────────────────────────────────────
  if (/\b(screen|page)\b/.test(lower) && /\b(rename|name|call)\b/.test(lower)) {
    const quoted = extractQuotedText(stripped);
    if (quoted) {
      return { action: "rename_screen", value: quoted, property: "name", raw, confidence: "high" };
    }
    const after = extractAfterTo(stripped);
    if (after) {
      return { action: "rename_screen", value: after, property: "name", raw, confidence: "medium" };
    }
  }

  // ── Generic text / rename ──────────────────────────────────────────────────
  if (/\b(rename|title|label|heading|text|call|say)\b/.test(lower) ||
      /\b(change|set|update)\b.+\bto\b/.test(lower)) {
    const quoted = extractQuotedText(stripped);
    if (quoted) {
      return { action: "update_text", value: quoted, property: "text", raw, confidence: "high" };
    }
    const after = extractAfterTo(stripped);
    if (after) {
      return { action: "update_text", value: after, property: "text", raw, confidence: "medium" };
    }
  }

  // ── Pure number with "to" ──────────────────────────────────────────────────
  if (/\bto\s+\d/.test(lower)) {
    const num = extractNumber(lower);
    if (num) {
      return { action: "update_value", value: num, property: "value", raw, confidence: "low" };
    }
  }

  // ── Screen / UI generation ─────────────────────────────────────────────────
  // Catches: "create a home screen", "build a beautiful dashboard", "make me a
  //          fitness page", "generate a profile view", "redesign the settings"…
  const hasCreateVerb = /\b(create|generate|make|build|design|add|show|give|refaire|cr[eé]er|faire|construire|redesign|rebuild|new)\b/.test(lower);
  const hasScreenNoun = /\b(screen|page|view|ui|interface|layout|dashboard|home|profile|settings|explore|discover|feed|social|fitness|finance|health|[eé]cran)\b/.test(lower);
  const hasPrettyAdj  = /\b(beautiful|nice|cool|stunning|gorgeous|amazing|modern|premium|pretty|great|best)\b/.test(lower);

  if (hasCreateVerb || (hasPrettyAdj && hasScreenNoun)) {
    if (hasScreenNoun || hasPrettyAdj) {
      return { action: "generate_screen", value: stripped, property: null, raw, confidence: "high" };
    }
  }

  return { action: "unknown", value: null, property: null, raw, confidence: "low" };
}
