import { PageShell } from "@/app/components/layout/page-shell";

const ITEMS = [
  "Wallet connection ready",
  "USDT metadata resolution active",
  "RPC failover across providers",
  "Terminal chart and actions live",
];

export default function StatusPage() {
  return (
    <PageShell>
      <section className="flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-3xl rounded-[34px] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,251,247,0.96),rgba(255,246,238,0.78))] p-6 shadow-[0_32px_90px_rgba(43,25,14,0.2)] sm:p-8">
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-[color:var(--foreground)] sm:text-5xl">
            Status
          </h1>
          <div className="mt-6 grid gap-3">
            {ITEMS.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-[color:var(--line)] bg-white/75 px-4 py-3 text-sm font-medium text-[color:var(--foreground)]"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}