import JSZip from "jszip";
import { deflateSync } from "zlib";

// ── Minimal valid PNG generator (pure Node.js, no extra deps) ─────────────────

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of buf) crc = (CRC_TABLE[(crc ^ byte) & 0xff] ?? 0) ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

// Generates a solid-colour PNG. Deflate compresses solid images to ~200 bytes
// regardless of resolution, so 1024×1024 is fine for server-side generation.
function solidColorPng(width: number, height: number, r: number, g: number, b: number): Buffer {
  const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // RGB colour type

  // Build one row: filter byte 0 (None) + RGB pixels
  const row = Buffer.alloc(1 + width * 3);
  for (let x = 0; x < width; x++) {
    row[1 + x * 3]     = r;
    row[1 + x * 3 + 1] = g;
    row[1 + x * 3 + 2] = b;
  }

  // Concatenate identical rows — deflate collapses this to near-nothing
  const rawData = Buffer.concat(Array.from({ length: height }, () => row));

  return Buffer.concat([
    PNG_SIG,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", deflateSync(rawData)),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

// Evermade dark background: #080818
const BG = { r: 8, g: 8, b: 24 } as const;

function buildPlaceholderAssets() {
  return {
    "assets/icon.png":          solidColorPng(1024, 1024, BG.r, BG.g, BG.b),
    "assets/splash.png":        solidColorPng(1284, 2778, BG.r, BG.g, BG.b),
    "assets/adaptive-icon.png": solidColorPng(1024, 1024, BG.r, BG.g, BG.b),
    "assets/favicon.png":       solidColorPng(32,   32,   BG.r, BG.g, BG.b),
  };
}

// ── Project file builders ─────────────────────────────────────────────────────

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
  return JSON.stringify(
    {
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
        expo: "~54.0.0",
        "expo-asset": "~11.0.5",
        "expo-constants": "~17.0.3",
        "expo-font": "~13.0.2",
        "expo-status-bar": "~2.0.1",
        react: "18.3.1",
        "react-native": "0.76.9",
        "react-native-safe-area-context": "4.12.0",
        "react-native-screens": "~4.4.0",
        ...(functional
          ? {
              "@react-navigation/native": "^6.1.18",
              "@react-navigation/stack": "^6.4.1",
              "@react-navigation/bottom-tabs": "^6.6.1",
              "react-native-gesture-handler": "~2.20.2",
            }
          : {}),
      },
      devDependencies: {
        "@babel/core": "^7.25.2",
        "@types/react": "~18.3.12",
        typescript: "^5.3.3",
      },
    },
    null,
    2
  );
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
        splash: {
          image: "./assets/splash.png",
          resizeMode: "contain",
          backgroundColor: "#080818",
        },
        ios: { supportsTablet: true },
        android: {
          adaptiveIcon: {
            foregroundImage: "./assets/adaptive-icon.png",
            backgroundColor: "#080818",
          },
        },
        web: { favicon: "./assets/favicon.png" },
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
    { extends: "expo/tsconfig.base", compilerOptions: { strict: true } },
    null,
    2
  );
}

function buildIndexJs() {
  return `import { registerRootComponent } from "expo";
import App from "./App";

registerRootComponent(App);
`;
}

// Non-functional fallback: simple prev/next navigator, no react-navigation needed
function buildSimpleAppTsx(screens: ScreenCode[]) {
  const imports = screens
    .map((s) => `import ${s.componentName} from "./screens/${s.componentName}";`)
    .join("\n");

  return `import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
${imports}

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
  return { presets: ["babel-preset-expo"] };
};
`;
}

// ── Main assembler ────────────────────────────────────────────────────────────

export async function assembleExpoZip(options: AssembleOptions): Promise<Buffer> {
  const { appName, screens, navigation } = options;
  const isFunctional = !!navigation;
  const zip = new JSZip();

  zip.file("package.json", buildPackageJson(appName, isFunctional));
  zip.file("app.json", buildAppJson(appName));
  zip.file("eas.json", buildEasJson());
  zip.file("tsconfig.json", buildTsConfig());
  zip.file("babel.config.js", buildBabelConfig());
  zip.file("index.js", buildIndexJs());

  if (isFunctional && navigation) {
    zip.file("App.tsx", navigation.appTsx);
    zip.file("navigation/AppNavigator.tsx", navigation.navigatorTsx);
  } else {
    zip.file("App.tsx", buildSimpleAppTsx(screens));
  }

  for (const screen of screens) {
    zip.file(`screens/${screen.componentName}.tsx`, screen.code);
  }

  // Placeholder PNG assets — valid files, dark background (#080818)
  for (const [path, data] of Object.entries(buildPlaceholderAssets())) {
    zip.file(path, data);
  }

  zip.file(
    "README.md",
    `# ${appName}\n\nGenerated by [Evermade](https://evermade.app) — AI-powered mobile app builder.\n\n## Getting started\n\n\`\`\`bash\nnpm install\nnpx expo start\n\`\`\`\n${
      isFunctional
        ? "\n## Navigation\n\nThis app uses React Navigation v6 with Stack + Bottom Tabs.\n"
        : "\n## Note\n\nRun \"Make it functional\" in Evermade to get full React Navigation setup.\n"
    }`
  );

  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}
