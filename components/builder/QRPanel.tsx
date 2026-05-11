"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { useEditor } from "@/lib/editor/EditorContext";
import type { SleekPreviewApp, SleekPreviewScreen } from "@/lib/editor/EditorContext";
import type { EASBuildStatus } from "@/lib/evermade/eas/client";

// ── Real QR code via qrcode package ───────────────────────────────────────────
function RealQRCode({ url }: { url: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;
    QRCode.toDataURL(url, {
      width: 180,
      margin: 1,
      color: { dark: "#0a0818", light: "#ffffff" },
      errorCorrectionLevel: "M",
    }).then(setDataUrl).catch(() => setDataUrl(null));
  }, [url]);

  if (!dataUrl) return <FakeQRCode />;
  return (
    <img
      src={dataUrl}
      width={180}
      height={180}
      alt="Scan to preview on your device"
      style={{ display: "block", borderRadius: 5 }}
    />
  );
}

// ── Fallback skeleton QR while real one loads ─────────────────────────────────
function FakeQRCode() {
  const n = 21;
  const cell = 8;

  const finderDark = (r: number, c: number): boolean => {
    if (r === 0 || r === 6 || c === 0 || c === 6) return true;
    if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
    return false;
  };

  const isFinderPattern = (r: number, c: number): boolean | null => {
    if (r <= 6 && c <= 6) return finderDark(r, c);
    if (r <= 6 && c >= 14) return finderDark(r, c - 14);
    if (r >= 14 && c <= 6) return finderDark(r - 14, c);
    if (r === 7 && c <= 7) return false;
    if (c === 7 && r <= 7) return false;
    if (r === 7 && c >= 13) return false;
    if (c === 13 && r <= 7) return false;
    if (r === 13 && c <= 7) return false;
    if (c === 7 && r >= 13) return false;
    return null;
  };

  const isDark = (r: number, c: number): boolean => {
    const fp = isFinderPattern(r, c);
    if (fp !== null) return fp;
    if (r === 6) return c % 2 === 0;
    if (c === 6) return r % 2 === 0;
    return ((r * 17 + c * 13 + r * c + r + c) % 4) !== 0;
  };

  const size = n * cell;
  const darkCells: [number, number][] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (isDark(r, c)) darkCells.push([r, c]);
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ borderRadius: 5, display: "block", opacity: 0.35 }}
    >
      <rect width={size} height={size} fill="white" />
      {darkCells.map(([r, c]) => (
        <rect
          key={`${r}-${c}`}
          x={c * cell + 0.3}
          y={r * cell + 0.3}
          width={cell - 0.6}
          height={cell - 0.6}
          fill="#0a0818"
        />
      ))}
    </svg>
  );
}

// ── "Make it functional" section ──────────────────────────────────────────────
type FxState =
  | { status: "idle" }
  | { status: "converting"; current: number; total: number; currentName: string }
  | { status: "navigating" }
  | { status: "done" }
  | { status: "error"; message: string };

type SSEEvent =
  | { type: "progress"; step: "screen"; index: number; total: number; name: string }
  | { type: "progress"; step: "navigation"; message?: string }
  | { type: "screen_done"; index: number; id: string; componentName: string; rnCode: string }
  | { type: "navigation_done"; appTsx: string; navigatorTsx: string }
  | { type: "done" }
  | { type: "error"; message: string };

