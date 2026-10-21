/**
 * Animated backdrop for the downloads hero.
 *
 * Pure CSS layers, back to front:
 *   1. drifting colour clouds (teal / indigo / amber)
 *   2. a slowly rotating conic arc that gives the field a direction
 *   3. a dot field that drifts diagonally — texture, but alive
 *   4. animated film grain
 *   5. one slow light sweep
 *
 * No JS, no canvas; every animation is disabled under
 * `prefers-reduced-motion` (see global.css).
 */
export function HeroAurora() {
  return (
    <div aria-hidden className="hero-aurora -z-10">
      {/* colour clouds */}
      <div className="hero-aurora__blob hero-aurora__blob--teal" />
      <div className="hero-aurora__blob hero-aurora__blob--indigo" />
      <div className="hero-aurora__blob hero-aurora__blob--amber" />

      {/* rotating arc */}
      <div className="hero-aurora__arc" />

      {/* drifting dot field */}
      <div className="hero-aurora__dots" />

      {/* film grain + light sweep */}
      <div className="hero-aurora__grain" />
      <div className="hero-aurora__sweep" />

      {/* fade the whole field into the next section */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-fd-background" />
    </div>
  );
}
