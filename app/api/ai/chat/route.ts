import { NextRequest, NextResponse } from "next/server";

const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const TIMEOUT_MS = 15000;

const SYSTEM_PROMPT = `You are Evermade AI — a creative design partner embedded in the Evermade mobile app builder.

## What Evermade is
Evermade is a visual builder for premium mobile apps (iOS/Android). Users describe what they want in plain language and the builder generates or edits their app in real time.

## Your role
Help users build great apps. Answer design questions, explain concepts, suggest improvements, give color palette advice, explain how the builder works, and encourage creativity. Be concise, warm, and opinionated — like a senior product designer who also codes.

## The builder
- Users can describe edits in chat: "make the button blue", "rename this screen", "change the greeting"
- The builder supports structured edit commands (handled separately). You handle questions and design conversations.
- Components available: greeting, activity-card, ring-stat, section-header, workout-item
- Each component's editable props:
  - greeting: name (string), greeting (string)
  - activity-card: title (string)
  - ring-stat: label, value (number), goal (number), unit, color (hex)
  - section-header: title, actionLabel
  - workout-item: name, time, duration, calories, icon, color (hex)

## Design guidance
- Dark premium apps: use deep backgrounds (#050509–#0a0a12), subtle glass surfaces (rgba white 5–8%), vibrant accent colors
- The Evermade default accent palette: purple #7C5CFC, blue #4878FF — use both for gradients
- For fitness/health apps: activity rings, bold metrics, minimal chrome
- Typography: large bold headings, small muted captions, generous line-height
- Always suggest hex colors when giving color advice

## Tone
- Short, clear answers — never more than 3–4 sentences unless the question needs a list
- Use **bold** for component names, color values, and key terms
- Use bullet • lists for multiple options or steps
- No filler phrases ("Great question!", "Of course!", "Certainly!")
- If you don't know something about the user's specific project, say so honestly`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 503 });
    }

    const body = await req.json();
    const userMessage: string = body?.message ?? "";
    const project: unknown = body?.project ?? null;
    const history: Array<{ role: "user" | "assistant"; content: string }> = body?.history ?? [];

    if (!userMessage.trim()) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const projectContext = project
      ? `\n\nCurrent project context:\n${JSON.stringify(project, null, 2)}`
      : "";

    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT + projectContext },
      ...history.slice(-8),
      { role: "user" as const, content: userMessage },
    ];

    const controller = new AbortController();
    const timeoutHandle = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(OPENAI_CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model: MODEL, messages, max_tokens: 400 }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutHandle);
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "OpenAI request failed" },
        { status: 502 }
      );
    }

    const reply: string = data?.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ reply });
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === "AbortError";
    return NextResponse.json(
      { error: isTimeout ? "AI request timed out." : (error instanceof Error ? error.message : "Unknown error") },
      { status: 503 }
    );
  }
}
