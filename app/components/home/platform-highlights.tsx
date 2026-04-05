const highlights = [
  {
    title: "Feature boundaries",
    copy: "Wallet state, initialization, and modal launch live under a dedicated feature so the homepage can evolve independently.",
  },
  {
    title: "Design tokens first",
    copy: "Color, surface, line, and modal theme variables are centralized to make later UI growth more predictable.",
  },
  {
    title: "Progressive next steps",
    copy: "This structure is ready for dashboards, holdings tables, market cards, and authenticated flows without reworking the foundation.",
  },
];

export function PlatformHighlights() {
  return (
    <section className="mt-4 grid gap-4 pb-4 lg:grid-cols-[0.9fr_1.1fr]">
      <article className="section-card rounded-[28px] p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
          Foundation
        </p>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl text-[color:var(--foreground)] sm:text-4xl">
          Built to grow with each feature you point to next.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-[color:var(--muted)]">
          The page is intentionally simple, but not disposable. The structure already
          assumes you will add more sections, authenticated screens, and wallet-aware
          behaviors over time.
        </p>
      </article>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        {highlights.map((highlight) => (
          <article key={highlight.title} className="glass-panel rounded-[28px] p-6">
            <h3 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--foreground)]">
              {highlight.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
              {highlight.copy}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}