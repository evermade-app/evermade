import JSZip from "jszip";

interface ScreenCode {
  screenName: string;
  componentName: string;
  code: string;
}

interface NavigationFiles {
  appTsx: string;
  navigatorTsx: string;
}

interface AssembleOptions {
  appName: string;
  screens: ScreenCode[];
  screenshots: { name: string; url?: string }[];
  navigation?: NavigationFiles;
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function buildPackageJson(appName: string, functional: boolean) {
  const base = {
    name: toSlug(appName),
    version: "1.0.0",
    main: "index.js",
    scripts: {
      start: "expo start",
      android: "expo start --android",
      ios: "expo start --ios",
      web: "expo start --web",
    },
    dependencies: {
      expo: "~52.0.0",
      "expo-status-bar": "~2.0.1",
      react: "18.3.1",
      "react-native": "0.76.5",
      "react-native-safe-area-context": "4.12.0",
      "react-native-screens": "~4.1.0",
      ...(functional
        ? {
            "@react-navigation/native": "^6.1.18",
            "@react-navigation/native-stack": "^6.9.26",
            "@react-navigation/bottom-tabs": "^6.6.1",
          }
        : {}),
    },
    devDependencies: {
      "@babel/core": "^7.25.2",
      "@types/react": "~18.3.12",
      typescript: "^5.3.3",
    },
  };

  return JSON.stringify(base, null, 2);
}

function buildAppJson(appName: string) {
  return JSON.stringify(
    {
      expo: {
        name: appName,
        slug: toSlug(appName),
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "dark",
        splash: { image: "./assets/splash.png", resizeMode: "contain", backgroundColor: "#080818" },
        ios: { supportsTablet: true },
        android: { adaptiveIcon: { foregroundImage: "./assets/adaptive-icon.png", backgroundColor: "#080818" } },
        web: { bundler: "metro" },
        ...(true ? {} : { scheme: "evermade" }),
      },
    },
    null,
    2
  );
}

function buildEasJson() {
  return JSON.stringify(
    {
      cli: { version: ">= 12.0.0" },
      build: {
        development: { developmentClient: true, distribution: "internal" },
        preview: { distribution: "internal" },
        production: {},
      },
      submit: { production: {} },
    },
    null,
    2
  );
}

function buildTsConfig() {
  return JSON.stringify(
    {
      extends: "expo/tsconfig.base",
      compilerOptions: { strict: true },
    },
    null,
    2
  );
}

// Simple entry point when navigation bundle is provided
function buildIndexJs() {
  return `import { registerRootComponent } from "expo";
import App from "./App";

registerRootComponent(App);
`;
}

// Fallback layout for non-functional export (basic tab navigator, all screens visible)
function buildSimpleAppTsx(screens: ScreenCode[]) {
  const imports = screens
    .map((s) => `import ${s.componentName} from "./screens/${s.componentName}";`)
    .join("\n");

  return `import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
${imports}

// Simple stack-based navigator (no react-navigation required)
const SCREENS = [${screens.map((s) => `"${s.screenName}"`).join(", ")}];
const COMPONENTS = [${screens.map((s) => s.componentName).join(", ")}];

export default function App() {
  const [idx, setIdx] = useState(0);
  const CurrentScreen = COMPONENTS[idx];
  return (
    <View style={styles.root}>
      <CurrentScreen />
      <View style={styles.nav}>
        <TouchableOpacity style={styles.btn} onPress={() => setIdx((i) => Math.max(0, i - 1))}>
          <Text style={styles.btnText}>← Prev</Text>
        </TouchableOpacity>
        <Text style={styles.label}>{SCREENS[idx]}</Text>
        <TouchableOpacity style={styles.btn} onPress={() => setIdx((i) => Math.min(SCREENS.length - 1, i + 1))}>
          <Text style={styles.btnText}>Next →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#080818" },
  nav: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 12, paddingHorizontal: 16,
    backgroundColor: "#0a0a20", borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.08)",
  },
  btn: { padding: 8 },
  btnText: { color: "#CCFF00", fontSize: 13, fontWeight: "600" },
  label: { color: "rgba(255,255,255,0.55)", fontSize: 11, flex: 1, textAlign: "center" },
});
`;
}

function buildBabelConfig() {
  return `module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
  };
};
`;
}

export async function assembleExpoZip(options: AssembleOptions): Promise<Buffer> {
  const { appName, screens, navigation } = options;
  const isFunctional = !!navigation;
  const zip = new JSZip();

  zip.file("package.json", buildPackageJson(appName, isFunctional));
  zip.file("app.json", buildAppJson(appName));
  zip.file("eas.json", buildEasJson());
  zip.file("tsconfig.json", buildTsConfig());
  zip.file("babel.config.js", buildBabelConfig());

  // Always include index.js — it's the entry point declared in package.json
  zip.file("index.js", buildIndexJs());

  if (isFunctional && navigation) {
    zip.file("App.tsx", navigation.appTsx);
    zip.file("navigation/AppNavigator.tsx", navigation.navigatorTsx);
  } else {
    // Non-functional export: simple sequential screen browser (no react-navigation needed)
    zip.file("App.tsx", buildSimpleAppTsx(screens));
  }

  for (const screen of screens) {
    zip.file(`screens/${screen.componentName}.tsx`, screen.code);
  }

  zip.file(
    "assets/.gitkeep",
    "# Place icon.png (1024×1024), splash.png (1284×2778), adaptive-icon.png (1024×1024) here\n"
  );

  zip.file(
    "README.md",
    `# ${appName}\n\nGenerated by [Evermade](https://evermade.app) — AI-powered mobile app builder.\n\n## Getting started\n\n\`\`\`bash\nnpm install\nnpx expo start\n\`\`\`\n${
      isFunctional
        ? "\n## Navigation\n\nThis app uses React Navigation v6 with Stack + Bottom Tabs.\n"
        : "\n## Note\n\nRun \"Make it functional\" in Evermade to get full React Navigation setup.\n"
    }`
  );

  const buffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  return buffer;
}
