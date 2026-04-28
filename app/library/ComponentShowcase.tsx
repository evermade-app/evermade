"use client";

import React from "react";

// Buttons
import CtaSwitchToggleButton from "@/components/evermade/buttons/CtaSwitchToggleButton";
import CtaGlowArrowButton from "@/components/evermade/buttons/CtaGlowArrowButton";
import SecondarySimpleButton from "@/components/evermade/buttons/SecondarySimpleButton";
import SecondaryRainbowGithubButton from "@/components/evermade/buttons/SecondaryRainbowGithubButton";
import LoadingDashedSpinner from "@/components/evermade/buttons/LoadingDashedSpinner";
import LoadingSpectrumRingSpinner from "@/components/evermade/buttons/LoadingSpectrumRingSpinner";
import PillGenerateButton from "@/components/evermade/buttons/PillGenerateButton";
import PillExploreButton from "@/components/evermade/buttons/PillExploreButton";
import GradientGenerateButton from "@/components/evermade/buttons/GradientGenerateButton";
import GradientStartButton from "@/components/evermade/buttons/GradientStartButton";

// Inputs
import ChatAttachInput from "@/components/evermade/inputs/ChatAttachInput";
import SoftPillInput from "@/components/evermade/inputs/SoftPillInput";
import SearchGlassInput from "@/components/evermade/inputs/SearchGlassInput";
import GradientRangeSlider from "@/components/evermade/inputs/GradientRangeSlider";
import UploadDropzone from "@/components/evermade/inputs/UploadDropzone";
import UploadFolderSelector from "@/components/evermade/inputs/UploadFolderSelector";
import ToggleMetalSwitch from "@/components/evermade/inputs/ToggleMetalSwitch";
import ToggleNeumorphicSwitch from "@/components/evermade/inputs/ToggleNeumorphicSwitch";

// Cards
import ChatComposerCard from "@/components/evermade/cards/ChatComposerCard";
import GlassStackCard from "@/components/evermade/cards/GlassStackCard";
import SalesMetricCard from "@/components/evermade/cards/SalesMetricCard";
import SkeuomorphicInsetCard from "@/components/evermade/cards/SkeuomorphicInsetCard";
import FlipFoodCard from "@/components/evermade/cards/FlipFoodCard";
import KpiGlowCard from "@/components/evermade/cards/KpiGlowCard";
import NeumorphDarkCard from "@/components/evermade/cards/NeumorphDarkCard";
import PremiumRibbonCard from "@/components/evermade/cards/PremiumRibbonCard";

// Feedback
import PulseBarsLoader from "@/components/evermade/feedback/PulseBarsLoader";
import ProgressTrackLoader from "@/components/evermade/feedback/ProgressTrackLoader";
import EmojiReactionMenu from "@/components/evermade/feedback/EmojiReactionMenu";

// Navigation
import FloatingIconNav from "@/components/evermade/navigation/FloatingIconNav";
import SearchNavInput from "@/components/evermade/navigation/SearchNavInput";
import FrostedBottomNav from "@/components/evermade/navigation/FrostedBottomNav";
import CyberSegmentNav from "@/components/evermade/navigation/CyberSegmentNav";

// Data
import ActivityListItem from "@/components/evermade/data/ActivityListItem";
import StackedNotificationCard from "@/components/evermade/data/StackedNotificationCard";

// Chat/AI
import FloatingChatButton from "@/components/evermade/chat/FloatingChatButton";
import ContactAiForm from "@/components/evermade/chat/ContactAiForm";

// Dashboard
import CryptoDashboardCard from "@/components/evermade/dashboard/CryptoDashboardCard";
import GradientAnalyticsCard from "@/components/evermade/dashboard/GradientAnalyticsCard";

// Auth / Mobile
import CleanAuthForm from "@/components/evermade/mobile/CleanAuthForm";
import SoftBlueAuthForm from "@/components/evermade/mobile/SoftBlueAuthForm";

// Commerce
import ProPricingCard from "@/components/evermade/commerce/ProPricingCard";
import CheckoutPaymentForm from "@/components/evermade/commerce/CheckoutPaymentForm";

/* ─────────────────────────────────────────────────────────────────────
   Shared helpers
───────────────────────────────────────────────────────────────────── */

