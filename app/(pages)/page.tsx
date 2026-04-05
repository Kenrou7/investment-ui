import Link from "next/link";
import { PageShell } from "@/app/components/layout/page-shell";

const STATS = [
  { label: "Total Value Locked", value: "$0" },
  { label: "Active Investors", value: "0" },
  { label: "Avg. Annual Yield", value: "—" },
];

const FEATURES = [
  {
    title: "Deposit USDT",
    description:
      "Fund your position by depositing USDT directly from your NEAR wallet. Funds are deployed into the strategy immediately.",
  },
  {
    title: "Earn Yield",
    description:
      "Your deposit is put to work across curated on-chain strategies. Returns accrue continuously and are reflected in your share value.",
  },
  {
    title: "Withdraw Anytime",
    description:
      "Redeem your shares for USDT at the current net asset value whenever you choose. No lock-up, no hidden fees.",
  },
];

export default function Home() {
  return (
    <PageShell>
      <section className="flex flex-1 flex-col items-center gap-16 py-14">
        {/* Hero */}
        <div className="w-full max-w-3xl rounded-[34px] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,251,247,0.96),rgba(255,246,238,0.78))] p-8 shadow-[0_32px_90px_rgba(43,25,14,0.2)] sm:p-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[color:var(--accent)]">
            On-chain yield on NEAR
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl leading-[1.15] text-[color:var(--foreground)] sm:text-5xl">
            Invest smarter.<br />
            Earn on-chain.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
            Kenrou is a non-custodial yield protocol on NEAR. Deposit USDT, receive
            shares that grow in value as the strategy generates returns — no manual
            compounding required.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/terminal"
              className="rounded-2xl bg-[linear-gradient(135deg,var(--foreground),#30394a)] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(24,29,40,0.28)] transition hover:-translate-y-0.5"
            >
              Start Investing
            </Link>
            <Link
              href="/docs"
              className="rounded-2xl border border-[color:var(--line)] bg-white/75 px-6 py-3 text-sm font-semibold text-[color:var(--muted)] transition hover:bg-white"
            >
              Read the Docs
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid w-full max-w-3xl grid-cols-3 gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[24px] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,251,247,0.96),rgba(255,246,238,0.78))] p-5 text-center shadow-[0_8px_24px_rgba(43,25,14,0.1)]"
            >
              <p className="text-2xl font-bold text-[color:var(--foreground)]">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-[color:var(--muted)]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="w-full max-w-3xl">
          <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-[color:var(--foreground)] sm:text-3xl">
            How it works
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {FEATURES.map((feat, i) => (
              <div
                key={feat.title}
                className="rounded-[24px] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,251,247,0.96),rgba(255,246,238,0.78))] p-6 shadow-[0_8px_24px_rgba(43,25,14,0.1)]"
              >
                <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--accent)] text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mb-2 text-sm font-semibold text-[color:var(--foreground)]">
                  {feat.title}
                </h3>
                <p className="text-sm leading-6 text-[color:var(--muted)]">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
