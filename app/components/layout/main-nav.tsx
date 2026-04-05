"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/terminal", label: "Terminal" },
  { href: "/docs", label: "Docs" },
  { href: "/status", label: "Status" },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 rounded-2xl border border-[color:var(--line)] bg-white/65 p-1">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "rounded-xl px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm",
              isActive
                ? "bg-[linear-gradient(135deg,var(--accent),#e58b38)] text-white shadow-[0_8px_20px_rgba(221,107,32,0.35)]"
                : "text-[color:var(--muted)] hover:bg-white",
            ].join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}