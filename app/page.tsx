import VideoBackground from "../components/hero/VideoBackground";
import HeroNav from "../components/hero/HeroNav";
import HeroBadge from "../components/hero/HeroBadge";
import HeroHeadline from "../components/hero/HeroHeadline";
import HeroWindow from "../components/hero/HeroWindow";
import ImplicitAuthRedirect from "../components/auth/ImplicitAuthRedirect";

export default function HomePage() {
  return (
    <div className="relative" style={{ background: "#050509" }}>
      <ImplicitAuthRedirect />
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
    </div>
  );
}
