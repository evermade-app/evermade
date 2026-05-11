import JSZip from "jszip";
import { gzipSync } from "zlib";

// ── Constants ─────────────────────────────────────────────────────────────────

const MODEL = "gpt-4o-mini";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const RETRY_DELAY_MS = 10_000;
const MAX_RETRIES = 3;
const SCREEN_DELAY_MS = 3_000;

// ── GPT helper ────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

async function callGPT(
  messages: Array<{ role: string; content: string }>,
  apiKey: string,
  attempt = 0
): Promise<string> {
  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: MODEL, messages, max_tokens: 4096, temperature: 0.15 }),
  });

  if (res.status === 429) {
    if (attempt < MAX_RETRIES) {
      const body = await res.text().catch(() => "");
      console.warn(`[expo-starter] 429 (attempt ${attempt + 1}/${MAX_RETRIES}): ${body}`);
      await sleep(RETRY_DELAY_MS);
      return callGPT(messages, apiKey, attempt + 1);
    }
    throw new Error(`OpenAI 429 after ${MAX_RETRIES} retries`);
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`OpenAI ${res.status}: ${body}`);
  }
  const data = await res.json() as { choices: Array<{ message: { content: string } }> };
  return data.choices[0]?.message?.content ?? "";
}

// ── Screen generator ──────────────────────────────────────────────────────────

const SCREEN_SYSTEM_PROMPT = `You are a senior React Native engineer. Convert a Sleek HTML screen design to a production-quality React Native screen using the expo-starter template.

TEMPLATE STACK: Expo Router + NativeWind (Tailwind CSS for React Native) + shadcn-style components.

AVAILABLE IMPORTS (only use these, no others):
\`\`\`
import { Container } from "@/components/container";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { View, Pressable, Image, FlatList, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/lib/theme/use-theme-color";
import { useState, useCallback } from "react";
\`\`\`

NATIVEWIND CLASSES to use:
- Layout: flex-1, flex-row, items-center, justify-center, justify-between, gap-2, gap-4, p-4, p-6, px-4, py-2, w-full, h-full, rounded-xl, rounded-lg, rounded-full, overflow-hidden
- Colors: bg-background, bg-card, bg-primary, bg-muted, bg-secondary, text-foreground, text-muted-foreground, text-primary, text-card-foreground, border-border
- Typography: text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl, font-medium, font-semibold, font-bold, font-extrabold, leading-tight
- Borders: border, border-border, rounded-xl, rounded-lg
- Spacing: mt-2, mt-4, mt-6, mb-2, mb-4, mb-6, mr-2, ml-2, mx-4, my-2

RULES:
- Export default function named exactly as specified
- Wrap ALL content in <Container className="p-6"> — it handles safe area + scroll
- Use <Text> from "@/components/ui/text", never from "react-native"
- Use className for all styling — NO StyleSheet.create, NO style={{}} objects
- Reproduce the visual hierarchy, colors, and content from the HTML design
- Use Ionicons for icons (size 20-28 typical): home, heart, settings, person, star, search, add, chevron-forward, etc.
- Keep realistic placeholder content/data from the design
- If design shows a list, render 3-5 hardcoded items
- NEVER import from: react-navigation, expo-constants, expo-modules-core

Return ONLY the TypeScript code — no markdown fences, no explanation.`;

export async function generateExpoStarterScreen(
  screenName: string,
  componentName: string,
  screenHtml: string,
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  // Strip massive <style> blocks and <script> tags from HTML to reduce tokens
  const trimmedHtml = screenHtml
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "<!-- styles removed -->")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "<!-- script removed -->")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, 12_000); // cap at ~3k tokens of HTML

  const messages = [
    { role: "system", content: SCREEN_SYSTEM_PROMPT },
    {
      role: "user",
      content: `Convert this screen to expo-starter React Native code.
Component name: ${componentName}
Screen name: "${screenName}"

HTML design:
${trimmedHtml}`,
    },
  ];

  const raw = await callGPT(messages, apiKey);
  return raw
    .replace(/^```(?:tsx?|typescript)?\n?/, "")
    .replace(/\n?```$/, "")
    .trim();
}

// ── Tabs layout generator ─────────────────────────────────────────────────────

const TAB_ICON: Record<string, string> = {
  home: "home", dashboard: "home", welcome: "home",
  core: "flash", feature: "flash", main: "flash",
  secondary: "search", explore: "search", discover: "search",
  profile: "person", account: "person", me: "person",
  settings: "settings", config: "settings", preferences: "settings",
  chat: "chatbubble", message: "chatbubble",
  map: "map", location: "location",
  shop: "cart", store: "cart",
  activity: "pulse", health: "fitness",
  wallet: "wallet", finance: "cash", payment: "card",
};

