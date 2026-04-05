"use client";

import { useEffect, useRef, useState } from "react";

type NearPriceModalProps = {
  usdtAmount: string;
  onConfirm: (nearPrice: string) => void;
  onCancel: () => void;
  isSubmitting: boolean;
};

export function NearPriceModal({
  usdtAmount,
  onConfirm,
  onCancel,
  isSubmitting,
}: NearPriceModalProps) {
  const [nearPrice, setNearPrice] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  const confirmDisabled =
    isSubmitting || !nearPrice.trim() || Number(nearPrice) <= 0 || isNaN(Number(nearPrice));

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (confirmDisabled) return;
    onConfirm(nearPrice.trim());
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(24,18,10,0.55)", backdropFilter: "blur(4px)" }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-sm rounded-[28px] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,251,247,0.99),rgba(255,246,238,0.96))] p-6 shadow-[0_32px_80px_rgba(43,25,14,0.28)]">
        {/* Mock contract warning */}
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
          You are operating against a{" "}
          <span className="font-semibold">mock contract</span>. Please insert
          the NEAR price for operating deposit.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="near-price-input"
              className="mb-1.5 block text-sm font-medium text-[color:var(--foreground)]"
            >
              NEAR price <span className="text-[color:var(--muted)]">(USD)</span>
            </label>
            <input
              ref={inputRef}
              id="near-price-input"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 4.50"
              value={nearPrice}
              onChange={(e) => setNearPrice(e.target.value)}
              className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-3 text-base text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--accent)] focus:shadow-[0_0_0_3px_rgba(221,107,32,0.12)]"
            />
            <p className="mt-1.5 text-xs text-[color:var(--muted)]">
              Depositing <span className="font-semibold">{usdtAmount} USDT</span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 rounded-2xl border border-[color:var(--line)] bg-white/80 py-2.5 text-sm font-semibold text-[color:var(--muted)] transition hover:bg-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={confirmDisabled}
              className="flex-1 rounded-2xl bg-[linear-gradient(135deg,var(--foreground),#30394a)] py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(24,29,40,0.25)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
            >
              {isSubmitting ? "Confirm in wallet…" : "Deposit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
