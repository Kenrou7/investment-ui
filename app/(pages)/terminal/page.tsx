import { AssetActionBox } from "@/app/components/home/asset-action-box";
import { ShareValueChart } from "@/app/components/home/share-value-chart";
import { PageShell } from "@/app/components/layout/page-shell";

export default function TerminalPage() {
  return (
    <PageShell>
      <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1fr_28rem]">
        <ShareValueChart />
        <AssetActionBox />
      </section>
    </PageShell>
  );
}