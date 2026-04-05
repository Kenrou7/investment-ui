import Link from "next/link";
import { PageShell } from "@/app/components/layout/page-shell";

export default function DocsPage() {
  return (
    <PageShell>
      <section className="flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-3xl rounded-[34px] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,251,247,0.96),rgba(255,246,238,0.78))] p-6 shadow-[0_32px_90px_rgba(43,25,14,0.2)] sm:p-8">
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-[color:var(--foreground)] sm:text-5xl">
            Documentation
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
            Extended documentation will be linked externally. This internal page is a temporary docs entrypoint.
          </p>
          <div className="mt-8">
            <Link
              href="/terminal"
              className="rounded-2xl border border-[color:var(--line)] bg-white/75 px-5 py-3 text-sm font-semibold text-[color:var(--muted)] transition hover:bg-white"
            >
              Back to Terminal
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}