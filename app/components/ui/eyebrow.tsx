export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full border border-[color:var(--line)] bg-white/70 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
      {children}
    </span>
  );
}