function screenToTabRoute(componentName: string): string {
  return componentName
    .replace(/Screen$/, "")
    .replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)
    .replace(/^-/, "")
    .toLowerCase();
}

function getTabIcon(screenName: string): string {
  const lower = screenName.toLowerCase();
  for (const [key, icon] of Object.entries(TAB_ICON)) {
    if (lower.includes(key)) return icon;
  }
  return "ellipse";
}

export interface ScreenForTabs {
  screenName: string;
  componentName: string;
  isOnboarding?: boolean;
}

export function buildExpoStarterTabsLayout(screens: ScreenForTabs[]): string {
  const tabs = screens.filter((s) => !s.isOnboarding);

  const screenLines = tabs
    .map((s) => {
      const route = screenToTabRoute(s.componentName);
      const icon = getTabIcon(s.screenName);
      const label = s.screenName.replace(/\s*(Screen|Dashboard|Feature)\s*/gi, "").trim() || s.screenName;
      return `      <Tabs.Screen
        name="${route}"
        options={{
          title: "${label}",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons color={color} name="${icon}" size={size} />
          ),
        }}
      />`;
    })
    .join("\n");

  return `import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useThemeColor } from "@/lib/theme/use-theme-color";

export default function TabLayout() {
  const [background, foreground] = useThemeColor(["background", "foreground"]);

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: background },
        headerTintColor: foreground,
        headerTitleStyle: { color: foreground, fontWeight: "600" },
        tabBarStyle: { backgroundColor: background },
        headerShown: false,
      }}
    >
${screenLines}
    </Tabs>
  );
}
`;
}

export function buildExpoStarterRootLayout(appName: string): string {
  return `import "@/global.css";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppThemeProvider } from "@/contexts/app-theme-context";

export const unstable_settings = { initialRouteName: "(tabs)" };

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
}
`;
}

// ── ZIP assembler ─────────────────────────────────────────────────────────────

