"use client";

import { useEffect, useRef, useState } from "react";
import { useNearWallet } from "@/app/features/wallet/context/near-wallet-provider";

type ConnectWalletButtonProps = {
  className?: string;
  size?: "compact" | "hero";
};

export function ConnectWalletButton({
  className = "",
  size = "compact",
}: ConnectWalletButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { accountId, connect, disconnect, error, isConnected, isConnecting, isReady } =
    useNearWallet();
  const isDropdownOpen = isOpen && isConnected && Boolean(accountId);

  const sizeClasses =
    size === "hero"
      ? "min-h-14 px-6 text-sm sm:text-base"
      : "min-h-11 px-4 text-sm";

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopied(false);
    }, 1200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [copied]);

  async function handleCopyAccountId() {
    if (!accountId) {
      return;
    }

    try {
      await navigator.clipboard.writeText(accountId);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`.trim()}>
      {isConnected && accountId ? (
        <div ref={dropdownRef} className="relative w-full min-w-[18rem] sm:min-w-[22rem]">
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className={[
              "grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-full border border-transparent",
              "bg-[var(--foreground)] text-white shadow-[0_12px_30px_rgba(31,36,48,0.18)]",
              "transition duration-200 hover:-translate-y-0.5 hover:bg-[color:var(--accent-strong)]",
              sizeClasses,
            ].join(" ")}
            aria-expanded={isDropdownOpen}
            aria-haspopup="menu"
          >
            <span aria-hidden="true" />
            <span className="flex items-center justify-center gap-2 text-center">
              <span>{accountId}</span>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  void handleCopyAccountId();
                }}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/12 text-[0.72rem] transition hover:bg-white/20"
                aria-label="Copy account ID"
                title={copied ? "Copied" : "Copy account ID"}
              >
                {copied ? "✓" : "⧉"}
              </button>
            </span>
            <span
              aria-hidden="true"
              className={[
                "justify-self-end text-[0.7em] transition-transform duration-200",
                isDropdownOpen ? "rotate-180" : "rotate-0",
              ].join(" ")}
            >
              ▼
            </span>
          </button>

          {isDropdownOpen ? (
            <div className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-full overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[rgba(255,250,245,0.98)] p-1.5 shadow-[0_18px_44px_rgba(35,22,13,0.18)] backdrop-blur-xl">
              <button
                type="button"
                onClick={async () => {
                  setIsOpen(false);
                  await disconnect();
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
                role="menuitem"
              >
                <span>Disconnect</span>
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          onClick={connect}
          disabled={!isReady || isConnecting}
          className={[
            "inline-flex items-center justify-center rounded-full border border-transparent",
            "bg-[var(--foreground)] text-white shadow-[0_12px_30px_rgba(31,36,48,0.18)]",
            "transition duration-200 hover:-translate-y-0.5 hover:bg-[color:var(--accent-strong)]",
            "disabled:cursor-not-allowed disabled:opacity-60",
            sizeClasses,
          ].join(" ")}
        >
          {!isReady ? "Preparing wallet" : isConnecting ? "Opening wallet" : "Connect wallet"}
        </button>
      )}
      {error ? <p className="text-sm text-[#9b3d10]">{error}</p> : null}
    </div>
  );
}