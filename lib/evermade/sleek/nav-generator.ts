import type { NavigationBundle } from "@/lib/editor/EditorContext";

const MODEL = "gpt-4o";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export interface ScreenForNav {
  componentName: string;
  screenName: string;
}

const NAV_SYSTEM_PROMPT = `You are a senior React Native engineer. Generate React Navigation v6 navigation files for a React Native + Expo SDK 51 app.

Output ONLY valid JSON in this exact schema (no markdown, no extra keys):
{
  "appTsx": "<full App.tsx file content as a string>",
  "navigatorTsx": "<full navigation/AppNavigator.tsx file content as a string>"
}

STRICT RULES:
1. App.tsx must:
   - Import NavigationContainer from "@react-navigation/native"
   - Import AppNavigator from "./navigation/AppNavigator"
   - Export default function App() wrapping AppNavigator in NavigationContainer
   - Nothing else

2. navigation/AppNavigator.tsx must:
   - Classify screens: any screen whose name contains "Onboarding" → onboarding stack (no tab bar). All others → bottom tab navigator.
   - Any screen whose name contains "Detail" (and is not onboarding) → stack screen inside the nearest tab, not a tab itself.
   - Import createNativeStackNavigator from "@react-navigation/native-stack"
   - Import createBottomTabNavigator from "@react-navigation/bottom-tabs"
   - Import ALL screens from "../screens/{componentName}"
   - Define proper TypeScript RootStackParamList, OnboardingStackParamList, MainTabParamList
   - Export default function AppNavigator() — root stack with Onboarding and Main screens
   - OnboardingNavigator: stack of onboarding screens, last screen navigates to "Main" via navigation.replace("Main")
   - MainNavigator: bottom tabs for all non-onboarding, non-detail screens
   - Tab icons: use React.createElement(Text, { style: { fontSize: focused ? 20 : 18 } }, "<emoji>") — import Text from "react-native"
   - Tab bar style: backgroundColor "#0a0a18", borderTopColor "rgba(255,255,255,0.07)", activeTintColor "#CCFF00", inactiveTintColor "rgba(255,255,255,0.35)"
   - No headerShown on any navigator or screen
   - Use React.createElement for tab icons (not JSX arrow functions that might confuse the bundler)

3. Tab emoji guide (pick the best match):
   Home/Dashboard → 🏠, Feature/Core → ⚡, Secondary → 🔍, Profile → 👤, Settings → ⚙️, Detail → 📄, Chat → 💬, Map → 🗺️, Shop → 🛒, Activity → 📊, Health → ❤️, Wallet → 💳

4. Packages available (already in node_modules):
   @react-navigation/native, @react-navigation/native-stack, @react-navigation/bottom-tabs, react-native-screens, react-native-safe-area-context

5. The generated code must compile with TypeScript strict mode.`;

function buildUserMessage(appName: string, appPrompt: string, screens: ScreenForNav[]): string {
  const list = screens.map((s) => `  - screenName: "${s.screenName}", componentName: "${s.componentName}"`).join("\n");
  return `App name: "${appName}"
App description: "${appPrompt}"

Screens (in order):
${list}

Generate the navigation code now.`;
}

export async function generateNavigation(
  appName: string,
  appPrompt: string,
  screens: ScreenForNav[]
): Promise<NavigationBundle> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: NAV_SYSTEM_PROMPT },
        { role: "user", content: buildUserMessage(appName, appPrompt, screens) },
      ],
      max_tokens: 3500,
      temperature: 0.1,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`OpenAI navigation ${res.status}: ${body}`);
  }

  const data = await res.json() as { choices: Array<{ message: { content: string } }> };
  const raw = data.choices[0]?.message?.content ?? "{}";

  let parsed: NavigationBundle;
  try {
    parsed = JSON.parse(raw) as NavigationBundle;
  } catch {
    throw new Error("Navigation GPT-4o returned invalid JSON");
  }

  if (!parsed.appTsx || !parsed.navigatorTsx) {
    throw new Error("Navigation GPT-4o response missing appTsx or navigatorTsx");
  }

  return { appTsx: parsed.appTsx, navigatorTsx: parsed.navigatorTsx };
}

