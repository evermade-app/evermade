import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";

interface Screen {
  id: string;
  name: string;
  html: string;
}

const LOGO_PLACEHOLDER = "__EVERMADE_LOGO_SRC__";

// POST { screens, designBrief, appName, logoData?, logoMimeType?, userInstruction? }
// → { screens } — same screens with visual design applied, content unchanged
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI not configured" }, { status: 503 });
    }

    const body = await req.json() as {
      screens: Screen[];
      designBrief: string;
      appName: string;
      logoData?: string;      // base64 without data: prefix
      logoMimeType?: string;  // e.g. "image/png"
      userInstruction?: string;
    };

    const { screens, designBrief, appName, logoData, logoMimeType, userInstruction } = body;
    if (!screens?.length) {
      return NextResponse.json({ error: "screens required" }, { status: 400 });
    }

    const model = process.env.OPENAI_MODEL ?? "gpt-4o";
    const hasLogo = !!(logoData && logoMimeType);
    const logoDataUrl = hasLogo ? `data:${logoMimeType};base64,${logoData}` : null;

    const systemPrompt = hasLogo
      ? `You are a frontend developer embedding a brand logo into an existing mobile app HTML screen.
STRICT RULES:
- NEVER change any text content, screen layout, or element structure
- For the logo: find existing logo/brand img elements (look for img tags in headers, navbars, or with class/id/alt containing "logo", "brand", "icon") and update their src to "${LOGO_PLACEHOLDER}"
- If no existing logo img is found, ADD one <img src="${LOGO_PLACEHOLDER}" style="height:36px;width:auto;object-fit:contain;" alt="logo"> in the first header, nav, or top bar element
- Apply the brand color palette from the logo to CSS colors (backgrounds, buttons, accents)
- Return ONLY the raw updated HTML, no markdown, no explanation`
      : `You are a frontend developer applying brand design to existing mobile app HTML screens.
STRICT RULES:
- NEVER change any text content, layout structure, or functionality
- ONLY update: CSS colors, background colors, font colors, button colors, gradient colors
- Preserve the complete HTML structure exactly
- Return ONLY the raw updated HTML, no markdown, no explanation`;

    const targetScreens = screens.slice(0, 9);

    const updated = await Promise.all(
      targetScreens.map(async (screen) => {
        try {
          type ContentPart =
            | { type: "text"; text: string }
            | { type: "image_url"; image_url: { url: string; detail: "high" } };

          let userContent: string | ContentPart[];

          if (hasLogo && logoDataUrl) {
            const instruction = userInstruction
              ? `User request: "${userInstruction}"\n\n`
              : "";
            userContent = [
              {
                type: "image_url",
                image_url: { url: logoDataUrl, detail: "high" },
              },
              {
                type: "text",
                text: `${instruction}App: "${appName}" — Screen: "${screen.name}"

The image above is the user's logo/brand asset. Your job:
1. Find any existing logo/icon/brand image in the HTML and set its src to exactly "${LOGO_PLACEHOLDER}"
2. If no logo image exists, add <img src="${LOGO_PLACEHOLDER}" style="height:36px;width:auto;object-fit:contain;display:block;" alt="${appName} logo"> inside the first <header>, <nav>, or top bar container
3. Apply the brand colors from the logo to the app's primary color, buttons, and accents

${designBrief ? `Additional design context:\n${designBrief}` : ""}

Current HTML (preserve all content, structure, and text exactly):
${screen.html.slice(0, 10000)}

Return ONLY the updated HTML.`,
              },
            ];
          } else {
            userContent = `App: "${appName}" — Screen: "${screen.name}"
${userInstruction ? `User request: "${userInstruction}"\n` : ""}
${designBrief ? `Design reference:\n${designBrief}\n` : ""}
Current HTML (preserve all content and structure exactly):
${screen.html.slice(0, 14000)}

Return ONLY the updated HTML with new colors applied.`;
          }

          const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model,
              max_tokens: 4096,
              temperature: 0.1,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userContent },
              ],
            }),
          });

          if (!res.ok) {
            console.error(`[apply-design] screen ${screen.id} OpenAI error:`, res.status);
            return screen;
          }

          const json = await res.json() as { choices: Array<{ message: { content: string } }> };
          const raw = json.choices?.[0]?.message?.content?.trim() ?? "";
          if (raw.length < 200) return screen;

          // Strip accidental markdown fences
          let clean = raw
            .replace(/^```(?:html)?\n?/i, "")
            .replace(/\n?```$/, "")
            .trim();

          // Replace the placeholder with the actual base64 data URL
          if (hasLogo && logoDataUrl && clean.includes(LOGO_PLACEHOLDER)) {
            clean = clean.split(LOGO_PLACEHOLDER).join(logoDataUrl);
          }

          return { ...screen, html: clean };
        } catch {
          return screen;
        }
      })
    );

    return NextResponse.json({ screens: updated });
  } catch (err) {
    console.error("[apply-design]", err);
    return NextResponse.json({ error: "Failed to apply design" }, { status: 500 });
  }
}
