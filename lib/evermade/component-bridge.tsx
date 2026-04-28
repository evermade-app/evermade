"use client";

import React from "react";

// shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

type P = Record<string, unknown>;

function str(v: unknown, fallback: string): string {
  return typeof v === "string" && v.trim() ? v.trim() : fallback;
}
function num(v: unknown, fallback: number): number {
  return typeof v === "number" && !isNaN(v) ? v : fallback;
}
function bool(v: unknown, fallback: boolean): boolean {
  return typeof v === "boolean" ? v : fallback;
}

export function resolveBridgeComponent(id: string, props: P): React.ReactNode | null {
  switch (id) {

    // ── shadcn Button variants ─────────────────────────────────────────────
    case "shadcn-button-primary": {
      const label = str(props.label, "Continue");
      return (
        <Button className="w-full bg-gradient-to-r from-[#7C5CFC] to-[#4878FF] text-white font-semibold hover:opacity-90 transition-opacity rounded-xl h-11">
          {label}
        </Button>
      );
    }

    case "shadcn-button-secondary": {
      const label = str(props.label, "Cancel");
      return (
        <Button variant="outline" className="w-full border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white rounded-xl h-11">
          {label}
        </Button>
      );
    }

    case "shadcn-button-ghost": {
      const label = str(props.label, "Learn more");
      const icon = str(props.icon, "→");
      return (
        <Button variant="ghost" className="w-full text-[#7C5CFC] hover:text-[#7C5CFC] hover:bg-[#7C5CFC]/10 rounded-xl h-11 gap-2">
          {label} <span>{icon}</span>
        </Button>
      );
    }

    // ── shadcn Card variants ───────────────────────────────────────────────
    case "shadcn-card-metric": {
      const title = str(props.title, "Metric");
      const value = str(props.value, "—");
      const description = str(props.description, "");
      const trend = str(props.trend, "");
      const trendUp = bool(props.trendUp, true);
      return (
        <Card className="w-full bg-white/[0.04] border-white/[0.08] rounded-2xl">
          <CardHeader className="pb-1.5 pt-3 px-3">
            <CardDescription className="text-white/40 text-[10px] uppercase tracking-wider">{title}</CardDescription>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="flex items-end justify-between">
              <div className="text-xl font-bold text-white tracking-tight">{value}</div>
              {trend && (
                <Badge className={`text-[10px] font-bold px-2 py-0.5 rounded-full border-0 ${trendUp ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                  {trendUp ? "↑" : "↓"} {trend}
                </Badge>
              )}
            </div>
            {description && <p className="text-white/30 text-[10px] mt-1">{description}</p>}
          </CardContent>
        </Card>
      );
    }

    case "shadcn-card-feature": {
      const icon = str(props.icon, "⚡");
      const title = str(props.title, "Feature");
      const description = str(props.description, "");
      const accentColor = str(props.accentColor, "#7C5CFC");
      return (
        <div className="w-full rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.04]">
          <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
          <div className="p-2.5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-sm"
              style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}30` }}>
              {icon}
            </div>
            <div className="min-w-0">
              <div className="text-white text-[12px] font-semibold leading-tight">{title}</div>
              {description && <div className="text-white/40 text-[10px] mt-0.5 leading-snug truncate">{description}</div>}
            </div>
          </div>
        </div>
      );
    }

    case "shadcn-card-profile": {
      const name = str(props.name, "User");
      const role = str(props.role, "");
      const initial = str(props.initial, name.charAt(0));
      const accentColor = str(props.accentColor, "#7C5CFC");
      const rawStats = props.stats as Array<{ value: string; label: string }> | undefined;
      const stats = rawStats?.slice(0, 3) ?? [
        { value: "128", label: "Sessions" },
        { value: "42", label: "Days" },
        { value: "Pro", label: "Plan" },
      ];
      return (
        <div className="w-full rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.04]">
          <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}40)` }} />
          <div className="p-3">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)` }}>
                {initial}
              </div>
              <div>
                <div className="text-white font-bold text-[13px] leading-tight">{name}</div>
                {role && <div className="text-white/40 text-[10px] mt-0.5">{role}</div>}
              </div>
            </div>
            <div className="h-px bg-white/[0.06] mb-2.5" />
            <div className="grid grid-cols-3 gap-1">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-white font-bold text-[13px]">{s.value}</div>
                  <div className="text-white/30 text-[8px] uppercase tracking-wide mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ── shadcn Badge ──────────────────────────────────────────────────────
    case "shadcn-badge-status": {
      const label = str(props.label, "Active");
      const type = str(props.type, "success");
      const styles: Record<string, string> = {
        success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        danger: "bg-red-500/10 text-red-400 border-red-500/20",
        info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        neutral: "bg-white/5 text-white/50 border-white/10",
      };
      return (
        <Badge className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${styles[type] ?? styles.neutral}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 inline-block" />
          {label}
        </Badge>
      );
    }

    // ── shadcn Progress ────────────────────────────────────────────────────
    case "shadcn-progress-bar": {
      const label = str(props.label, "Progress");
      const value = num(props.value, 65);
      const showPercent = bool(props.showPercent, true);
      const accentColor = str(props.accentColor, "#7C5CFC");
      return (
        <div className="w-full space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-[11px]">{label}</span>
            {showPercent && <span className="text-white/40 text-[10px]">{value}%</span>}
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/[0.07]">
            <div className="h-full rounded-full transition-all"
              style={{ width: `${value}%`, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}99)` }} />
          </div>
        </div>
      );
    }

    // ── shadcn Tabs ────────────────────────────────────────────────────────
    case "shadcn-tabs": {
      const rawTabs = props.tabs as Array<{ value: string; label: string; content: string }> | undefined;
      const tabs = rawTabs ?? [
        { value: "overview", label: "Overview", content: "Overview content" },
        { value: "stats", label: "Stats", content: "Stats content" },
        { value: "history", label: "History", content: "History content" },
      ];
      return (
        <Tabs defaultValue={tabs[0]?.value} className="w-full">
          <TabsList className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg p-0.5">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}
                className="flex-1 rounded-md text-[10px] py-1 data-[state=active]:bg-[#7C5CFC] data-[state=active]:text-white text-white/40 transition-all">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="text-white/40 text-[10px] pt-2 px-1">{tab.content}</div>
            </TabsContent>
          ))}
        </Tabs>
      );
    }

    // ── shadcn Alert ──────────────────────────────────────────────────────
    case "shadcn-alert": {
      const title = str(props.title, "");
      const description = str(props.description, "");
      const type = str(props.type, "info");
      const icon = str(props.icon, "ℹ️");
      const borderColors: Record<string, string> = {
        success: "border-emerald-500/30 bg-emerald-500/5",
        warning: "border-amber-500/30 bg-amber-500/5",
        danger: "border-red-500/30 bg-red-500/5",
        info: "border-blue-500/30 bg-blue-500/5",
      };
      return (
        <Alert className={`rounded-xl border ${borderColors[type] ?? borderColors.info}`}>
          <span className="text-base">{icon}</span>
          {title && <AlertTitle className="text-white text-[12px] font-semibold ml-2">{title}</AlertTitle>}
          {description && <AlertDescription className="text-white/50 text-[10px] ml-2">{description}</AlertDescription>}
        </Alert>
      );
    }

    // ── shadcn Switch row ─────────────────────────────────────────────────
    case "shadcn-switch-row": {
      const label = str(props.label, "Setting");
      const description = str(props.description, "");
      const defaultChecked = bool(props.defaultChecked, true);
      return (
        <div className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
          <div className="flex-1 min-w-0 mr-3">
            <div className="text-white/80 text-[12px] font-medium">{label}</div>
            {description && <div className="text-white/30 text-[10px] mt-0.5">{description}</div>}
          </div>
          <Switch defaultChecked={defaultChecked} className="data-[state=checked]:bg-[#7C5CFC]" />
        </div>
      );
    }

    // ── shadcn Skeleton loader ────────────────────────────────────────────
    case "shadcn-skeleton-card": {
      return (
        <div className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full bg-white/[0.07]" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-3 w-3/4 rounded-full bg-white/[0.07]" />
              <Skeleton className="h-2.5 w-1/2 rounded-full bg-white/[0.05]" />
            </div>
          </div>
          <Skeleton className="h-2 w-full rounded-full bg-white/[0.05]" />
          <Skeleton className="h-2 w-5/6 rounded-full bg-white/[0.05]" />
        </div>
      );
    }

    // ── Untitled UI — Metric card ─────────────────────────────────────────
    case "untitled-metric-card": {
      const label = str(props.label, "Total Revenue");
      const value = str(props.value, "$0");
      const change = str(props.change, "+0%");
      const changeLabel = str(props.changeLabel, "vs last month");
      const isPositive = !change.startsWith("-");
      const icon = str(props.icon, "💰");
      return (
        <div className="w-full p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
          <div className="flex items-center justify-between mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#7C5CFC]/15 border border-[#7C5CFC]/25 flex items-center justify-center text-sm">{icon}</div>
            <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
              {isPositive ? "↑" : "↓"} {change}
            </span>
          </div>
          <div className="text-[17px] font-bold text-white tracking-tight leading-none mb-0.5">{value}</div>
          <div className="text-white/35 text-[9px] uppercase tracking-wider">{label}</div>
          <div className="text-white/20 text-[8px] mt-0.5">{changeLabel}</div>
        </div>
      );
    }

    // ── Untitled UI — Avatar group ────────────────────────────────────────
    case "untitled-avatar-group": {
      const label = str(props.label, "Team members");
      const count = num(props.count, 24);
      const rawAvatars = props.avatars as Array<{ initial: string; color: string }> | undefined;
      const avatars = rawAvatars ?? [
        { initial: "A", color: "#7C5CFC" },
        { initial: "B", color: "#4878FF" },
        { initial: "C", color: "#34D399" },
        { initial: "D", color: "#F97316" },
      ];
      return (
        <div className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
          <div className="flex">
            {avatars.slice(0, 4).map((a, i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-[#08080F] flex items-center justify-center text-white text-[10px] font-bold"
                style={{ background: a.color, marginLeft: i > 0 ? -8 : 0, zIndex: 4 - i, position: "relative" }}>
                {a.initial}
              </div>
            ))}
            {count > avatars.length && (
              <div className="w-7 h-7 rounded-full border-2 border-[#08080F] flex items-center justify-center text-white/50 text-[9px] font-bold bg-white/10"
                style={{ marginLeft: -8, zIndex: 0, position: "relative" }}>
                +{count - avatars.length}
              </div>
            )}
          </div>
          <div className="text-white/50 text-[11px]">{label}</div>
        </div>
      );
    }

    // ── Untitled UI — Feature item ────────────────────────────────────────
    case "untitled-feature-item": {
      const icon = str(props.icon, "✓");
      const title = str(props.title, "Feature");
      const description = str(props.description, "");
      const accentColor = str(props.accentColor, "#7C5CFC");
      return (
        <div className="w-full flex gap-3 p-3 rounded-xl">
          <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-sm"
            style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}30`, color: accentColor }}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white/85 text-[12px] font-semibold">{title}</div>
            {description && <div className="text-white/35 text-[10px] mt-0.5 leading-relaxed">{description}</div>}
          </div>
        </div>
      );
    }

    // ── Untitled UI — Pricing row ─────────────────────────────────────────
    case "untitled-pricing-row": {
      const plan = str(props.plan, "Pro");
      const price = str(props.price, "$12");
      const period = str(props.period, "/mo");
      const description = str(props.description, "Everything you need");
      const cta = str(props.cta, "Get started");
      const featured = bool(props.featured, false);
      return (
        <div className={`w-full p-4 rounded-2xl border ${featured ? "bg-gradient-to-br from-[#7C5CFC]/15 to-[#4878FF]/10 border-[#7C5CFC]/30" : "bg-white/[0.03] border-white/[0.08]"}`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-white font-bold text-sm">{plan}</div>
              <div className="text-white/40 text-[10px] mt-0.5">{description}</div>
            </div>
            {featured && <Badge className="bg-[#7C5CFC] text-white text-[9px] font-bold px-2 py-0.5 rounded-full border-0">Popular</Badge>}
          </div>
          <div className="mb-3">
            <span className="text-white text-2xl font-bold tracking-tight">{price}</span>
            <span className="text-white/30 text-[11px]">{period}</span>
          </div>
          <Button className={`w-full h-9 rounded-xl text-[12px] font-semibold ${featured ? "bg-gradient-to-r from-[#7C5CFC] to-[#4878FF] text-white hover:opacity-90" : "bg-white/[0.06] text-white/60 hover:bg-white/[0.1] border border-white/[0.1]"}`}>
            {cta}
          </Button>
        </div>
      );
    }

    // ── Untitled UI — Notification item ──────────────────────────────────
    case "untitled-notification": {
      const icon = str(props.icon, "🔔");
      const title = str(props.title, "Notification");
      const message = str(props.message, "");
      const time = str(props.time, "");
      const unread = bool(props.unread, false);
      return (
        <div className={`w-full flex gap-3 p-3 rounded-xl ${unread ? "bg-[#7C5CFC]/5 border border-[#7C5CFC]/15" : "bg-white/[0.02] border border-transparent"}`}>
          <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.08] flex-shrink-0 flex items-center justify-center text-sm">{icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="text-white/85 text-[11px] font-semibold leading-tight">{title}</div>
              {time && <div className="text-white/25 text-[9px] flex-shrink-0">{time}</div>}
            </div>
            {message && <div className="text-white/35 text-[10px] mt-0.5 leading-relaxed truncate">{message}</div>}
          </div>
          {unread && <div className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC] flex-shrink-0 mt-1.5" />}
        </div>
      );
    }

    // ── Untitled UI — Step progress ───────────────────────────────────────
    case "untitled-step-progress": {
      const rawSteps = props.steps as Array<{ label: string; status: "complete" | "current" | "upcoming" }> | undefined;
      const steps = rawSteps ?? [
        { label: "Account", status: "complete" },
        { label: "Profile", status: "current" },
        { label: "Review", status: "upcoming" },
      ];
      return (
        <div className="w-full flex items-center justify-between px-2">
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border ${
                  step.status === "complete" ? "bg-[#7C5CFC] border-[#7C5CFC] text-white"
                  : step.status === "current" ? "bg-transparent border-[#7C5CFC] text-[#7C5CFC]"
                  : "bg-transparent border-white/20 text-white/20"
                }`}>
                  {step.status === "complete" ? "✓" : i + 1}
                </div>
                <div className={`text-[9px] font-medium ${
                  step.status === "complete" ? "text-[#7C5CFC]"
                  : step.status === "current" ? "text-white/80"
                  : "text-white/20"
                }`}>{step.label}</div>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-1 mb-4 ${step.status === "complete" ? "bg-[#7C5CFC]/50" : "bg-white/10"}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}
