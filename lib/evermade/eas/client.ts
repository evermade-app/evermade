import JSZip from "jszip";
import { gzipSync } from "zlib";
import { assembleExpoZip } from "@/lib/evermade/sleek/expo-assembler";

const EAS_GRAPHQL_URL = "https://api.expo.dev/graphql";
export const EAS_PROJECT_ID = "59d38d30-7696-4cdc-8ba4-73ee35b9ab41";

interface ScreenCode {
  screenName: string;
  componentName: string;
  code: string;
}

interface NavigationFiles {
  appTsx: string;
  navigatorTsx: string;
}

export type EASBuildStatus =
  | "NEW"
  | "IN_QUEUE"
  | "IN_PROGRESS"
  | "FINISHED"
  | "ERRORED"
  | "CANCELED"
  | "EXPIRED";

export interface BuildStatusResult {
  status: EASBuildStatus;
  artifactUrl?: string;
  error?: string;
}

// ── EAS GraphQL helper ─────────────────────────────────────────────────────────

async function gql<T = unknown>(
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  const token = process.env.EXPO_TOKEN;
  if (!token) throw new Error("EXPO_TOKEN not configured");

  const res = await fetch(EAS_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const rawBody = await res.text();

  if (!res.ok) {
    // Log full body so it appears in Vercel function logs
    console.error("[EAS] HTTP error", res.status, rawBody);
    throw new Error(`EAS GraphQL HTTP ${res.status}: ${rawBody}`);
  }

  let parsed: { data?: T; errors?: Array<{ message: string }> };
  try {
    parsed = JSON.parse(rawBody) as typeof parsed;
  } catch {
    console.error("[EAS] Non-JSON response:", rawBody);
    throw new Error(`EAS GraphQL returned non-JSON: ${rawBody.slice(0, 200)}`);
  }

  if (parsed.errors?.length) {
    console.error("[EAS] GraphQL errors:", JSON.stringify(parsed.errors));
    throw new Error(
      `EAS GraphQL error: ${parsed.errors.map((e) => e.message).join(", ")}`
    );
  }

  return parsed.data as T;
}

// ── Pure-JS POSIX TAR builder ──────────────────────────────────────────────────

function writeTarHeader(filePath: string, size: number): Buffer {
  const header = Buffer.alloc(512);

  const nameBytes = Buffer.from(filePath, "ascii");
  nameBytes.copy(header, 0, 0, Math.min(nameBytes.length, 100));

  Buffer.from("0000644\0", "ascii").copy(header, 100);
  Buffer.from("0000000\0", "ascii").copy(header, 108);
  Buffer.from("0000000\0", "ascii").copy(header, 116);

  Buffer.from(size.toString(8).padStart(11, "0") + "\0", "ascii").copy(header, 124);

  const mtime = Math.floor(Date.now() / 1000);
  Buffer.from(mtime.toString(8).padStart(11, "0") + "\0", "ascii").copy(header, 136);

  header.fill(0x20, 148, 156);
  header[156] = 0x30;

  Buffer.from("ustar\0", "ascii").copy(header, 257);
  Buffer.from("00", "ascii").copy(header, 263);

  let sum = 0;
  for (let i = 0; i < 512; i++) sum += header[i] ?? 0;
  Buffer.from(sum.toString(8).padStart(6, "0") + "\0 ", "ascii").copy(header, 148);

  return header;
}

function tarEntry(filePath: string, content: Buffer): Buffer {
  const header = writeTarHeader(filePath, content.length);
  const padded = Buffer.alloc(Math.ceil(content.length / 512) * 512);
  content.copy(padded);
  return Buffer.concat([header, padded]);
}

export async function buildProjectTarGz(options: {
  appName: string;
  screens: ScreenCode[];
  navigation?: NavigationFiles;
}): Promise<Buffer> {
  const zipBuf = await assembleExpoZip({
    appName: options.appName,
    screens: options.screens,
    screenshots: [],
    navigation: options.navigation,
  });

  const zip = await JSZip.loadAsync(zipBuf);
  const chunks: Buffer[] = [];

  const entries = Object.entries(zip.files)
    .filter(([, f]) => !f.dir)
    .sort(([a], [b]) => a.localeCompare(b));

  for (const [filePath, file] of entries) {
    const content = Buffer.from(await file.async("arraybuffer"));
    chunks.push(tarEntry(filePath, content));
  }

  chunks.push(Buffer.alloc(1024));
  return gzipSync(Buffer.concat(chunks));
}

// ── EAS build trigger operations ───────────────────────────────────────────────

// Common metadata for both platforms
function buildMetadata(appName: string, distribution: string) {
  return {
    appName,
    buildProfile: "preview",
    distribution,
    sdkVersion: "54.0.0",
    workflow: "MANAGED",
  };
}

export async function triggerAndroidBuild(
  archiveUrl: string,
  appName: string
): Promise<string> {
  const MUTATION = `
    mutation CreateAndroidBuildMutation(
      $appId: ID!
      $job: AndroidJobInput!
      $metadata: BuildMetadataInput
    ) {
      build {
        createAndroidBuild(appId: $appId, job: $job, metadata: $metadata) {
          build { id status }
        }
      }
    }
  `;

  const result = await gql<{
    build: { createAndroidBuild: { build: { id: string; status: string } } };
  }>(MUTATION, {
    appId: EAS_PROJECT_ID,
    job: {
      type: "MANAGED",
      projectArchive: { type: "URL", url: archiveUrl },
      buildType: "APK",
    },
    metadata: buildMetadata(appName, "internal"),
  });

  const id = result.build?.createAndroidBuild?.build?.id;
  if (!id) throw new Error("EAS did not return an Android build ID");
  return id;
}

export async function triggerIosBuild(
  archiveUrl: string,
  appName: string
): Promise<string> {
  const MUTATION = `
    mutation CreateIosBuildMutation(
      $appId: ID!
      $job: IosJobInput!
      $metadata: BuildMetadataInput
    ) {
      build {
        createIosBuild(appId: $appId, job: $job, metadata: $metadata) {
          build { id status }
        }
      }
    }
  `;

  const result = await gql<{
    build: { createIosBuild: { build: { id: string; status: string } } };
  }>(MUTATION, {
    appId: EAS_PROJECT_ID,
    job: {
      type: "MANAGED",
      projectArchive: { type: "URL", url: archiveUrl },
      buildType: "SIMULATOR",
    },
    metadata: buildMetadata(appName, "simulator"),
  });

  const id = result.build?.createIosBuild?.build?.id;
  if (!id) throw new Error("EAS did not return an iOS build ID");
  return id;
}

// ── Build status poll ──────────────────────────────────────────────────────────

export async function getBuildStatus(buildId: string): Promise<BuildStatusResult> {
  // Correct path: build.byId(id:)  — NOT builds.byId(buildId:)
  const QUERY = `
    query BuildById($buildId: ID!) {
      build {
        byId(id: $buildId) {
          id
          status
          artifacts {
            buildUrl
            applicationArchiveUrl
          }
          error {
            message
          }
        }
      }
    }
  `;

  const result = await gql<{
    build: {
      byId: {
        id: string;
        status: string;
        artifacts?: { buildUrl?: string; applicationArchiveUrl?: string };
        error?: { message: string };
      };
    };
  }>(QUERY, { buildId });

  const b = result.build?.byId;
  if (!b) throw new Error(`Build ${buildId} not found`);

  const artifactUrl = b.artifacts?.buildUrl ?? b.artifacts?.applicationArchiveUrl;

  return {
    status: b.status as EASBuildStatus,
    artifactUrl: artifactUrl ?? undefined,
    error: b.error?.message,
  };
}
