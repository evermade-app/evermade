import VideoBackground from "../components/hero/VideoBackground";
import HeroNav from "../components/hero/HeroNav";
import HeroBadge from "../components/hero/HeroBadge";
import HeroHeadline from "../components/hero/HeroHeadline";
import HeroWindow from "../components/hero/HeroWindow";
import LogosTicker from "../components/home/LogosTicker";
import BentoFeatures from "../components/home/BentoFeatures";
import FeaturesGrid from "../components/home/FeaturesGrid";
import HowItWorks from "../components/home/HowItWorks";
import IntegrationsSection from "../components/home/IntegrationsSection";
import Testimonials from "../components/home/Testimonials";
import PricingSection from "../components/home/PricingSection";
import FaqSection from "../components/home/FaqSection";
import BlogSection from "../components/home/BlogSection";
import CtaBanner from "../components/home/CtaBanner";
import FooterSection from "../components/home/FooterSection";

export default function HomePage() {
  return (
    <div className="relative" style={{ background: "#090611" }}>
      {/* ── Hero (unchanged) ── */}
      <div className="relative min-h-screen overflow-hidden">
        <VideoBackground />
        <div className="relative z-10 flex min-h-screen flex-col">
          <HeroNav />
          <div
            className="flex flex-1 flex-col items-center justify-center"
            style={{ marginTop: -20 }}
          >
            <HeroBadge />
            <div className="mt-6 md:mt-[34px]">
              <HeroHeadline />
            </div>
            <div className="mt-8 w-full px-4 sm:px-8 md:mt-[44px] md:px-16 lg:px-[120px]">
              <HeroWindow />
            </div>
          </div>
        </div>
      </div>

      {/* ── Sections below hero ── */}
      <LogosTicker />
      <BentoFeatures />
      <FeaturesGrid />
      <HowItWorks />
      <IntegrationsSection />
      <Testimonials />
      <PricingSection />
      <FaqSection />
      <BlogSection />
      <CtaBanner />
      <FooterSection />
    </div>
  );
}
