import Anthropic from "@anthropic-ai/sdk";

const BASE = "https://sleek.design/api/v1";

const CLAUDE_SYSTEM_PROMPT = `You are an expert React Native / Expo developer. You will receive a Sleek Design AI Prompt containing JSX component designs and must convert them into a complete, working Expo SDK 54 app using expo-router.

STRICT RULES — follow exactly:
NAVIGATION:
- Use expo-router ONLY. No @react-navigation.
- Bottom tab bar → app/(tabs)/_layout.tsx with <Tabs>
- Detail screens with back button → app/detail.tsx as Stack screen
- app/_layout.tsx must wrap everything in <Stack screenOptions={{ headerShown: false }}>

STYLING:
- StyleSheet.create() ONLY. No NativeWind, no Tailwind, no className.
- Convert Tailwind colors directly to hex values from the design tokens provided
- Convert rem to numbers (1rem = 16px)
- Flexbox direction is column by default in RN (not row like web)

COMPONENTS:
- <div> → <View>
- <span>, <p>, any text → <Text> (ALL text must be in <Text>)
- <img src="url"> → <Image source={{uri: 'url'}} style={{width, height}} />
- <button> → <Pressable onPress={() => {}}>
- <input> → <TextInput>
- <a href> → use router.push() from expo-router
- CSS gradients → <LinearGradient> from expo-linear-gradient

ICONS:
- @iconify/react is NOT available in React Native
- Replace ALL Icon components with text emoji or simple View placeholders
- Example: <Icon icon="solar:home-bold"/> → <Text>🏠</Text>

FORBIDDEN IMPORTS (will crash the app):
- expo-constants ❌
- expo-modules-core ❌
- expo-device ❌
- @gorhom/bottom-sheet ❌
- expo-google-fonts ❌
- @expo-google-fonts/* ❌
- react-native-gesture-handler ❌
- @iconify/react ❌

ALLOWED PACKAGES (already in package.json):
- react-native (View, Text, Image, ScrollView, FlatList, Pressable, TextInput, StyleSheet, SafeAreaView, ActivityIndicator)
- expo-router (Link, useRouter, Tabs, Stack)
- expo-linear-gradient (LinearGradient)
- @expo/vector-icons (Ionicons, MaterialCommunityIcons) — use ONLY if needed
- react (useState, useEffect)

OUTPUT FORMAT — return ONLY valid JSON, no markdown, no explanation:
{
  "files": {
    "app/_layout.tsx": "...full file content...",
    "app/(tabs)/_layout.tsx": "...full file content...",
    "app/(tabs)/index.tsx": "...home screen content...",
    "app/(tabs)/explore.tsx": "...second tab content...",
    "app/(tabs)/profile.tsx": "...profile tab content...",
    "app/detail.tsx": "...detail screen content...",
    "app/settings.tsx": "...settings screen content..."
  }
}

Generate ALL screens from the design. Each screen must be a complete, self-contained React Native component that renders correctly.`;

async function tryGetPromptFromSleekAPI(projectId: string): Promise<string | null> {
  const key = process.env.SLEEK_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch(`${BASE}/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    const json = await res.json() as { data?: Record<string, unknown> };
    const d = json.data ?? {};
    const prompt = d.aiPrompt ?? d.prompt ?? d.designPrompt ?? d.ai_prompt;
    return typeof prompt === "string" && prompt.length > 50 ? prompt : null;
  } catch {
    return null;
  }
}

function buildPromptFromScreens(screens: Array<{ name: string; html: string }>): string {
  const parts = screens.map((s, i) => {
    const trimmed = s.html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim()
      .slice(0, 2500);
    return `=== Screen ${i + 1}: ${s.name} ===\n${trimmed}`;
  });
  return `Here are ${screens.length} app screens as HTML designs. Convert them all to React Native:\n\n${parts.join("\n\n")}`;
}

export async function getSleekAIPrompt(
  projectId: string | null,
  screens: Array<{ name: string; html: string }>,
): Promise<string> {
  if (projectId) {
    const fromApi = await tryGetPromptFromSleekAPI(projectId);
    if (fromApi) {
      console.log("[sleek-to-rn] got AI prompt from Sleek API, length:", fromApi.length);
      return fromApi;
    }
  }
  console.log("[sleek-to-rn] building prompt from screen HTML (fallback)");
  return buildPromptFromScreens(screens);
}

export async function convertSleekPromptToExpoApp(
  sleekAIPrompt: string,
  appName: string,
): Promise<{ files: Record<string, string> }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const client = new Anthropic({ apiKey });

  console.log("[sleek-to-rn] calling Claude, prompt length:", sleekAIPrompt.length);

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    system: CLAUDE_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `[SLEEK AI PROMPT]\n${sleekAIPrompt}\n\nApp name: ${appName}\n\nConvert all screens to React Native. Return JSON only.`,
      },
    ],
  });

  const block = message.content[0];
  if (!block || block.type !== "text") throw new Error("Claude returned no text");

  const text = block.text;
  console.log("[sleek-to-rn] Claude response length:", text.length);

  const cleaned = text
    .replace(/^```json?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();

  let parsed: { files: Record<string, string> };
  try {
    parsed = JSON.parse(cleaned) as { files: Record<string, string> };
  } catch (e) {
    // Try to extract JSON from inside the text
    const match = cleaned.match(/\{[\s\S]*"files"[\s\S]*\}/);
    if (!match) throw new Error(`Claude returned non-JSON: ${text.slice(0, 200)}`);
    parsed = JSON.parse(match[0]) as { files: Record<string, string> };
  }

  if (!parsed.files || typeof parsed.files !== "object") {
    throw new Error("Claude response missing 'files' object");
  }

  const fileCount = Object.keys(parsed.files).length;
  console.log("[sleek-to-rn] Claude generated", fileCount, "files:", Object.keys(parsed.files).join(", "));

  return parsed;
}