function FunctionalizeSection({ sleekApp, onDone }: {
  sleekApp: SleekPreviewApp;
  onDone: (updatedApp: SleekPreviewApp) => void;
}) {
  const [fxState, setFxState] = useState<FxState>({ status: "idle" });
  const abortRef = useRef<AbortController | null>(null);

  const handleFunctionalize = useCallback(async () => {
    if (fxState.status !== "idle" && fxState.status !== "error") return;

    const abort = new AbortController();
    abortRef.current = abort;

    setFxState({ status: "converting", current: 0, total: sleekApp.screens.length, currentName: sleekApp.screens[0]?.name ?? "" });

    const updatedScreens: SleekPreviewScreen[] = sleekApp.screens.map((s) => ({ ...s }));
    let navBundle: { appTsx: string; navigatorTsx: string } | null = null;
    let navTimedOut = false;
    let finished = false;
    let navTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const finishWithScreens = () => {
      if (finished) return;
      finished = true;
      if (navTimeoutId) { clearTimeout(navTimeoutId); navTimeoutId = null; }
      console.log("[functionalize] done — calling /api/ai/snack");
      setFxState({ status: "done" });
      onDone({
        ...sleekApp,
        screens: updatedScreens,
        navigation: navBundle ?? undefined,
        isFunctional: true,
      });
    };

    try {
      const res = await fetch("/api/ai/functionalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appName: sleekApp.appName,
          prompt: sleekApp.appName,
          screens: sleekApp.screens.map((s) => ({
            id: s.id,
            name: s.name,
            html: s.html,
            screenshotUrl: s.screenshotUrl,
          })),
        }),
        signal: abort.signal,
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data: ")) continue;
          let event: SSEEvent;
          try {
            event = JSON.parse(line.slice(6)) as SSEEvent;
          } catch {
            continue;
          }

          if (event.type === "progress" && event.step === "screen") {
            setFxState({
              status: "converting",
              current: event.index + 1,
              total: event.total,
              currentName: event.name,
            });
          } else if (event.type === "screen_done") {
            updatedScreens[event.index] = {
              ...updatedScreens[event.index],
              componentName: event.componentName,
              rnCode: event.rnCode,
            };
          } else if (event.type === "progress" && event.step === "navigation") {
            setFxState({ status: "navigating" });
            navTimeoutId = setTimeout(() => {
              navTimedOut = true;
              console.log("[functionalize] nav timeout — skipping navigation");
              reader.cancel();
            }, 15_000);
          } else if (event.type === "navigation_done") {
            if (navTimeoutId) { clearTimeout(navTimeoutId); navTimeoutId = null; }
            navBundle = { appTsx: event.appTsx, navigatorTsx: event.navigatorTsx };
          } else if (event.type === "done") {
            finishWithScreens();
          } else if (event.type === "error") {
            if (navTimeoutId) { clearTimeout(navTimeoutId); navTimeoutId = null; }
            throw new Error(event.message);
          }
        }
      }

      // Stream closed — finish if not already done (covers nav timeout + server closing without `done`)
      if (!finished) finishWithScreens();
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      // reader.cancel() from nav timeout can cause a throw in some browsers — still finish
      if (navTimedOut && !finished) { finishWithScreens(); return; }
      setFxState({ status: "error", message: err instanceof Error ? err.message : "Unknown error" });
    }
  }, [sleekApp, fxState.status, onDone]);

  useEffect(() => () => { abortRef.current?.abort(); }, []);

  if (sleekApp.isFunctional || fxState.status === "done") {
    return (
      <div style={{
        borderRadius: 14,
        border: "1px solid rgba(52,211,153,0.3)",
        background: "rgba(52,211,153,0.06)",
        padding: "11px 13px",
        display: "flex",
        alignItems: "center",
        gap: 9,
        flexShrink: 0,
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: 7,
          background: "rgba(52,211,153,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1.5 6 4.5 9 10.5 3" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#34d399", marginBottom: 1 }}>Functional app ready</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>RN code + navigation generated</div>
        </div>
      </div>
    );
  }

  if (fxState.status === "converting" || fxState.status === "navigating") {
    const isDone = fxState.status === "navigating";
    const pct = fxState.status === "converting"
      ? Math.round((fxState.current / fxState.total) * 75)
      : 90;

    return (
      <div style={{
        borderRadius: 14,
        border: "1px solid rgba(204,255,0,0.2)",
        background: "rgba(204,255,0,0.04)",
        padding: "13px",
        flexShrink: 0,
      }}>
        <style>{`@keyframes evFxPulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>

        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#CCFF00" }}>Making it functional…</span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{pct}%</span>
          </div>

          {/* Progress bar */}
          <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${pct}%`,
              borderRadius: 2,
              background: "linear-gradient(90deg, #CCFF00, #7aff00)",
              transition: "width 0.4s ease",
              boxShadow: "0 0 8px rgba(204,255,0,0.5)",
            }} />
          </div>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <StepRow
            label={fxState.status === "converting"
              ? `Converting screen ${fxState.current}/${fxState.total}: ${fxState.currentName}`
              : `Converted ${fxState.status === "navigating" ? "all" : ""} screens`}
            done={isDone}
            active={!isDone}
          />
          <StepRow
            label="Generating navigation…"
            done={false}
            active={isDone}
          />
        </div>
      </div>
    );
  }

  const isError = fxState.status === "error";

  return (
    <div style={{
      borderRadius: 14,
      overflow: "hidden",
      border: `1px solid ${isError ? "rgba(239,68,68,0.3)" : "rgba(204,255,0,0.3)"}`,
      background: isError ? "rgba(239,68,68,0.05)" : "rgba(204,255,0,0.04)",
      boxShadow: isError ? "none" : "0 0 20px rgba(204,255,0,0.06)",
      flexShrink: 0,
    }}>
      <div style={{
        height: 1.5,
        background: isError
          ? "linear-gradient(90deg, rgba(239,68,68,0.8) 0%, transparent 100%)"
          : "linear-gradient(90deg, rgba(204,255,0,0.9) 0%, rgba(124,255,0,0.5) 60%, transparent 100%)",
        boxShadow: isError ? "none" : "0 0 8px rgba(204,255,0,0.4)",
      }} />

      <div style={{ padding: "12px 13px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 9,
            background: isError
              ? "rgba(239,68,68,0.15)"
              : "linear-gradient(135deg, rgba(204,255,0,0.25) 0%, rgba(124,255,0,0.12) 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            boxShadow: isError ? "none" : "0 2px 8px rgba(204,255,0,0.2)",
          }}>
            {isError ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="rgba(239,68,68,0.9)" strokeWidth="2" strokeLinecap="round">
                <line x1="2" y1="2" x2="10" y2="10" /><line x1="10" y1="2" x2="2" y2="10" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#CCFF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            )}
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: isError ? "rgba(239,68,68,0.9)" : "#CCFF00", letterSpacing: -0.1, marginBottom: 1 }}>
              {isError ? "Failed — try again" : "Make it functional"}
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.28)" }}>
              {isError ? fxState.message.slice(0, 60) : "React Native code + navigation"}
            </div>
          </div>
        </div>

        {!isError && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
            {["Convert screens → React Native", "Generate Stack + Tab navigation"].map((step) => (
              <div key={step} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(204,255,0,0.4)", flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{step}</span>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleFunctionalize}
          style={{
            width: "100%",
            padding: "9px 0",
            borderRadius: 9,
            border: `1px solid ${isError ? "rgba(239,68,68,0.4)" : "rgba(204,255,0,0.5)"}`,
            background: isError
              ? "rgba(239,68,68,0.08)"
              : "linear-gradient(135deg, rgba(204,255,0,0.18) 0%, rgba(124,255,0,0.08) 100%)",
            color: isError ? "rgba(239,68,68,0.85)" : "#CCFF00",
            fontSize: 12.5,
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: 0.1,
            boxShadow: isError ? "none" : "0 0 14px rgba(204,255,0,0.12)",
            fontFamily: "inherit",
            transition: "all 0.15s ease",
          }}
        >
          {isError ? "Retry →" : "Make it functional →"}
        </button>
      </div>
    </div>
  );
}

function StepRow({ label, done, active }: { label: string; done: boolean; active: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <div style={{
        width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
        border: done ? "none" : `1.5px solid ${active ? "#CCFF00" : "rgba(255,255,255,0.15)"}`,
        background: done ? "rgba(52,211,153,0.3)" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {done ? (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 3 6 7 2" />
          </svg>
        ) : active ? (
          <div style={{
            width: 5, height: 5, borderRadius: "50%",
            background: "#CCFF00",
            animation: "evFxPulse 1.2s ease-in-out infinite",
          }} />
        ) : null}
      </div>
      <span style={{ fontSize: 10.5, color: active ? "rgba(204,255,0,0.85)" : "rgba(255,255,255,0.3)", lineHeight: 1.4 }}>
        {label}
      </span>
    </div>
  );
}

// ── "Build for iOS & Android" section ─────────────────────────────────────────
type PlatformBuild = {
  buildId: string;
  status: "building" | "done" | "error";
  artifactUrl?: string;
  error?: string;
};

type BState =
  | { phase: "idle" }
  | { phase: "triggering" }
  | { phase: "active"; android?: PlatformBuild; ios?: PlatformBuild; startedAt: number }
  | { phase: "trigger-error"; message: string };

function fmtElapsed(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

async function fetchBuildStatus(buildId: string) {
  const res = await fetch(`/api/ai/eas-build/${buildId}`);
  const data = (await res.json()) as { status?: EASBuildStatus; artifactUrl?: string; error?: string };
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
  return data;
}

function toLocalStatus(s: EASBuildStatus): PlatformBuild["status"] {
  if (s === "FINISHED") return "done";
  if (s === "ERRORED" || s === "CANCELED" || s === "EXPIRED") return "error";
  return "building";
}

function DeviceBuildSection({
  sleekApp,
  onPersist,
}: {
  sleekApp: SleekPreviewApp;
  onPersist: (update: Partial<Pick<SleekPreviewApp, "easAndroidBuildId" | "easAndroidBuildUrl" | "easIosBuildId" | "easIosBuildUrl">>) => void;
}) {
  const initState = (): BState => {
    const hasA = !!sleekApp.easAndroidBuildId;
    const hasI = !!sleekApp.easIosBuildId;
    if (!hasA && !hasI) return { phase: "idle" };
    return {
      phase: "active",
      startedAt: Date.now(),
      android: hasA ? {
        buildId: sleekApp.easAndroidBuildId!,
        status: sleekApp.easAndroidBuildUrl ? "done" : "building",
        artifactUrl: sleekApp.easAndroidBuildUrl,
      } : undefined,
      ios: hasI ? {
        buildId: sleekApp.easIosBuildId!,
        status: sleekApp.easIosBuildUrl ? "done" : "building",
        artifactUrl: sleekApp.easIosBuildUrl,
      } : undefined,
    };
  };

  const [state, setState] = useState<BState>(initState);
  const [elapsed, setElapsed] = useState(0);
  const startedAtRef = useRef(0);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep a ref to the currently-pending build IDs so the polling closure
  // always reads the latest value without being a dependency.
  const pendingRef = useRef<{ androidId?: string; iosId?: string }>({});
  useEffect(() => {
    if (state.phase !== "active") { pendingRef.current = {}; return; }
    pendingRef.current = {
      androidId: state.android?.status === "building" ? state.android.buildId : undefined,
      iosId: state.ios?.status === "building" ? state.ios.buildId : undefined,
    };
  }, [state]);

  // Elapsed timer — resets whenever phase enters "active"
  useEffect(() => {
    if (state.phase !== "active") return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  // Polling loop — starts once when phase becomes "active"
  useEffect(() => {
    if (state.phase !== "active") return;
    let cancelled = false;

    async function tick() {
      if (cancelled) return;
      const { androidId, iosId } = pendingRef.current;
      if (!androidId && !iosId) return;

      const [aRes, iRes] = await Promise.allSettled([
        androidId ? fetchBuildStatus(androidId) : Promise.resolve(null),
        iosId ? fetchBuildStatus(iosId) : Promise.resolve(null),
      ]);

      if (cancelled) return;

      let aUpdate: PlatformBuild | undefined;
      let iUpdate: PlatformBuild | undefined;

      if (androidId && aRes.status === "fulfilled" && aRes.value) {
        const r = aRes.value;
        const ls = toLocalStatus(r.status!);
        aUpdate = { buildId: androidId, status: ls, artifactUrl: r.artifactUrl, error: r.error };
        if (ls === "done" && r.artifactUrl) onPersist({ easAndroidBuildUrl: r.artifactUrl });
      } else if (androidId && aRes.status === "rejected") {
        aUpdate = { buildId: androidId, status: "error", error: (aRes.reason as Error).message };
      }

      if (iosId && iRes.status === "fulfilled" && iRes.value) {
        const r = iRes.value;
        const ls = toLocalStatus(r.status!);
        iUpdate = { buildId: iosId, status: ls, artifactUrl: r.artifactUrl, error: r.error };
        if (ls === "done" && r.artifactUrl) onPersist({ easIosBuildUrl: r.artifactUrl });
      } else if (iosId && iRes.status === "rejected") {
        iUpdate = { buildId: iosId, status: "error", error: (iRes.reason as Error).message };
      }

      setState(prev =>
        prev.phase !== "active" ? prev : {
          ...prev,
          android: aUpdate ?? prev.android,
          ios: iUpdate ?? prev.ios,
        }
      );

      // Reschedule — tick bails early next time if pendingRef is empty
      if (!cancelled) pollRef.current = setTimeout(tick, 30_000);
    }

    pollRef.current = setTimeout(tick, 30_000);
    return () => {
      cancelled = true;
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  const handleTrigger = useCallback(async () => {
    if (state.phase === "triggering" || state.phase === "active") return;
    setState({ phase: "triggering" });
    try {
      const res = await fetch("/api/ai/eas-build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appName: sleekApp.appName,
          screens: sleekApp.screens.map((s) => ({
            screenName: s.name,
            componentName: s.componentName ?? s.name,
            code: s.rnCode ?? "",
          })),
          navigation: sleekApp.navigation,
        }),
      });
      const data = (await res.json()) as { androidBuildId?: string; iosBuildId?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      if (!data.androidBuildId || !data.iosBuildId) throw new Error("Missing build IDs from server");

      const now = Date.now();
      startedAtRef.current = now;
      setElapsed(0);
      setState({
        phase: "active", startedAt: now,
        android: { buildId: data.androidBuildId, status: "building" },
        ios:     { buildId: data.iosBuildId,     status: "building" },
      });
      onPersist({ easAndroidBuildId: data.androidBuildId, easIosBuildId: data.iosBuildId });
    } catch (err) {
      setState({ phase: "trigger-error", message: err instanceof Error ? err.message : "Failed to start builds" });
    }
  }, [state.phase, sleekApp, onPersist]);

  const isActive = state.phase === "active";
  const android = isActive ? state.android : undefined;
  const ios     = isActive ? state.ios     : undefined;
  const allDone = isActive && android?.status !== "building" && ios?.status !== "building";

  // ── Active: all terminal → show results ──
  if (isActive && allDone) {
    return (
      <div style={{ borderRadius: 14, flexShrink: 0, border: "1px solid rgba(52,211,153,0.2)", background: "rgba(52,211,153,0.04)", overflow: "hidden" }}>
        <div style={{ height: 1.5, background: "linear-gradient(90deg, rgba(52,211,153,0.8) 0%, transparent 100%)" }} />
        <div style={{ padding: "12px 13px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#34d399" }}>Builds complete</div>
          {android && <PlatformResult platform="android" build={android} />}
          {ios     && <PlatformResult platform="ios"     build={ios}     />}
        </div>
      </div>
    );
  }

  // ── Active: still building ──
  if (isActive) {
    const pct = Math.min(90, Math.round((elapsed / 600) * 90));
    return (
      <div style={{ borderRadius: 14, flexShrink: 0, border: "1px solid rgba(204,255,0,0.2)", background: "rgba(204,255,0,0.04)", padding: "13px" }}>
        <style>{`@keyframes evSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid rgba(204,255,0,0.15)", borderTopColor: "#CCFF00", animation: "evSpin 1s linear infinite", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#CCFF00" }}>Building iOS & Android…</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{fmtElapsed(elapsed)} · ~5–10 min</div>
          </div>
        </div>
        <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: 10 }}>
          <div style={{ height: "100%", width: `${pct}%`, borderRadius: 2, background: "linear-gradient(90deg, #CCFF00, #7aff00)", transition: "width 1s linear", boxShadow: "0 0 8px rgba(204,255,0,0.5)" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <PlatformStatusRow label="Android APK" build={android} />
          <PlatformStatusRow label="iOS Simulator" build={ios} />
        </div>
      </div>
    );
  }

  // ── Triggering ──
  if (state.phase === "triggering") {
    return (
      <div style={{ borderRadius: 14, flexShrink: 0, border: "1px solid rgba(204,255,0,0.2)", background: "rgba(204,255,0,0.04)", padding: "13px", display: "flex", alignItems: "center", gap: 10 }}>
        <style>{`@keyframes evSpinT{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(204,255,0,0.15)", borderTopColor: "#CCFF00", animation: "evSpinT 0.8s linear infinite", flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: "#CCFF00" }}>Queuing builds…</span>
      </div>
    );
  }

  // ── Idle / Error ──
  const isError = state.phase === "trigger-error";
  return (
    <div style={{ borderRadius: 14, overflow: "hidden", flexShrink: 0, border: `1px solid ${isError ? "rgba(239,68,68,0.3)" : "rgba(124,92,252,0.25)"}`, background: isError ? "rgba(239,68,68,0.05)" : "rgba(124,92,252,0.04)" }}>
      <div style={{ height: 1.5, background: isError ? "linear-gradient(90deg, rgba(239,68,68,0.8) 0%, transparent 100%)" : "linear-gradient(90deg, rgba(124,92,252,0.9) 0%, rgba(79,142,255,0.5) 60%, transparent 100%)" }} />
      <div style={{ padding: "12px 13px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 9, flexShrink: 0, background: isError ? "rgba(239,68,68,0.15)" : "rgba(124,92,252,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {isError ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="rgba(239,68,68,0.9)" strokeWidth="2" strokeLinecap="round">
                <line x1="2" y1="2" x2="10" y2="10" /><line x1="10" y1="2" x2="2" y2="10" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(124,92,252,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
              </svg>
            )}
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: isError ? "rgba(239,68,68,0.9)" : "rgba(255,255,255,0.85)", marginBottom: 1 }}>
              {isError ? "Build failed" : "Build for iOS & Android"}
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.28)" }}>
              {isError ? state.message.slice(0, 60) : "Install the real app on your device"}
            </div>
          </div>
        </div>
        {!isError && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
            {["Android: side-loadable APK via QR scan", "iOS: simulator build via Xcode"].map((s) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(124,92,252,0.5)", flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{s}</span>
              </div>
            ))}
          </div>
        )}
        <button type="button" onClick={handleTrigger} style={{ width: "100%", padding: "9px 0", borderRadius: 9, border: `1px solid ${isError ? "rgba(239,68,68,0.4)" : "rgba(124,92,252,0.45)"}`, background: isError ? "rgba(239,68,68,0.08)" : "linear-gradient(135deg, rgba(124,92,252,0.2) 0%, rgba(79,142,255,0.1) 100%)", color: isError ? "rgba(239,68,68,0.85)" : "rgba(255,255,255,0.85)", fontSize: 12.5, fontWeight: 700, cursor: "pointer", letterSpacing: 0.1, boxShadow: isError ? "none" : "0 0 14px rgba(124,92,252,0.12)", fontFamily: "inherit", transition: "all 0.15s ease" }}>
          {isError ? "Retry →" : "Build for iOS & Android →"}
        </button>
      </div>
    </div>
  );
}

function PlatformStatusRow({ label, build }: { label: string; build?: PlatformBuild }) {
  const st = build?.status ?? "building";
  const color = st === "done" ? "#34d399" : st === "error" ? "#ef4444" : "rgba(204,255,0,0.7)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <span style={{ fontSize: 10, color, fontWeight: 700, width: 10, textAlign: "center", flexShrink: 0 }}>
        {st === "done" ? "✓" : st === "error" ? "✗" : "●"}
      </span>
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>{label}</span>
      {st === "building" && <span style={{ fontSize: 9, color: "rgba(255,255,255,0.22)", marginLeft: "auto" }}>building…</span>}
    </div>
  );
}

function PlatformResult({ platform, build }: { platform: "android" | "ios"; build: PlatformBuild }) {
  const isAndroid = platform === "android";
  if (build.status === "error") {
    return (
      <div style={{ fontSize: 10, color: "rgba(239,68,68,0.7)", padding: "6px 8px", borderRadius: 7, background: "rgba(239,68,68,0.07)" }}>
        {isAndroid ? "Android" : "iOS"}: {build.error ?? "Build failed"}
      </div>
    );
  }
  if (build.status === "done" && build.artifactUrl) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontSize: 10.5, fontWeight: 600, color: "rgba(255,255,255,0.55)" }}>
          {isAndroid ? "🤖 Android — scan to install APK" : "🍎 iOS — download simulator build"}
        </div>
        {isAndroid && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ padding: 7, background: "white", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}>
              <RealQRCode url={build.artifactUrl} />
            </div>
          </div>
        )}
        <a href={build.artifactUrl} target="_blank" rel="noopener noreferrer"
          style={{ display: "block", textAlign: "center", fontSize: 11, color: "#34d399", textDecoration: "none", padding: "6px 0", borderRadius: 7, border: "1px solid rgba(52,211,153,0.2)", background: "rgba(52,211,153,0.06)" }}>
          {isAndroid ? "Download APK →" : "Download Simulator Build →"}
        </a>
      </div>
    );
  }
  return null;
}

// ── Main QR Panel ─────────────────────────────────────────────────────────────
export default function QRPanel() {
  const { project, sleekApp, setSleekApp } = useEditor();
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const uploadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
    setPreviewUrl(`${base}/preview/${project.id}`);
  }, [project.id]);

  useEffect(() => {
    if (uploadTimerRef.current) clearTimeout(uploadTimerRef.current);
    uploadTimerRef.current = setTimeout(() => {
      fetch(`/api/preview/${project.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      }).catch(() => {});
    }, 500);
    return () => {
      if (uploadTimerRef.current) clearTimeout(uploadTimerRef.current);
    };
  }, [project]);

  const handleFunctionalizeDone = useCallback((updatedApp: SleekPreviewApp) => {
    setSleekApp(updatedApp);
  }, [setSleekApp]);

  const sleekAppRef = useRef(sleekApp);
  useEffect(() => { sleekAppRef.current = sleekApp; }, [sleekApp]);

  const handlePersist = useCallback((update: Parameters<React.ComponentProps<typeof DeviceBuildSection>["onPersist"]>[0]) => {
    const app = sleekAppRef.current;
    if (!app) return;
    setSleekApp({ ...app, ...update });
  }, [setSleekApp]);

  const hasScreens = sleekApp && sleekApp.screens.length > 0;

  return (
    <div
      style={{
        width: 260,
        flexShrink: 0,
        height: "100%",
        borderLeft: "1px solid rgba(79,142,255,0.14)",
        background: "rgba(4,4,16,0.88)",
        backdropFilter: "blur(48px)",
        WebkitBackdropFilter: "blur(48px)",
        boxShadow: "-1px 0 0 rgba(79,142,255,0.06), -8px 0 40px rgba(0,0,0,0.5)",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        padding: "20px 16px 20px",
        gap: 14,
        scrollbarWidth: "none",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Geist', 'SF Pro Text', sans-serif",
      }}
    >
      {/* ── TIER 1: QR card ── */}
      <div className="evermade-shimmer-shell" style={{ borderRadius: 20, flexShrink: 0 }}>
        <div className="evermade-shimmer-content" style={{ padding: "16px 14px 14px" }}>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "rgba(255,255,255,0.88)", letterSpacing: -0.2, marginBottom: 2 }}>
              Test on your device
            </div>
            <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.28)" }}>
              {previewUrl ? "Scan to open live preview" : "Generating preview…"}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <div style={{
              padding: 10,
              background: "white",
              borderRadius: 12,
              boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)",
            }}>
              {previewUrl ? <RealQRCode url={previewUrl} /> : <FakeQRCode />}
            </div>
          </div>

          {previewUrl && (
            <div style={{
              marginBottom: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 5, padding: "4px 10px", borderRadius: 20,
              background: "rgba(79,142,255,0.07)", border: "1px solid rgba(79,142,255,0.15)",
            }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#4f8eff", boxShadow: "0 0 6px rgba(79,142,255,0.9)", flexShrink: 0 }} />
              <span style={{ fontSize: 9.5, color: "rgba(179,210,255,0.6)", fontFamily: "monospace" }}>
                {previewUrl}
              </span>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <rect x="2" y="1" width="10" height="12" rx="2.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
                  <circle cx="7" cy="11" r="0.8" fill="rgba(255,255,255,0.4)" />
                  <rect x="4.5" y="3" width="5" height="0.8" rx="0.4" fill="rgba(255,255,255,0.3)" />
                </svg>
              </div>
              <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>Open Camera</span>
            </div>

            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" style={{ flexShrink: 0, marginBottom: 12 }}>
              <path d="M1 5h11M8 1l4 4-4 4" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(124,92,252,0.1)", border: "1px solid rgba(124,92,252,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="5" height="5" rx="1" stroke="rgba(124,92,252,0.85)" strokeWidth="1.2" />
                  <rect x="8" y="1" width="5" height="5" rx="1" stroke="rgba(124,92,252,0.85)" strokeWidth="1.2" />
                  <rect x="1" y="8" width="5" height="5" rx="1" stroke="rgba(124,92,252,0.85)" strokeWidth="1.2" />
                  <rect x="10" y="10" width="3" height="3" rx="0.5" fill="rgba(124,92,252,0.85)" />
                </svg>
              </div>
              <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>Scan QR code</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── TIER 2: Make it functional (shown when screens exist) ── */}
      {hasScreens && (
        <FunctionalizeSection sleekApp={sleekApp} onDone={handleFunctionalizeDone} />
      )}

      {/* ── TIER 3: Build for device (shown once app is functional) ── */}
      {hasScreens && sleekApp.isFunctional && (
        <DeviceBuildSection
          sleekApp={sleekApp}
          onPersist={handlePersist}
        />
      )}

      {/* ── TIER 4: Guidance ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 4px", flexShrink: 0 }}>
        {[
          "Browser preview is approximate — native device shows true performance.",
          "Hot-reload active: changes appear instantly on scan.",
        ].map((text, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(79,142,255,0.3)", flexShrink: 0, marginTop: 5 }} />
            <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.26)", lineHeight: 1.6 }}>{text}</span>
          </div>
        ))}
      </div>

      {/* ── TIER 5: Deploy card ── */}
      <div style={{
        borderRadius: 16, overflow: "hidden",
        border: "1px solid rgba(79,142,255,0.22)",
        background: "rgba(79,142,255,0.05)",
        boxShadow: "0 0 30px rgba(79,142,255,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
        flexShrink: 0,
      }}>
        <div style={{ height: 1.5, background: "linear-gradient(90deg, rgba(79,142,255,0.95) 0%, rgba(124,92,252,0.7) 60%, transparent 100%)", boxShadow: "0 0 10px rgba(79,142,255,0.5)" }} />

        <div style={{ padding: "13px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #7c5cfc 0%, #4878ff 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0, boxShadow: "0 4px 12px rgba(124,92,252,0.4)" }}>🚀</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.88)", letterSpacing: -0.1, marginBottom: 1 }}>Ready to ship?</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>App Store · Google Play</div>
            </div>
          </div>

          <p style={{ margin: "0 0 10px", fontSize: 10.5, color: "rgba(255,255,255,0.34)", lineHeight: 1.6 }}>
            Submit directly to both stores — no Xcode or Android Studio required.
          </p>

          <button type="button" style={{ width: "100%", padding: "9px 0", borderRadius: 10, border: "1px solid rgba(79,142,255,0.35)", background: "linear-gradient(135deg, rgba(79,142,255,0.22) 0%, rgba(124,92,252,0.12) 100%)", color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: 650, cursor: "pointer", letterSpacing: 0.1, boxShadow: "0 0 18px rgba(79,142,255,0.18)", fontFamily: "inherit" }}>
            Publish now →
          </button>

          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>, label: "App Store", sub: "Download on" },
              { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M3.18 23.76a2 2 0 0 0 2.14-.22l12.1-6.92L14 13l-10.82 10.76z" fill="rgba(255,255,255,0.5)"/><path d="M22.23 9.62a2 2 0 0 0 0 4.76l-.01-.01-2.84-1.63-2.84-1.63 2.85-1.63 2.84-1.62v.13z" fill="rgba(255,255,255,0.7)"/><path d="M3.18.24A2 2 0 0 0 2 2.03v19.94a2 2 0 0 0 1.18 1.79L14 13 3.18.24z" fill="rgba(255,255,255,0.85)"/><path d="M17.42 16.14L5.32 23.06a2 2 0 0 0 2.1-.1L19.38 15.5l-1.96.64z" fill="rgba(255,255,255,0.6)"/><path d="M17.42 7.86l1.96.64L7.42 1.04a2 2 0 0 0-2.1-.1l12.1 6.92z" fill="rgba(255,255,255,0.6)"/></svg>, label: "Google Play", sub: "Get it on" },
            ].map(({ icon, label, sub }) => (
              <div key={label} style={{ flex: 1, display: "flex", alignItems: "center", gap: 7, padding: "7px 10px", borderRadius: 9, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}>
                {icon}
                <div>
                  <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", lineHeight: 1, marginBottom: 1 }}>{sub}</div>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: "rgba(255,255,255,0.82)", lineHeight: 1, letterSpacing: -0.1 }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Build status ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", borderRadius: 10, background: "rgba(255,255,255,0.018)", border: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: sleekApp?.isFunctional ? "#CCFF00" : "#4ade80", boxShadow: sleekApp?.isFunctional ? "0 0 7px rgba(204,255,0,0.8)" : "0 0 7px rgba(74,222,128,0.8)", flexShrink: 0 }} />
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
          {sleekApp?.isFunctional ? `Functional · ${sleekApp.screens.length} screens` : `Build ready · ${project.name} ${project.version}`}
        </span>
      </div>
    </div>
  );
}
