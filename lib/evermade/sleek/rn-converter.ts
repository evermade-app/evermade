import type { SleekScreen } from "./client";

const MODEL = "gpt-4o";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

const SYSTEM_PROMPT = `You are a senior React Native engineer. Convert mobile screen designs into production-quality React Native + TypeScript code.

RULES:
- Use React Native core components only: View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, SafeAreaView, StatusBar, FlatList, Pressable, ImageBackground
- Use StyleSheet.create() for all styles — no inline objects
- Output a single self-contained .tsx file that exports a default React component
- Component name = PascalCase version of the screen name (e.g. "Home Screen" → HomeScreen)
- Colors must be hardcoded hex values matching the design
- NEVER import from expo-constants, expo-modules-core, or any Expo SDK package — these conflict with Expo Go's built-in modules
- NEVER import from react-navigation, @react-navigation, or any icons package
- All values (insets, status bar height, etc.) must be hardcoded — do not read them from device APIs
- Status bar style: dark-content for light bg, light-content for dark bg
- Return ONLY the TypeScript code — no markdown, no explanation`;

interface ScreenCode {
  screenName: string;
  componentName: string;
  code: string;
}

async function convertScreen(screen: SleekScreen): Promise<ScreenCode> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const messages: Array<{ role: string; content: string | Array<{ type: string; text?: string; image_url?: { url: string } }> }> = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  if (screen.screenshotUrl && screen.screenshotUrl.startsWith("http")) {
    messages.push({
      role: "user",
      content: [
        {
          type: "image_url",
          image_url: { url: screen.screenshotUrl },
        },
        {
          type: "text",
          text: `Convert this mobile screen design to React Native TypeScript.\nScreen name: "${screen.name}"\nHTML source for reference:\n${screen.html ?? ""}`,
        },
      ],
    });
  } else {
    messages.push({
      role: "user",
      content: `Convert this mobile screen HTML to React Native TypeScript.\nScreen name: "${screen.name}"\n\nHTML:\n${screen.html ?? ""}`,
    });
  }

  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: MODEL, messages, max_tokens: 4096, temperature: 0.2 }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`OpenAI ${res.status}: ${body}`);
  }

  const data = await res.json() as { choices: Array<{ message: { content: string } }> };
  const raw = data.choices[0]?.message?.content ?? "";
  const stripped = raw.replace(/^```(?:tsx?|typescript)?\n?/, "").replace(/\n?```$/, "").trim();
  // Strip any Expo SDK imports that conflict with Expo Go's built-in TurboModules
  const code = stripped.replace(/^import\s+.*from\s+['"]expo-constants['"];?\s*\n?/gm, "")
                        .replace(/^import\s+.*from\s+['"]expo-modules-core['"];?\s*\n?/gm, "");

  const safeName = screen.name.replace(/[^a-zA-Z0-9 ]/g, "").trim();
  const componentName = safeName.split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("") + "Screen";

  return { screenName: screen.name, componentName, code };
}

export async function convertScreensToRN(screens: SleekScreen[]): Promise<ScreenCode[]> {
  const results: ScreenCode[] = [];
  for (const screen of screens) {
    results.push(await convertScreen(screen));
  }
  return results;
}
