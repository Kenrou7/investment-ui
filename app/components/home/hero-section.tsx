import { Eyebrow } from "@/app/components/ui/eyebrow";
import { ConnectWalletButton } from "@/app/features/wallet/components/connect-wallet-button";
import { nearConfig } from "@/app/lib/near/config";

const metrics = [
  {
    label: "Wallet access",
    value: "NEAR",
    detail: "Client-side wallet flow with a clean upgrade path for more modules.",
  },
  {
    label: "Network",
    value: nearConfig.networkId,
    detail: "Environment-driven setup so mainnet and testnet stay configurable.",
  },
  {
    label: "Architecture",
    value: "Scalable",
    detail: "Feature folders separate wallet logic from presentation concerns.",
  },
];

export function HeroSection() {
  return (
    <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
      <div className="space-y-8">
        <Eyebrow>Professional investment interface</Eyebrow>
        <div className="max-w-3xl space-y-5">
          <h1 className="font-[family-name:var(--font-display)] text-5xl leading-[1.02] tracking-tight text-[color:var(--foreground)] sm:text-6xl lg:text-7xl">
            A disciplined front end for NEAR-based capital decisions.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[color:var(--muted)] sm:text-xl">
            This first iteration is intentionally focused: a credible landing experience,
            a wallet-first entry point, and a codebase organized for the next layers you
            want to add.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <ConnectWalletButton size="hero" />
          <div className="rounded-full border border-[color:var(--line)] bg-white/60 px-5 py-3 text-sm text-[color:var(--muted)]">
            Current target environment:{" "}
            <span className="font-semibold text-[color:var(--foreground)]">{nearConfig.networkId}</span>
          </div>
        </div>

        <div className="grid metric-grid gap-4">
          {metrics.map((metric) => (
            <article key={metric.label} className="section-card rounded-[24px] p-5">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[color:var(--muted)]">
                {metric.label}
              </p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[color:var(--foreground)]">
                {metric.value}
              </p>
              <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                {metric.detail}
              </p>
            </article>
          ))}
        </div>
      </div>

      <aside className="glass-panel rounded-[32px] p-6 sm:p-8">
        <div className="rounded-[28px] border border-[color:var(--line)] bg-[linear-gradient(180deg,_rgba(255,245,234,0.95),_rgba(255,250,245,0.72))] p-6">
          <div className="flex items-center justify-between text-sm text-[color:var(--muted)]">
            <span>Access readiness</span>
            <span className="rounded-full bg-[color:var(--accent-soft)] px-3 py-1 font-medium text-[color:var(--accent-strong)]">
              Live foundation
            </span>
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--muted)]">
                First release focus
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[color:var(--foreground)]">
                Secure entry before portfolio surfaces.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Wallet connect flow isolated to a dedicated feature module",
                "Server-rendered page shell with client interactivity where needed",
                "Orange-led visual system tuned for a professional financial tone",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-[color:var(--line)] bg-white/70 px-4 py-3"
                >
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[color:var(--accent)]" />
                  <p className="text-sm leading-6 text-[color:var(--foreground)]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}