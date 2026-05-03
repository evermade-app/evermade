import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 503 });
    }

    const body = await req.json() as {
      screenHtml: string;
      screenName: string;
      elementTag: string;
      elementText: string;
      editRequest: string;
    };

    const { screenHtml, screenName, elementTag, elementText, editRequest } = body;

    if (!screenHtml || !editRequest?.trim()) {
      return NextResponse.json({ error: "screenHtml and editRequest are required" }, { status: 400 });
    }

    const elementDesc = elementText
      ? `<${elementTag}> containing "${elementText.slice(0, 200)}"`
      : `<${elementTag}>`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 16000,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: `You are an expert HTML/CSS editor for mobile app screens (390×844px viewport).
Make precise, targeted edits to the provided HTML while preserving all other elements, structure, and styles exactly as-is.
Return ONLY the complete raw HTML — no markdown, no code blocks, no explanation.`,
        },
        {
          role: "user",
          content: `Screen: "${screenName}"
Target element: ${elementDesc}

Edit request: ${editRequest}

Here is the full screen HTML:
${screenHtml}`,
        },
      ],
    });

    const html = completion.choices[0]?.message?.content?.trim() ?? "";

    if (!html || !html.includes("<")) {
      return NextResponse.json({ error: "AI returned invalid HTML" }, { status: 502 });
    }

    // Strip any accidental markdown code fences the model might add
    const cleaned = html
      .replace(/^```html\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    return NextResponse.json({ html: cleaned });
  } catch (err) {
    console.error("[/api/ai/edit-element]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Edit failed" },
      { status: 500 }
    );
  }
}
