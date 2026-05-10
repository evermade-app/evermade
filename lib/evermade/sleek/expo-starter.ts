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
import {
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from "@expo-google-fonts/nunito";
import {
  Recursive_400Regular,
  Recursive_700Bold,
} from "@expo-google-fonts/recursive";
import { JetBrainsMono_400Regular } from "@expo-google-fonts/jetbrains-mono";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalHost } from "@rn-primitives/portal";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { hideAsync, preventAutoHideAsync } from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { AppThemeProvider } from "@/contexts/app-theme-context";

preventAutoHideAsync();

export const unstable_settings = { initialRouteName: "(tabs)" };

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Nunito_300Light, Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold,
    Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black,
    Recursive_400Regular, Recursive_700Bold,
    JetBrainsMono_400Regular,
  });

  useEffect(() => { if (fontsLoaded) hideAsync(); }, [fontsLoaded]);
  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <AppThemeProvider>
          <BottomSheetModalProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <PortalHost />
          </BottomSheetModalProvider>
        </AppThemeProvider>
      </KeyboardProvider>
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
    private: true,
    main: "expo-router/entry",
    scripts: {
      start: "expo start",
      dev: "expo start --clear",
      android: "expo run:android",
      ios: "expo run:ios",
      "check-types": "tsc --noEmit",
    },
    dependencies: {
      "@expo-google-fonts/jetbrains-mono": "^0.4.1",
      "@expo-google-fonts/nunito": "^0.4.2",
      "@expo-google-fonts/recursive": "^0.4.2",
      "@expo/metro-runtime": "~6.1.2",
      "@expo/vector-icons": "^15.0.3",
      "@gorhom/bottom-sheet": "^5",
      "@rn-primitives/portal": "^1.3.0",
      "@rn-primitives/slot": "^1.2.0",
      "class-variance-authority": "^0.7.1",
      clsx: "^2.1.1",
      expo: "^54.0.23",
      "expo-constants": "~18.0.10",
      "expo-font": "~14.0.9",
      "expo-haptics": "^15.0.7",
      "expo-linking": "~8.0.8",
      "expo-router": "~6.0.14",
      "expo-splash-screen": "^31.0.13",
      "expo-status-bar": "~3.0.8",
      react: "19.1.0",
      "react-dom": "19.1.0",
      "react-native": "0.81.5",
      "react-native-gesture-handler": "^2.28.0",
      "react-native-keyboard-controller": "1.18.5",
      "react-native-reanimated": "~4.1.1",
      "react-native-safe-area-context": "~5.6.0",
      "react-native-screens": "~4.16.0",
      "react-native-svg": "15.15.1",
      "react-native-web": "^0.21.0",
      "tailwind-merge": "^3.4.0",
      tailwindcss: "^4.1.18",
      "tailwindcss-animate": "^1.0.7",
      uniwind: "^1.2.2",
    },
    devDependencies: {
      "@types/react": "~19.1.0",
      "@types/node": "^24.0.0",
      typescript: "^5",
      "babel-preset-expo": "~12.0.0",
    },
  }, null, 2));

  // ── app.json ────────────────────────────────────────────────────────────────
  zip.file("app.json", JSON.stringify({
    expo: {
      name: appName,
      slug,
      scheme: slug,
      version: "1.0.0",
      orientation: "portrait",
      userInterfaceStyle: "automatic",
      icon: "./assets/images/icon.png",
      splash: { image: "./assets/images/splash-icon.png", resizeMode: "contain", backgroundColor: "#09090b" },
      ios: { supportsTablet: true, bundleIdentifier: `com.evermade.${slug}` },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/images/android-icon-foreground.png",
          backgroundImage: "./assets/images/android-icon-background.png",
          monochromeImage: "./assets/images/android-icon-monochrome.png",
        },
        package: `com.evermade.${slug}`,
      },
      web: { bundler: "metro" },
      plugins: ["expo-font"],
      experiments: { typedRoutes: true },
    },
  }, null, 2));

  // ── tsconfig.json ────────────────────────────────────────────────────────────
  zip.file("tsconfig.json", JSON.stringify({
    extends: "expo/tsconfig.base",
    compilerOptions: { strict: true, baseUrl: ".", paths: { "@/*": ["./src/*"] } },
    include: ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"],
  }, null, 2));

  // ── metro.config.js ─────────────────────────────────────────────────────────
  zip.file("metro.config.js", `const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

let config = getDefaultConfig(__dirname);
config = withUniwindConfig(config, {
  cssEntryFile: "./src/global.css",
  dtsFile: "./src/uniwind-types.d.ts",
});
module.exports = config;
`);

  // ── babel.config.js ─────────────────────────────────────────────────────────
  zip.file("babel.config.js", `module.exports = function(api) {
  api.cache(true);
  return { presets: ["babel-preset-expo"] };
};
`);

  // ── src/global.css ───────────────────────────────────────────────────────────
  zip.file("src/global.css", `@import "tailwindcss";
@import "uniwind";

@theme {
  --font-light: "Nunito_300Light";
  --font-normal: "Nunito_400Regular";
  --font-medium: "Nunito_500Medium";
  --font-semibold: "Nunito_600SemiBold";
  --font-bold: "Nunito_700Bold";
  --font-extrabold: "Nunito_800ExtraBold";
  --font-black: "Nunito_900Black";
  --font-heading-normal: "Recursive_400Regular";
  --font-heading-bold: "Recursive_700Bold";
  --font-mono: "JetBrainsMono_400Regular";
  --radius: 1rem;
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer theme {
  :root {
    @variant light {
      --color-background: #ffffff;
      --color-foreground: #09090b;
      --color-primary: #15aeed;
      --color-primary-foreground: #ffffff;
      --color-secondary: #f4f4f5;
      --color-secondary-foreground: #18181b;
      --color-muted: #f4f4f5;
      --color-muted-foreground: #71717a;
      --color-accent: #e0f2fe;
      --color-accent-foreground: #0369a1;
      --color-destructive: #ef4444;
      --color-card: #f4f4f5;
      --color-card-foreground: #09090b;
      --color-popover: #ffffff;
      --color-popover-foreground: #09090b;
      --color-border: #e4e4e7;
      --color-input: #e4e4e7;
      --color-ring: #15aeed;
    }
    @variant dark {
      --color-background: #09090b;
      --color-foreground: #fafafa;
      --color-primary: #15aeed;
      --color-primary-foreground: #ffffff;
      --color-secondary: #27272a;
      --color-secondary-foreground: #fafafa;
      --color-muted: #27272a;
      --color-muted-foreground: #a1a1aa;
      --color-accent: #0c4a6e;
      --color-accent-foreground: #7dd3fc;
      --color-destructive: #dc2626;
      --color-card: #18181b;
      --color-card-foreground: #fafafa;
      --color-popover: #18181b;
      --color-popover-foreground: #fafafa;
      --color-border: #27272a;
      --color-input: #27272a;
      --color-ring: #15aeed;
    }
  }
}
`);

  // ── src/app/_layout.tsx ──────────────────────────────────────────────────────
  zip.file("src/app/_layout.tsx", rootLayout);

  // ── src/app/(tabs)/_layout.tsx ───────────────────────────────────────────────
  zip.file("src/app/(tabs)/_layout.tsx", tabsLayout);

  // ── Generated screen files ───────────────────────────────────────────────────
  for (const screen of tabs) {
    const route = screenToTabRoute(screen.componentName);
    zip.file(`src/app/(tabs)/${route}.tsx`, screen.code);
  }

  // ── UI components (verbatim from expo-starter) ────────────────────────────────
  zip.file("src/lib/utils/cn.ts", `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`);

  zip.file("src/lib/theme/constants.ts", `const THEME_COLORS = [
  "background","foreground","primary","primary-foreground","secondary",
  "secondary-foreground","muted","muted-foreground","accent","accent-foreground",
  "destructive","card","card-foreground","popover","popover-foreground",
  "border","input","ring",
  "chart-1","chart-2","chart-3","chart-4","chart-5",
] as const;
type ThemeColor = (typeof THEME_COLORS)[number];
export { THEME_COLORS };
export type { ThemeColor };
`);

  zip.file("src/lib/theme/use-theme-color.ts", `import { useCSSVariable } from "uniwind";
import type { ThemeColor } from "./constants";
type CreateStringTuple<N extends number, TAcc extends string[] = []> =
  TAcc["length"] extends N ? TAcc : CreateStringTuple<N, [...TAcc, string]>;
export function useThemeColor(themeColor: ThemeColor): string;
export function useThemeColor<T extends readonly [ThemeColor, ...ThemeColor[]]>(themeColor: T): CreateStringTuple<T["length"]>;
export function useThemeColor(themeColor: ThemeColor[]): string[];
export function useThemeColor(themeColor: ThemeColor | ThemeColor[]): string | string[] {
  const isArray = Array.isArray(themeColor);
  const vars = isArray ? themeColor.map(c => \`--color-\${c}\`) : [\`--color-\${themeColor}\`];
  const resolved = useCSSVariable(vars);
  const processed = resolved.map(c => typeof c === "string" ? c : typeof c === "number" ? String(c) : "invalid");
  return isArray ? processed : processed[0]!;
}
`);

  zip.file("src/components/container.tsx", `import type { PropsWithChildren } from "react";
import { View, ScrollView, type ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/utils/cn";

type Props = ViewProps & { className?: string };

export function Container({ children, className, style, ...props }: PropsWithChildren<Props>) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className={cn("flex-1 bg-background", className)}
      style={[{ paddingBottom: insets.bottom }, style]}
      {...props}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>{children}</ScrollView>
    </View>
  );
}
`);

  zip.file("src/components/ui/text.tsx", `import * as Slot from "@rn-primitives/slot";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { Platform, Text as RNText, type Role } from "react-native";
import { cn } from "@/lib/utils/cn";

const textVariants = cva(cn("text-base text-foreground", Platform.select({ web: "select-text" })), {
  variants: {
    variant: {
      default: "",
      h1: cn("text-center font-extrabold text-4xl tracking-tight", Platform.select({ web: "scroll-m-20 text-balance" })),
      h2: cn("border-border border-b pb-2 font-semibold text-3xl tracking-tight", Platform.select({ web: "scroll-m-20 first:mt-0" })),
      h3: cn("font-semibold text-2xl tracking-tight", Platform.select({ web: "scroll-m-20" })),
      h4: cn("font-semibold text-xl tracking-tight", Platform.select({ web: "scroll-m-20" })),
      p: "mt-3 leading-7 sm:mt-6",
      blockquote: "mt-4 border-l-2 pl-3 italic sm:mt-6 sm:pl-6",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono font-semibold text-sm",
      lead: "text-muted-foreground text-xl",
      large: "font-semibold text-lg",
      small: "font-medium text-sm leading-none",
      muted: "text-muted-foreground text-sm",
    },
  },
  defaultVariants: { variant: "default" },
});

type TextVariantProps = VariantProps<typeof textVariants>;
type TextVariant = NonNullable<TextVariantProps["variant"]>;

const ROLE: Partial<Record<TextVariant, Role>> = { h1: "heading", h2: "heading", h3: "heading", h4: "heading" };
const ARIA_LEVEL: Partial<Record<TextVariant, string>> = { h1: "1", h2: "2", h3: "3", h4: "4" };
const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({ className, asChild = false, variant = "default", ...props }: React.ComponentProps<typeof RNText> & TextVariantProps & React.RefAttributes<RNText> & { asChild?: boolean }) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot.Text : RNText;
  return <Component aria-level={variant ? ARIA_LEVEL[variant] : undefined} className={cn(textVariants({ variant }), textClass, className)} role={variant ? ROLE[variant] : undefined} {...props} />;
}

export { Text, TextClassContext };
`);

  zip.file("src/components/ui/button.tsx", `import { cva, type VariantProps } from "class-variance-authority";
import { Platform, Pressable } from "react-native";
import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  cn("group shrink-0 flex-row items-center justify-center gap-2 rounded-md shadow-none", Platform.select({ web: "whitespace-nowrap outline-none transition-all disabled:pointer-events-none" })),
  {
    variants: {
      variant: {
        default: cn("bg-primary shadow-black/5 shadow-sm active:bg-primary/90", Platform.select({ web: "hover:bg-primary/90" })),
        destructive: cn("bg-destructive shadow-black/5 shadow-sm active:bg-destructive/90", Platform.select({ web: "hover:bg-destructive/90" })),
        outline: cn("border border-border bg-background shadow-black/5 shadow-sm active:bg-accent dark:border-input dark:bg-input/30", Platform.select({ web: "hover:bg-accent" })),
        secondary: cn("bg-secondary shadow-black/5 shadow-sm active:bg-secondary/80", Platform.select({ web: "hover:bg-secondary/80" })),
        ghost: cn("active:bg-accent dark:active:bg-accent/50", Platform.select({ web: "hover:bg-accent" })),
        link: "",
      },
      size: {
        default: cn("h-10 px-4 py-2 sm:h-9", Platform.select({ web: "has-[>svg]:px-3" })),
        sm: cn("h-9 gap-1.5 rounded-md px-3 sm:h-8", Platform.select({ web: "has-[>svg]:px-2.5" })),
        lg: cn("h-11 rounded-md px-6 sm:h-10", Platform.select({ web: "has-[>svg]:px-4" })),
        icon: "h-10 w-10 sm:h-9 sm:w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

const buttonTextVariants = cva(cn("font-medium text-foreground text-sm", Platform.select({ web: "pointer-events-none transition-colors" })), {
  variants: {
    variant: {
      default: "text-primary-foreground",
      destructive: "text-white",
      outline: cn("group-active:text-accent-foreground", Platform.select({ web: "group-hover:text-accent-foreground" })),
      secondary: "text-secondary-foreground",
      ghost: "group-active:text-accent-foreground",
      link: cn("text-primary group-active:underline", Platform.select({ web: "underline-offset-4 group-hover:underline" })),
    },
    size: { default: "", sm: "", lg: "", icon: "" },
  },
  defaultVariants: { variant: "default", size: "default" },
});

type ButtonProps = React.ComponentProps<typeof Pressable> & React.RefAttributes<typeof Pressable> & VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable className={cn(props.disabled && "opacity-50", buttonVariants({ variant, size }), className)} role="button" {...props} />
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
`);

  zip.file("src/components/ui/card.tsx", `import { View, type ViewProps } from "react-native";
import { Text, TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils/cn";

function Card({ className, ...props }: ViewProps & React.RefAttributes<View>) {
  return <TextClassContext.Provider value="text-card-foreground"><View className={cn("flex flex-col gap-6 rounded-xl border border-border bg-card py-6 shadow-black/5 shadow-sm", className)} {...props} /></TextClassContext.Provider>;
}
function CardHeader({ className, ...props }: ViewProps & React.RefAttributes<View>) {
  return <View className={cn("flex flex-col gap-1.5 px-6", className)} {...props} />;
}
function CardTitle({ className, ...props }: React.ComponentProps<typeof Text> & React.RefAttributes<Text>) {
  return <Text aria-level={3} className={cn("font-semibold leading-none", className)} role="heading" {...props} />;
}
function CardDescription({ className, ...props }: React.ComponentProps<typeof Text> & React.RefAttributes<Text>) {
  return <Text className={cn("text-muted-foreground text-sm", className)} {...props} />;
}
function CardContent({ className, ...props }: ViewProps & React.RefAttributes<View>) {
  return <View className={cn("px-6", className)} {...props} />;
}
function CardFooter({ className, ...props }: ViewProps & React.RefAttributes<View>) {
  return <View className={cn("flex flex-row items-center px-6", className)} {...props} />;
}
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
`);

  zip.file("src/contexts/app-theme-context.tsx", `import type React from "react";
import { createContext, useCallback, useContext, useMemo } from "react";
import { Uniwind, useUniwind } from "uniwind";

type ThemeName = "light" | "dark";
interface AppThemeContextType {
  currentTheme: string; isLight: boolean; isDark: boolean;
  setTheme: (theme: ThemeName) => void; toggleTheme: () => void;
}
const AppThemeContext = createContext<AppThemeContextType | undefined>(undefined);

export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useUniwind();
  const isLight = useMemo(() => theme === "light", [theme]);
  const isDark = useMemo(() => theme === "dark", [theme]);
  const setTheme = useCallback((newTheme: ThemeName) => { Uniwind.setTheme(newTheme); }, []);
  const toggleTheme = useCallback(() => { Uniwind.setTheme(theme === "light" ? "dark" : "light"); }, [theme]);
  const value = useMemo(() => ({ currentTheme: theme, isLight, isDark, setTheme, toggleTheme }), [theme, isLight, isDark, setTheme, toggleTheme]);
  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
};

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (!context) throw new Error("useAppTheme must be within AppThemeProvider");
  return context;
}
`);

  // ── README ───────────────────────────────────────────────────────────────────
  zip.file("README.md", `# ${appName}

Generated by [Evermade](https://evermade.app) — AI-powered mobile app builder.

## Getting started

\`\`\`bash
bun install
bun run dev
\`\`\`

## Running on device

Install **Expo Go** from the App Store / Play Store, then scan the QR code.

## Stack

- Expo Router (file-based navigation)
- NativeWind (Tailwind CSS for React Native)
- shadcn-style UI components
`);

  // ── Placeholder PNG assets ───────────────────────────────────────────────────
  const darkPng = solidPng(9, 9, 11);   // #09090b
  const lightPng = solidPng(250, 250, 250); // #fafafa
  zip.file("assets/images/icon.png", lightPng);
  zip.file("assets/images/splash-icon.png", darkPng);
  zip.file("assets/images/android-icon-background.png", darkPng);
  zip.file("assets/images/android-icon-foreground.png", lightPng);
  zip.file("assets/images/android-icon-monochrome.png", lightPng);
  zip.file("assets/images/favicon.png", lightPng);

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