// Deterministic fallback used when GPT-4o is unavailable or fails
export function buildFallbackNavigation(
  appName: string,
  screens: ScreenForNav[]
): NavigationBundle {
  const onboarding = screens.filter((s) => s.screenName.toLowerCase().includes("onboard"));
  const detail = screens.filter(
    (s) => s.screenName.toLowerCase().includes("detail") && !s.screenName.toLowerCase().includes("onboard")
  );
  const tabs = screens.filter(
    (s) =>
      !s.screenName.toLowerCase().includes("onboard") &&
      !s.screenName.toLowerCase().includes("detail")
  );

  const TAB_EMOJI: Record<string, string> = {
    home: "🏠", dashboard: "🏠", core: "⚡", feature: "⚡", secondary: "🔍",
    profile: "👤", settings: "⚙️", chat: "💬", map: "🗺️", shop: "🛒",
    activity: "📊", health: "❤️", wallet: "💳",
  };

  function getEmoji(name: string): string {
    const lower = name.toLowerCase();
    for (const [key, emoji] of Object.entries(TAB_EMOJI)) {
      if (lower.includes(key)) return emoji;
    }
    return "●";
  }

  function toTabLabel(name: string): string {
    return name
      .replace(/\b(Screen|Dashboard|Feature)\b/gi, "")
      .trim()
      .split(/\s+/)[0] || name.split(/\s+/)[0];
  }

  const allImports = screens
    .map((s) => `import ${s.componentName} from "../screens/${s.componentName}";`)
    .join("\n");

  const onboardingScreens = onboarding.length > 0 ? onboarding : [];
  const onboardingStackScreens = onboardingScreens
    .map((s, i) => {
      const routeName = `Onboard${i}`;
      return `      <OnboardStack.Screen name="${routeName}" component={${s.componentName}} />`;
    })
    .join("\n");

  const tabScreens = tabs
    .map((s) => {
      const emoji = getEmoji(s.screenName);
      const label = toTabLabel(s.screenName);
      return `      <MainTab.Screen
        name="${s.componentName}"
        component={${s.componentName}}
        options={{
          tabBarLabel: "${label}",
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            React.createElement(Text, { style: { fontSize: focused ? 20 : 18 } }, "${emoji}"),
        }}
      />`;
    })
    .join("\n");

  const detailScreens = detail.length > 0
    ? detail.map((s) => `      <RootStack.Screen name="${s.componentName}" component={${s.componentName}} />`).join("\n")
    : "";

  const navigatorTsx = `import React from "react";
import { Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
${allImports}

type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
${detail.map((s) => `  ${s.componentName}: undefined;`).join("\n")}
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const OnboardStack = createNativeStackNavigator();
const MainTab = createBottomTabNavigator();

const tabBarStyle = {
  tabBarStyle: {
    backgroundColor: "#0a0a18",
    borderTopColor: "rgba(255,255,255,0.07)",
    borderTopWidth: 1,
  },
  tabBarActiveTintColor: "#CCFF00",
  tabBarInactiveTintColor: "rgba(255,255,255,0.35)",
  headerShown: false,
} as const;

${
  onboarding.length > 0
    ? `function OnboardingNavigator() {
  return (
    <OnboardStack.Navigator screenOptions={{ headerShown: false }}>
${onboardingStackScreens}
    </OnboardStack.Navigator>
  );
}
`
    : ""
}
function MainNavigator() {
  return (
    <MainTab.Navigator screenOptions={tabBarStyle}>
${tabScreens}
    </MainTab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
${onboarding.length > 0 ? `      <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />\n` : ""}      <RootStack.Screen name="Main" component={MainNavigator} />
${detailScreens ? `${detailScreens}\n` : ""}    </RootStack.Navigator>
  );
}
`;

  const appTsx = `import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
`;

  return { appTsx, navigatorTsx };
}
