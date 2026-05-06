import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";

interface AttachmentInput {
  name: string;
  mimeType: string;
  data: string; // base64, no prefix
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ description: "" });
    }

    const body = await req.json() as { attachments: AttachmentInput[] };
    const attachments: AttachmentInput[] = body?.attachments ?? [];
    if (!attachments.length) return NextResponse.json({ description: "" });

    const imageAtts = attachments.filter((a) => a.mimeType.startsWith("image/"));
    if (!imageAtts.length) return NextResponse.json({ description: "" });

    // Build OpenAI vision message content
    type ContentPart =
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string; detail: "high" } };

    const content: ContentPart[] = [];
    for (const att of imageAtts) {
      content.push({
        type: "image_url",
        image_url: { url: `data:${att.mimeType};base64,${att.data}`, detail: "high" },
      });
    }

    const fileNames = imageAtts.map((a) => a.name).join(", ");
    content.push({
      type: "text",
      text: `Analyze the attached image(s): ${fileNames}

Extract and describe the following for mobile app generation:
1. COLOR PALETTE: List the dominant colors as hex codes — primary, secondary, accent, background, text
2. UI STYLE: Describe the visual style (dark/light, minimal/bold, glassmorphism, etc.)
3. TYPOGRAPHY: Font style, weight, sizing impressions
4. LAYOUT & NAVIGATION: If it's a UI screenshot, describe the navigation pattern and screen layout
5. LOGO/BRAND: If a logo is present, describe it and how to incorporate it (header, splash screen, icon)
6. OVERALL AESTHETIC: One paragraph summarizing the design direction

Format your response starting with: "DESIGN REFERENCE FROM ATTACHED ASSETS:"`,
    });

    const model = process.env.OPENAI_MODEL ?? "gpt-4o";
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 700,
        messages: [
          {
            role: "system",
            content:
              "You are a design analyst specializing in mobile app UI/UX. Analyze uploaded design assets and extract precise, actionable design specifications for a mobile app generator. Be specific about colors (use hex codes), styles, and layout patterns.",
          },
          { role: "user", content },
        ],
      }),
    });

    if (!res.ok) {
      console.error("[analyze-attachment] OpenAI error:", res.status, await res.text().catch(() => ""));
      return NextResponse.json({ description: `[Attached: ${fileNames}]` });
    }

    const json = await res.json() as { choices: Array<{ message: { content: string } }> };
    const description = json.choices?.[0]?.message?.content?.trim() ?? "";
    return NextResponse.json({ description });
  } catch (err) {
    console.error("[analyze-attachment]", err);
    return NextResponse.json({ description: "" });
  }
}
