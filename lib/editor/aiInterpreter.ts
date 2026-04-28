export type AiInterpretResult = {
  actions?: Array<{
    type: string;
    screenId?: string;
    componentId?: string;
    props?: Record<string, unknown>;
    value?: string;
  }>;
  /** Short confirmation shown in chat after actions are applied. */
  message?: string;
  error?: string;
  /** True when the response came from OpenAI (vs local fallback). */
  usedAI?: boolean;
  /** True when the server signals the client should fall back to local parser. */
  fallback?: boolean;
};

type AiInterpretPayload = {
  message: string;
  project: unknown;
};

export async function interpretWithAI(
  payload: AiInterpretPayload
): Promise<AiInterpretResult> {
  const res = await fetch("/api/ai/interpret", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: AiInterpretResult = await res.json();

  // 503 / 502 with fallback:true → caller should use local parser
  if (!res.ok || data.fallback) {
    const err = new Error(data?.error || "AI interpretation failed");
    (err as Error & { fallback: boolean }).fallback = true;
    throw err;
  }

  return data;
}

export type HistoryMessage = { role: "user" | "assistant"; content: string };

type AiChatPayload = {
  message: string;
  project: unknown;
  history: HistoryMessage[];
};

export async function chatWithAI(payload: AiChatPayload): Promise<string> {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: { reply?: string; error?: string } = await res.json();

  if (!res.ok || !data.reply) {
    throw new Error(data?.error || "Chat request failed");
  }

  return data.reply;
}
