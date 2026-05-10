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

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`EAS GraphQL HTTP ${res.status}: ${body}`);
  }

  const data = (await res.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };

  if (data.errors?.length) {
    throw new Error(
      `EAS GraphQL error: ${data.errors.map((e) => e.message).join(", ")}`
    );
  }

  return data.data as T;
}

// ── Pure-JS POSIX TAR builder ──────────────────────────────────────────────────

function writeTarHeader(filePath: string, size: number): Buffer {
  const header = Buffer.alloc(512);

  // name (100 bytes, null-padded)
  const nameBytes = Buffer.from(filePath, "ascii");
  nameBytes.copy(header, 0, 0, Math.min(nameBytes.length, 100));

  // mode, uid, gid
  Buffer.from("0000644\0", "ascii").copy(header, 100);
  Buffer.from("0000000\0", "ascii").copy(header, 108);
  Buffer.from("0000000\0", "ascii").copy(header, 116);

  // size (12 bytes, octal, null-terminated)
  Buffer.from(size.toString(8).padStart(11, "0") + "\0", "ascii").copy(
    header,
    124
  );

  // mtime (12 bytes, octal, null-terminated)
  const mtime = Math.floor(Date.now() / 1000);
  Buffer.from(mtime.toString(8).padStart(11, "0") + "\0", "ascii").copy(
    header,
    136
  );

  // checksum placeholder = 8 spaces (used in sum calculation)
  header.fill(0x20, 148, 156);

  // typeflag: '0' = regular file
  header[156] = 0x30;

  // ustar magic + version
  Buffer.from("ustar\0", "ascii").copy(header, 257);
  Buffer.from("00", "ascii").copy(header, 263);

  // Compute unsigned checksum over all 512 bytes (spaces already in 148-155)
  let sum = 0;
  for (let i = 0; i < 512; i++) sum += header[i] ?? 0;

  // Write checksum: 6-digit octal + NUL + space
  Buffer.from(sum.toString(8).padStart(6, "0") + "\0 ", "ascii").copy(
    header,
    148
  );

  return header;
}

function tarEntry(filePath: string, content: Buffer): Buffer {
  const header = writeTarHeader(filePath, content.length);
  // Content padded to 512-byte boundary
  const padded = Buffer.alloc(Math.ceil(content.length / 512) * 512);
  content.copy(padded);
  return Buffer.concat([header, padded]);
}

// ── Project archive builder ────────────────────────────────────────────────────

export async function buildProjectTarGz(options: {
  appName: string;
  screens: ScreenCode[];
  navigation?: NavigationFiles;
}): Promise<Buffer> {
  const { appName, screens, navigation } = options;

  // Delegate file content generation to expo-assembler (reuses all existing logic)
  const zipBuf = await assembleExpoZip({
    appName,
    screens,
    screenshots: [],
    navigation,
  });

  const zip = await JSZip.loadAsync(zipBuf);
  const chunks: Buffer[] = [];

  // Collect non-directory entries, sorted for reproducibility
  const entries = Object.entries(zip.files)
    .filter(([, f]) => !f.dir)
    .sort(([a], [b]) => a.localeCompare(b));

  for (const [filePath, file] of entries) {
    const content = Buffer.from(await file.async("arraybuffer"));
    chunks.push(tarEntry(filePath, content));
  }

  // POSIX TAR end-of-archive: two 512-byte zero blocks
  chunks.push(Buffer.alloc(1024));

  return gzipSync(Buffer.concat(chunks));
}

// ── EAS build operations ───────────────────────────────────────────────────────

export async function triggerAndroidBuild(
  archiveUrl: string,
  appName: string
): Promise<string> {
  const CREATE_BUILD = `
    mutation CreateAndroidBuild(
      $appId: String!
      $job: AndroidJobInput!
      $metadata: BuildMetadataInput
    ) {
      build {
        createAndroidBuild(appId: $appId, job: $job, metadata: $metadata) {
          build {
            id
            status
          }
        }
      }
    }
  `;

  const result = await gql<{
    build: {
      createAndroidBuild: {
        build: { id: string; status: string };
      };
    };
  }>(CREATE_BUILD, {
    appId: EAS_PROJECT_ID,
    job: {
      type: "MANAGED",
      projectArchive: { type: "URL", url: archiveUrl },
      buildType: "APK",
      distribution: "INTERNAL",
    },
    metadata: {
      appName,
      buildProfile: "preview",
      sdkVersion: "54.0.0",
      workflow: "MANAGED",
    },
  });

  const buildId = result.build?.createAndroidBuild?.build?.id;
  if (!buildId) throw new Error("EAS did not return a build ID");
  return buildId;
}

export async function getBuildStatus(buildId: string): Promise<BuildStatusResult> {
  const POLL_BUILD = `
    query BuildById($buildId: ID!) {
      builds {
        byId(buildId: $buildId) {
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
    builds: {
      byId: {
        id: string;
        status: string;
        artifacts?: { buildUrl?: string; applicationArchiveUrl?: string };
        error?: { message: string };
      };
    };
  }>(POLL_BUILD, { buildId });

  const build = result.builds?.byId;
  if (!build) throw new Error(`Build ${buildId} not found`);

  const artifactUrl =
    build.artifacts?.buildUrl ?? build.artifacts?.applicationArchiveUrl;

  return {
    status: build.status as EASBuildStatus,
    artifactUrl: artifactUrl ?? undefined,
    error: build.error?.message,
  };
}
