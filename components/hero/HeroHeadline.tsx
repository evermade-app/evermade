interface HeroHeadlineProps {
  firstName?: string;
}

export default function HeroHeadline({ firstName }: HeroHeadlineProps) {
  if (firstName) {
    return (
      <div className="flex flex-col items-center text-center">
        <h1
          className="font-bold text-white px-4 md:px-0"
          style={{
            fontSize: "clamp(28px, 5vw, 72px)",
            lineHeight: 1.02,
            letterSpacing: "clamp(-1.5px, -0.4vw, -4px)",
          }}
        >
          Hey {firstName},
          <br />
          ready to launch for real?
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      <h1
        className="font-bold text-white px-4 md:px-0"
        style={{
          fontSize: "clamp(32px, 6vw, 80px)",
          lineHeight: 1.02,
          letterSpacing: "clamp(-2px, -0.5vw, -4.8px)",
        }}
      >
        Build in minutes.
        <br />
        Launch on the way.
      </h1>

      <p
        className="max-w-[736px] mt-4 md:mt-6 px-4 md:px-0 text-base md:text-xl font-medium"
        style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.55 }}
      >
        Describe your app. Evermade builds it instantly — screens, flows, and
        interactions included.
      </p>
    </div>
  );
}