export interface ExpoStarterScreen {
  componentName: string;
  screenName: string;
  code: string;
  isOnboarding?: boolean;
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Generates a minimal solid-colour 32x32 PNG (1-bit depth, grayscale) as a placeholder icon.
// Keeps the ZIP small — just enough for Expo to bundle without crashing.
function solidPng(r: number, g: number, b: number): Buffer {
  const { deflateSync } = require("zlib") as typeof import("zlib");
  const w = 64; const h = 64;
  const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 2;
  const row = Buffer.alloc(1 + w * 3);
  for (let x = 0; x < w; x++) { row[1 + x * 3] = r; row[1 + x * 3 + 1] = g; row[1 + x * 3 + 2] = b; }
  const raw = Buffer.concat(Array.from({ length: h }, () => row));
  const crc = (buf: Buffer) => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) { let c = i; for (let j = 0; j < 8; j++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[i] = c; }
    let crc = 0xffffffff;
    for (const byte of buf) crc = (t[(crc ^ byte) & 0xff] ?? 0) ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  };
  const chunk = (type: string, data: Buffer) => {
    const l = Buffer.alloc(4); l.writeUInt32BE(data.length);
    const t = Buffer.from(type); const c = Buffer.alloc(4);
    c.writeUInt32BE(crc(Buffer.concat([t, data]))); return Buffer.concat([l, t, data, c]);
  };
  return Buffer.concat([PNG_SIG, chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}

export async function assembleExpoStarterZip(
  appName: string,
  screens: ExpoStarterScreen[],
  tabsLayout: string,
  rootLayout: string,
): Promise<Buffer> {
  const zip = new JSZip();
  const slug = toSlug(appName);
  const tabs = screens.filter((s) => !s.isOnboarding);

  // ── package.json ────────────────────────────────────────────────────────────
  zip.file("package.json", JSON.stringify({
    name: slug,
    version: "1.0.0",
    main: "expo-router/entry",
    scripts: { start: "expo start" },
    dependencies: {
      expo: "~54.0.0",
      "expo-router": "~4.0.0",
      react: "18.3.1",
      "react-native": "0.76.9",
      "expo-linear-gradient": "~14.0.0",
      "react-native-safe-area-context": "4.12.0",
      "react-native-screens": "~4.4.0",
      "@expo/vector-icons": "^14.0.0",
    },
    devDependencies: {
      "babel-preset-expo": "~13.0.0",
      typescript: "~5.3.0",
    },
  }, null, 2));

  // ── app.json ────────────────────────────────────────────────────────────────
  zip.file("app.json", JSON.stringify({
    expo: {
      name: appName,
      slug,
      scheme: slug,
      version: "1.0.0",
      platforms: ["ios", "android"],
      sdkVersion: "54.0.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      splash: { image: "./assets/splash.png", resizeMode: "contain", backgroundColor: "#09090b" },
    },
  }, null, 2));

  // ── tsconfig.json ────────────────────────────────────────────────────────────
  zip.file("tsconfig.json", JSON.stringify({
    extends: "expo/tsconfig.base",
    compilerOptions: { strict: true },
  }, null, 2));

  // ── babel.config.js ─────────────────────────────────────────────────────────
  zip.file("babel.config.js", `module.exports = function(api) {
  api.cache(true);
  return { presets: ["babel-preset-expo"] };
};
`);

  // ── app/_layout.tsx ──────────────────────────────────────────────────────
  zip.file("app/_layout.tsx", rootLayout);

  // ── app/(tabs)/_layout.tsx ───────────────────────────────────────────────
  zip.file("app/(tabs)/_layout.tsx", tabsLayout);

  // ── Generated screen files ───────────────────────────────────────────────────
  for (const screen of tabs) {
    const route = screenToTabRoute(screen.componentName);
    zip.file(`app/(tabs)/${route}.tsx`, screen.code);
  }

  // ── Placeholder PNG assets ───────────────────────────────────────────────────
  const darkPng = solidPng(9, 9, 11);
  const lightPng = solidPng(250, 250, 250);
  zip.file("assets/icon.png", lightPng);
  zip.file("assets/splash.png", darkPng);

  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}

// ── Claude files ZIP assembler ────────────────────────────────────────────────
// Takes the raw file map from convertSleekPromptToExpoApp and wraps it in a
// runnable Expo project with the correct package.json and config files.
export async function assembleClaudeZip(
  appName: string,
  files: Record<string, string>,
): Promise<Buffer> {
  const zip = new JSZip();
  const slug = toSlug(appName);

  // ── package.json ────────────────────────────────────────────────────────────
  zip.file("package.json", JSON.stringify({
    name: slug,
    version: "1.0.0",
    main: "expo-router/entry",
    scripts: { start: "expo start" },
    dependencies: {
      expo: "~54.0.0",
      "expo-router": "~4.0.0",
      react: "18.3.1",
      "react-native": "0.76.9",
      "expo-linear-gradient": "~14.0.0",
      "react-native-safe-area-context": "4.12.0",
      "react-native-screens": "~4.4.0",
      "@expo/vector-icons": "^14.0.0",
    },
    devDependencies: {
      "babel-preset-expo": "~13.0.0",
      typescript: "~5.3.0",
    },
  }, null, 2));

  // ── app.json ────────────────────────────────────────────────────────────────
  zip.file("app.json", JSON.stringify({
    expo: {
      name: appName,
      slug,
      scheme: slug,
      version: "1.0.0",
      platforms: ["ios", "android"],
      sdkVersion: "54.0.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      splash: { image: "./assets/splash.png", resizeMode: "contain", backgroundColor: "#09090b" },
    },
  }, null, 2));

  // ── tsconfig.json ────────────────────────────────────────────────────────────
  zip.file("tsconfig.json", JSON.stringify({
    extends: "expo/tsconfig.base",
    compilerOptions: { strict: true },
  }, null, 2));

  // ── babel.config.js ─────────────────────────────────────────────────────────
  zip.file("babel.config.js", `module.exports = function(api) {
  api.cache(true);
  return { presets: ["babel-preset-expo"] };
};
`);

  // ── Claude-generated app files ───────────────────────────────────────────────
  for (const [path, content] of Object.entries(files)) {
    zip.file(path, content);
  }

  // ── Placeholder PNG assets ───────────────────────────────────────────────────
  const darkPng = solidPng(9, 9, 11);
  const lightPng = solidPng(250, 250, 250);
  zip.file("assets/icon.png", lightPng);
  zip.file("assets/splash.png", darkPng);

  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}

// ── Batch screen converter with delays ───────────────────────────────────────

export async function convertScreensWithExpoStarter(
  screens: Array<{ id: string; name: string; html: string; componentName: string }>,
  onProgress: (i: number, name: string) => void,
  onDone: (i: number, id: string, componentName: string, code: string) => void,
): Promise<void> {
  for (let i = 0; i < screens.length; i++) {
    if (i > 0) await sleep(SCREEN_DELAY_MS);
    const s = screens[i]!;
    onProgress(i, s.name);
    const code = await generateExpoStarterScreen(s.name, s.componentName, s.html);
    onDone(i, s.id, s.componentName, code);
  }
}
