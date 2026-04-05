import { SiteHeader } from "@/app/components/layout/site-header";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-20 ambient-grid" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_18%_16%,_rgba(233,113,50,0.34),_transparent_34%),radial-gradient(circle_at_82%_14%,_rgba(255,214,153,0.28),_transparent_33%),radial-gradient(circle_at_45%_74%,_rgba(217,96,34,0.12),_transparent_38%)]" />
      <div className="float-slow pointer-events-none absolute -left-24 top-28 -z-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(221,107,32,0.25)_0%,_rgba(221,107,32,0.03)_62%,_transparent_76%)] blur-xl" />
      <div className="float-slow pointer-events-none absolute -right-16 bottom-16 -z-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(241,186,117,0.22)_0%,_rgba(241,186,117,0.03)_62%,_transparent_78%)] blur-xl [animation-delay:1.2s]" />

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-6 sm:px-8 lg:px-10">
        <SiteHeader />
        {children}
      </div>
    </main>
  );
}