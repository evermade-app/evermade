import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import OpenAI from "openai";
import { deductCredits, checkCreditsBeforeAction } from "@/lib/credits";
import { CREDIT_COSTS } from "@/lib/evermade/plans";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const LOGO_PLACEHOLDER = "__EVERMADE_LOGO_SRC__";

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
      logoData?: string;      // base64 without data: prefix
      logoMimeType?: string;  // e.g. "image/png"
    };

    const { screenHtml, screenName, elementTag, elementText, editRequest, logoData, logoMimeType } = body;

    if (!screenHtml || !editRequest?.trim()) {
      return NextResponse.json({ error: "screenHtml and editRequest are required" }, { status: 400 });
    }

    // ── Credit check ──────────────────────────────────────────────────────────
    const userId = session.user.uid;
    const { allowed, remaining } = await checkCreditsBeforeAction(
      userId,
      CREDIT_COSTS.editChat,
      session.user.email ?? undefined,
    );
    if (!allowed) {
      return NextResponse.json(
        { error: `Not enough credits (need ${CREDIT_COSTS.editChat}, have ${remaining}). Upgrade or buy more credits.` },
        { status: 403 },
      );
    }

    const elementDesc = elementText
      ? `<${elementTag}> containing "${elementText.slice(0, 200)}"`
      : `<${elementTag}>`;

    const hasLogo = !!(logoData && logoMimeType);
    const logoDataUrl = hasLogo ? `data:${logoMimeType};base64,${logoData}` : null;

    type ContentPart =
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string; detail: "high" } };

    let userContent: string | ContentPart[];

    if (hasLogo && logoDataUrl) {
      userContent = [
        {
          type: "image_url",
          image_url: { url: logoDataUrl, detail: "high" },
        },
        {
          type: "text",
          text: `Screen: "${screenName}"
Target element: ${elementDesc}

Edit request: ${editRequest}

The image above is the logo/brand asset to embed. Your job:
1. Find the target element described above (or the closest matching element)
2. If the edit request is about adding/replacing a logo or image: set its src attribute to exactly "${LOGO_PLACEHOLDER}" — do NOT inline the image as base64
3. Apply any brand colors from the logo to relevant elements (buttons, accents, backgrounds) as the edit requires
4. Preserve all other HTML content, structure, and text exactly

Here is the full screen HTML:
${screenHtml.slice(0, 12000)}

Return ONLY the complete updated HTML.`,
        },
      ];
    } else {
      userContent = `Screen: "${screenName}"
Target element: ${elementDesc}

Edit request: ${editRequest}

Here is the full screen HTML:
${screenHtml}`;
    }

    const systemPrompt = hasLogo
      ? `You are an expert HTML/CSS editor for mobile app screens (390×844px viewport).
Make precise, targeted edits to the provided HTML while preserving all other elements, structure, and styles exactly as-is.
When embedding a logo image, always use the placeholder string "${LOGO_PLACEHOLDER}" as the src — never inline base64 image data.
Return ONLY the complete raw HTML — no markdown, no code blocks, no explanation.`
      : `You are an expert HTML/CSS editor for mobile app screens (390×844px viewport).
Make precise, targeted edits to the provided HTML while preserving all other elements, structure, and styles exactly as-is.
Return ONLY the complete raw HTML — no markdown, no code blocks, no explanation.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 16000,
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
    });

    const html = completion.choices[0]?.message?.content?.trim() ?? "";

    if (!html || !html.includes("<")) {
      return NextResponse.json({ error: "AI returned invalid HTML" }, { status: 502 });
    }

    // Strip any accidental markdown code fences
    let cleaned = html
      .replace(/^```html\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    // Replace placeholder with actual logo data URL
    if (hasLogo && logoDataUrl && cleaned.includes(LOGO_PLACEHOLDER)) {
      cleaned = cleaned.split(LOGO_PLACEHOLDER).join(logoDataUrl);
    }

    // Deduct after successful edit
    await deductCredits(userId, CREDIT_COSTS.editChat, "edit_element", `Edited <${elementTag}> in ${screenName}`);

    return NextResponse.json({ html: cleaned });
  } catch (err) {
    console.error("[/api/ai/edit-element]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Edit failed" },
      { status: 500 }
    );
  }
}
