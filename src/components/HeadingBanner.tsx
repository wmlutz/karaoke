interface HeadingBannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export default function HeadingBanner({
  title,
  subtitle,
  backgroundImage,
}: HeadingBannerProps) {
  return (
    <div
      className="pt-32 pb-24 sm:pt-40 sm:pb-32  relative"
      style={{
        backgroundColor: "var(--color-navy)",
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for better text readability when background image is present */}
      {backgroundImage && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "rgba(32, 57, 77, 0.85)",
          }}
        />
      )}

      <div className="text-center relative z-10">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
          style={{
            fontFamily: "var(--font-montserrat)",
            color: "var(--color-cream)",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-lg sm:text-xl max-w-3xl mx-auto px-4"
            style={{
              fontFamily: "var(--font-raleway)",
              color: "var(--color-cream)",
              opacity: 0.9,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
