import { ConnectWalletButton } from "@/app/features/wallet/components/connect-wallet-button";
import { MainNav } from "@/app/components/layout/main-nav";

export function SiteHeader() {
  return (
    <header className="glass-panel rounded-[28px] px-4 py-3 sm:px-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,_var(--accent),_#f2b15d)] text-sm font-bold text-white shadow-[0_12px_30px_rgba(221,107,32,0.25)]">
              KI
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-xl text-[color:var(--foreground)]">
                Kenrou Investments
              </p>
            </div>
          </div>

          <ConnectWalletButton className="sm:hidden" />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="overflow-x-auto">
            <MainNav />
          </div>
          <ConnectWalletButton className="hidden sm:flex" />
        </div>
      </div>
    </header>
  );
}