interface PreviewCardProps {
  name: string;
  description?: string;
  children: React.ReactNode;
  wide?: boolean;
}

function PreviewCard({ name, description, children, wide = false }: PreviewCardProps) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        gridColumn: wide ? "span 2" : undefined,
      }}
    >
      <div>
        <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.9)", margin: 0, fontFamily: "monospace" }}>
          {name}
        </p>
        {description && (
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0", lineHeight: 1.4 }}>
            {description}
          </p>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80px", flexWrap: "wrap", gap: "12px" }}>
        {children}
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  emoji: string;
  children: React.ReactNode;
}

function Section({ title, emoji, children }: SectionProps) {
  return (
    <section style={{ marginBottom: "60px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <span style={{ fontSize: "24px" }}>{emoji}</span>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "rgba(255,255,255,0.95)", margin: 0, letterSpacing: "-0.02em" }}>
          {title}
        </h2>
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {children}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Main showcase
───────────────────────────────────────────────────────────────────── */

export default function ComponentShowcase() {
  return (
    <div>
      {/* Buttons */}
      <Section title="Buttons & CTAs" emoji="🔘">
        <PreviewCard name="CtaSwitchToggleButton" description="Dark neumorphic toggle switch">
          <CtaSwitchToggleButton />
        </PreviewCard>
        <PreviewCard name="CtaGlowArrowButton" description="Gradient glow button with arrow">
          <CtaGlowArrowButton label="Get Started" />
        </PreviewCard>
        <PreviewCard name="SecondarySimpleButton" description="Zinc border secondary button">
          <SecondarySimpleButton label="Hello" sublabel="simple button" />
        </PreviewCard>
        <PreviewCard name="SecondaryRainbowGithubButton" description="Animated rainbow GitHub button">
          <SecondaryRainbowGithubButton stars={42} />
        </PreviewCard>
        <PreviewCard name="LoadingDashedSpinner" description="Yellow dashed loading spinner">
          <LoadingDashedSpinner />
        </PreviewCard>
        <PreviewCard name="LoadingSpectrumRingSpinner" description="Multi-color spectrum ring">
          <LoadingSpectrumRingSpinner />
        </PreviewCard>
        <PreviewCard name="PillGenerateButton" description="Sparkle generate pill button">
          <PillGenerateButton />
        </PreviewCard>
        <PreviewCard name="PillExploreButton" description="Elegant dark explore button">
          <PillExploreButton />
        </PreviewCard>
        <PreviewCard name="GradientGenerateButton" description="Animated letter-gradient generate">
          <GradientGenerateButton />
        </PreviewCard>
        <PreviewCard name="GradientStartButton" description="Green grid-pattern start button">
          <GradientStartButton />
        </PreviewCard>
      </Section>

      {/* Inputs */}
      <Section title="Inputs & Controls" emoji="⌨️">
        <PreviewCard name="ChatAttachInput" description="Chat input with file attach + send">
          <ChatAttachInput />
        </PreviewCard>
        <PreviewCard name="SoftPillInput" description="Soft inset-shadow pill input">
          <SoftPillInput placeholder="Username" />
        </PreviewCard>
        <PreviewCard name="SearchGlassInput" description="Search with animated glass border">
          <SearchGlassInput />
        </PreviewCard>
        <PreviewCard name="GradientRangeSlider" description="Rainbow gradient range slider">
          <GradientRangeSlider />
        </PreviewCard>
        <PreviewCard name="UploadDropzone" description="Drag & drop file upload zone">
          <UploadDropzone />
        </PreviewCard>
        <PreviewCard name="UploadFolderSelector" description="Animated folder file chooser">
          <UploadFolderSelector />
        </PreviewCard>
        <PreviewCard name="ToggleMetalSwitch" description="Metallic skeuomorphic toggle">
          <ToggleMetalSwitch />
        </PreviewCard>
        <PreviewCard name="ToggleNeumorphicSwitch" description="3D neumorphic elastic toggle">
          <ToggleNeumorphicSwitch />
        </PreviewCard>
      </Section>

      {/* Cards */}
      <Section title="Cards" emoji="🃏">
        <PreviewCard name="ChatComposerCard" description="AI chat composer with gradient border">
          <ChatComposerCard />
        </PreviewCard>
        <PreviewCard name="GlassStackCard" description="Frosted glass stacked fan on hover" wide>
          <GlassStackCard />
        </PreviewCard>
        <PreviewCard name="SalesMetricCard" description="Sales metric with progress bar">
          <SalesMetricCard />
        </PreviewCard>
        <PreviewCard name="SkeuomorphicInsetCard" description="Deep inset shadow card">
          <SkeuomorphicInsetCard />
        </PreviewCard>
        <PreviewCard name="FlipFoodCard" description="3D flip card with food content">
          <FlipFoodCard />
        </PreviewCard>
        <PreviewCard name="KpiGlowCard" description="KPI card with animated dot border">
          <KpiGlowCard />
        </PreviewCard>
        <PreviewCard name="NeumorphDarkCard" description="Dark neumorphic minimal card">
          <NeumorphDarkCard />
        </PreviewCard>
        <PreviewCard name="PremiumRibbonCard" description="Card with gradient Premium ribbon">
          <PremiumRibbonCard />
        </PreviewCard>
      </Section>

      {/* Feedback */}
      <Section title="Feedback & Loaders" emoji="⏳">
        <PreviewCard name="PulseBarsLoader" description="Neon blue pulsing bars loader">
          <PulseBarsLoader />
        </PreviewCard>
        <PreviewCard name="ProgressTrackLoader" description="Animated green progress track">
          <ProgressTrackLoader />
        </PreviewCard>
        <PreviewCard name="EmojiReactionMenu" description="Animated emoji reaction bar" wide>
          <EmojiReactionMenu />
        </PreviewCard>
      </Section>

      {/* Navigation */}
      <Section title="Navigation" emoji="🧭">
        <PreviewCard name="FloatingIconNav" description="Dark floating icon nav bar">
          <FloatingIconNav />
        </PreviewCard>
        <PreviewCard name="SearchNavInput" description="Rounded nav search input">
          <SearchNavInput />
        </PreviewCard>
        <PreviewCard name="FrostedBottomNav" description="Frosted glass bottom nav" wide>
          <FrostedBottomNav />
        </PreviewCard>
        <PreviewCard name="CyberSegmentNav" description="Cyber segmented tab nav">
          <CyberSegmentNav />
        </PreviewCard>
      </Section>

      {/* Data */}
      <Section title="Lists & Notifications" emoji="📋">
        <PreviewCard name="ActivityListItem" description="Activity feed list item with avatar">
          <ActivityListItem />
        </PreviewCard>
        <PreviewCard name="StackedNotificationCard" description="Three stacked glass notifications" wide>
          <StackedNotificationCard />
        </PreviewCard>
      </Section>

      {/* Chat / AI */}
      <Section title="Chat & AI" emoji="🤖">
        <PreviewCard name="FloatingChatButton" description="Gradient floating chat FAB">
          <FloatingChatButton />
        </PreviewCard>
        <PreviewCard name="ContactAiForm" description="Dark gradient contact form" wide>
          <ContactAiForm />
        </PreviewCard>
      </Section>

      {/* Dashboard */}
      <Section title="Dashboard & Analytics" emoji="📊">
        <PreviewCard name="CryptoDashboardCard" description="Crypto dashboard with live chart">
          <CryptoDashboardCard />
        </PreviewCard>
        <PreviewCard name="GradientAnalyticsCard" description="Analytics card with bar chart">
          <GradientAnalyticsCard />
        </PreviewCard>
      </Section>

      {/* Auth */}
      <Section title="Auth Forms" emoji="🔐">
        <PreviewCard name="CleanAuthForm" description="Clean white auth form with socials" wide>
          <CleanAuthForm />
        </PreviewCard>
        <PreviewCard name="SoftBlueAuthForm" description="Soft blue rounded auth form">
          <SoftBlueAuthForm />
        </PreviewCard>
      </Section>

      {/* Commerce */}
      <Section title="Commerce" emoji="💳">
        <PreviewCard name="ProPricingCard" description="Pro tier pricing card with gradient">
          <ProPricingCard />
        </PreviewCard>
        <PreviewCard name="CheckoutPaymentForm" description="Dark animated checkout form">
          <CheckoutPaymentForm />
        </PreviewCard>
      </Section>
    </div>
  );
}
