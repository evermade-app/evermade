import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";

interface Screen {
  id: string;
  name: string;
  html: string;
}

// POST { screens, designBrief, appName }
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
    };

    const { screens, designBrief, appName } = body;
    if (!screens?.length || !designBrief) {
      return NextResponse.json({ error: "screens and designBrief required" }, { status: 400 });
    }

    const model = process.env.OPENAI_MODEL ?? "gpt-4o";

    const systemPrompt = `You are a frontend developer applying brand design to existing mobile app HTML screens.
RULES:
- NEVER change any text content, layout structure, or functionality
- NEVER add or remove any elements
- ONLY update: CSS colors, background colors, font colors, border colors, button colors, gradient colors, logo/image src or add a logo element in the header/navbar area if one is described
- Preserve the complete HTML structure exactly
- Return ONLY the raw updated HTML, no markdown, no explanation`;

    // Process screens in parallel — capped at 9
    const targetScreens = screens.slice(0, 9);
    const updated = await Promise.all(
      targetScreens.map(async (screen) => {
        try {
          const userPrompt = `App name: ${appName}

Apply this design reference to the screen "${screen.name}":
${designBrief}

Current screen HTML:
${screen.html.slice(0, 14000)}

Return ONLY the updated HTML with the new colors/logo applied. Keep every element, every text, every structure identical.`;

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
                { role: "user", content: userPrompt },
              ],
            }),
          });

          if (!res.ok) {
            console.error(`[apply-design] screen ${screen.id} OpenAI error:`, res.status);
            return screen; // keep original on error
          }

          const json = await res.json() as { choices: Array<{ message: { content: string } }> };
          const updatedHtml = json.choices?.[0]?.message?.content?.trim() ?? "";

          // Sanity check: updated HTML must be substantial
          if (updatedHtml.length < 200) return screen;

          // Strip any accidental markdown code fences
          const clean = updatedHtml
            .replace(/^```(?:html)?\n?/i, "")
            .replace(/\n?```$/, "")
            .trim();

          return { ...screen, html: clean };
        } catch {
          return screen; // keep original on any error
        }
      })
    );

    return NextResponse.json({ screens: updated });
  } catch (err) {
    console.error("[apply-design]", err);
    return NextResponse.json({ error: "Failed to apply design" }, { status: 500 });
  }
}
