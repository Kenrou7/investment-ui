"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { nearConfig } from "@/app/lib/near/config";
import { useFtBalance } from "@/app/features/near/hooks/use-nep141";
import { useUserShares } from "@/app/features/near/hooks/use-kenrou-investment";
import { fetchFtMetadata } from "@/app/lib/near/nep141";
import { buildMockDepositTx, buildWithdrawTx } from "@/app/lib/near/mock-kenrou-contract";
import { NearPriceModal } from "@/app/components/home/near-price-modal";
import { useNearWallet } from "@/app/features/wallet/context/near-wallet-provider";

type ActionMode = "insert" | "withdraw";

function normalizeTokenIcon(icon: string | null | undefined) {
  if (!icon) {
    return null;
  }

  const value = icon.trim();
  if (!value) {
    return null;
  }

  if (
    value.startsWith("data:image/") ||
    value.startsWith("https://") ||
    value.startsWith("http://")
  ) {
    return value;
  }

  return null;
}

function formatTokenAmount(rawAmount: string, decimals: number) {
  const normalized = rawAmount.trim();
  if (!normalized || !/^\d+$/.test(normalized)) {
    return "0";
  }

  const padded = normalized.padStart(decimals + 1, "0");
  const whole = padded.slice(0, -decimals) || "0";
  const fraction = decimals > 0 ? padded.slice(-decimals).slice(0, 2).replace(/0+$/, "") : "";

  return fraction ? `${whole}.${fraction}` : whole;
}

function formatBalancePreview(rawAmount: string, decimals: number) {
  const formatted = formatTokenAmount(rawAmount, decimals);
  const [whole, fraction = ""] = formatted.split(".");
  const shortenedFraction = fraction.slice(0, 4).replace(/0+$/, "");

  return shortenedFraction ? `${whole}.${shortenedFraction}` : whole;
}

function getStepFromDecimals(decimals: number) {
  if (decimals <= 0) {
    return "1";
  }

  return `0.${"0".repeat(Math.max(decimals - 1, 0))}1`;
}

function parseDecimalStringToUnits(value: string, decimals: number) {
  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  if (!/^\d*(\.\d*)?$/.test(normalized)) {
    return null;
  }

  const [wholePart = "0", fractionPart = ""] = normalized.split(".");
  const sanitizedWhole = wholePart === "" ? "0" : wholePart;
  const sanitizedFraction = fractionPart.slice(0, decimals).padEnd(decimals, "0");

  try {
    return BigInt(`${sanitizedWhole}${sanitizedFraction}`);
  } catch {
    return null;
  }
}

export function AssetActionBox() {
  const { accountId, isConnected, signAndSendTransaction } = useNearWallet();
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<ActionMode>("insert");
  const [insertAmount, setInsertAmount] = useState("");
  const [usdtIcon, setUsdtIcon] = useState<string | null>(null);
  const [iconLoadFailed, setIconLoadFailed] = useState(false);
  const [isInserting, setIsInserting] = useState(false);
  const [showNearPriceModal, setShowNearPriceModal] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const { data: metadata } = useQuery({
    queryKey: ["ft-metadata", nearConfig.usdtContractId],
    queryFn: () => fetchFtMetadata({ contractId: nearConfig.usdtContractId }),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const usdtDecimals = metadata?.decimals ?? 6;

  useEffect(() => {
    setUsdtIcon(normalizeTokenIcon(metadata?.icon));
    setIconLoadFailed(false);
  }, [metadata?.icon]);

  const { data: usdtBalance = null } = useFtBalance({
    contractId: nearConfig.usdtContractId,
    accountId,
  });

  const { data: userShares = "0" } = useUserShares({
    contractId: nearConfig.investmentContractId,
    accountId,
  });

  const maxInsertAmount = usdtBalance ? formatTokenAmount(usdtBalance, usdtDecimals) : "0";
  const formattedUserShares = formatTokenAmount(userShares, 24);
  const balanceLabel = usdtBalance
    ? formatBalancePreview(usdtBalance, usdtDecimals)
    : isConnected
      ? "0"
      : "-";
  const parsedInsertAmount = parseDecimalStringToUnits(insertAmount, usdtDecimals);
  const parsedUsdtBalance = usdtBalance ? BigInt(usdtBalance) : null;
  const exceedsBalance =
    parsedInsertAmount !== null && parsedUsdtBalance !== null
      ? parsedInsertAmount > parsedUsdtBalance
      : false;
  const insertDisabled =
    !isConnected ||
    !insertAmount.trim() ||
    exceedsBalance ||
    insertAmount === "0" ||
    insertAmount === "0." ||
    !nearConfig.investmentContractId ||
    isInserting;

  function handleInsertSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (insertDisabled) return;
    setShowNearPriceModal(true);
  }

  const parsedUserShares = userShares ? BigInt(userShares) : null;
  const exceedsShares =
    withdrawAmount.trim() !== "" && parsedUserShares !== null
      ? BigInt(parseDecimalStringToUnits(withdrawAmount, 24) ?? 0) > parsedUserShares
      : false;
  const withdrawDisabled =
    !isConnected ||
    !withdrawAmount.trim() ||
    exceedsShares ||
    withdrawAmount === "0" ||
    withdrawAmount === "0." ||
    !nearConfig.investmentContractId ||
    isWithdrawing;

  function handleWithdrawSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (withdrawDisabled) return;
    setShowWithdrawModal(true);
  }

  async function handleMockWithdraw(nearPrice: string) {
    const parsedShares = parseDecimalStringToUnits(withdrawAmount, 24);
    if (!parsedShares || !nearConfig.investmentContractId) return;

    setIsWithdrawing(true);
    try {
      const tx = buildWithdrawTx({
        shares: parsedShares.toString(),
        near_price: nearPrice,
      });
      await signAndSendTransaction(tx);
      setWithdrawAmount("");
      setShowWithdrawModal(false);
      await queryClient.invalidateQueries({
        queryKey: ["ft-balance", nearConfig.usdtContractId, accountId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["user-shares", nearConfig.investmentContractId, accountId],
      });
      toast.success("Withdrawal submitted successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Transaction failed.");
    } finally {
      setIsWithdrawing(false);
    }
  }

  async function handleMockDeposit(nearPrice: string) {
    if (!parsedInsertAmount || !nearConfig.investmentContractId) return;

    setIsInserting(true);
    try {
      const tx = buildMockDepositTx({
        usdt_deposit: parsedInsertAmount.toString(),
        near_price: nearPrice,
      });
      await signAndSendTransaction(tx);
      setInsertAmount("");
      setShowNearPriceModal(false);
      await queryClient.invalidateQueries({
        queryKey: ["ft-balance", nearConfig.usdtContractId, accountId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["user-shares", nearConfig.investmentContractId, accountId],
      });
      toast.success("Deposit submitted successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Transaction failed.");
    } finally {
      setIsInserting(false);
    }
  }

  return (
    <>
      {showNearPriceModal && (
        <NearPriceModal
          usdtAmount={insertAmount}
          onConfirm={handleMockDeposit}
          onCancel={() => setShowNearPriceModal(false)}
          isSubmitting={isInserting}
        />
      )}
      {showWithdrawModal && (
        <NearPriceModal
          usdtAmount={withdrawAmount}
          onConfirm={handleMockWithdraw}
          onCancel={() => setShowWithdrawModal(false)}
          isSubmitting={isWithdrawing}
        />
      )}
      <section className="relative w-full max-w-lg overflow-hidden rounded-[34px] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,251,247,0.96),rgba(255,246,238,0.78))] p-5 shadow-[0_32px_90px_rgba(43,25,14,0.2)] sm:p-7">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-12 rounded-b-[999px] bg-[radial-gradient(circle,_rgba(255,255,255,0.88)_0%,rgba(255,255,255,0)_74%)]" />
      <div className="mb-6 grid grid-cols-2 rounded-2xl border border-[color:var(--line)] bg-white/70 p-1.5">
        <button
          type="button"
          onClick={() => setMode("insert")}
          className={[
            "rounded-xl px-4 py-2.5 text-sm font-semibold transition",
            mode === "insert"
              ? "bg-[linear-gradient(135deg,var(--accent),#e58b38)] text-white shadow-[0_8px_20px_rgba(221,107,32,0.35)]"
              : "text-[color:var(--muted)] hover:bg-white",
          ].join(" ")}
        >
          Deposit USDT
        </button>
        <button
          type="button"
          onClick={() => setMode("withdraw")}
          className={[
            "rounded-xl px-4 py-2.5 text-sm font-semibold transition",
            mode === "withdraw"
              ? "bg-[linear-gradient(135deg,var(--accent),#e58b38)] text-white shadow-[0_8px_20px_rgba(221,107,32,0.35)]"
              : "text-[color:var(--muted)] hover:bg-white",
          ].join(" ")}
        >
          Withdraw Shares
        </button>
      </div>

      {mode === "insert" ? (
        <form className="space-y-4" onSubmit={handleInsertSubmit}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <label className="block text-[color:var(--muted)]" htmlFor="usdt-amount">
              USDT amount
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[color:var(--muted)]">{balanceLabel}</span>
              <button
                type="button"
                onClick={() => setInsertAmount(maxInsertAmount)}
                disabled={!usdtBalance || usdtBalance === "0"}
                className="rounded-full border border-[color:var(--line)] bg-white/80 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--accent-strong)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
              >
                Max
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              id="usdt-amount"
              type="number"
              min="0"
              step={getStepFromDecimals(usdtDecimals)}
              placeholder="0.00"
              value={insertAmount}
              onChange={(event) => setInsertAmount(event.target.value)}
              className={[
                "w-full rounded-2xl bg-white px-4 py-3.5 pr-14 text-base text-[color:var(--foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] outline-none ring-0 transition",
                exceedsBalance
                  ? "border border-rose-300 focus:border-rose-400 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.12)]"
                  : "border border-[color:var(--line)] focus:border-[color:var(--accent)] focus:shadow-[0_0_0_3px_rgba(221,107,32,0.12)]",
              ].join(" ")}
            />
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              {usdtIcon && !iconLoadFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={usdtIcon}
                  alt="USDT"
                  className="h-7 w-7 rounded-full border border-[color:var(--line)] bg-white object-contain"
                  onError={() => setIconLoadFailed(true)}
                />
              ) : (
                <span className="text-xs font-semibold text-[color:var(--muted)]">USDT</span>
              )}
            </div>
          </div>
          {exceedsBalance ? (
            <p className="text-sm font-medium text-rose-600">Amount exceeds available USDT balance.</p>
          ) : null}
          <button
            type="submit"
            disabled={insertDisabled}
            className="w-full rounded-2xl bg-[linear-gradient(135deg,var(--foreground),#30394a)] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(24,29,40,0.28)] transition hover:-translate-y-0.5 hover:bg-[linear-gradient(135deg,var(--accent-strong),#c06a2c)] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
          >
            {isInserting ? "Confirm in wallet…" : "Deposit"}
          </button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleWithdrawSubmit}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <label className="block text-[color:var(--muted)]" htmlFor="share-amount">
              Share amount
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[color:var(--muted)]">
                Available: {isConnected ? formattedUserShares : "-"}
              </span>
              <button
                type="button"
                onClick={() => setWithdrawAmount(formattedUserShares)}
                disabled={!isConnected || !userShares || userShares === "0"}
                className="rounded-full border border-[color:var(--line)] bg-white/80 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--accent-strong)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
              >
                Max
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              id="share-amount"
              type="number"
              min="0"
              step="0.0001"
              placeholder="0.0000"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-3.5 text-base text-[color:var(--foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] outline-none ring-0 transition focus:border-[color:var(--accent)] focus:shadow-[0_0_0_3px_rgba(221,107,32,0.12)]"
            />
          </div>
          {exceedsShares ? (
            <p className="text-sm font-medium text-rose-600">Amount exceeds available shares.</p>
          ) : null}
          <button
            type="submit"
            disabled={withdrawDisabled}
            className="w-full rounded-2xl bg-[linear-gradient(135deg,var(--foreground),#30394a)] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(24,29,40,0.28)] transition hover:-translate-y-0.5 hover:bg-[linear-gradient(135deg,var(--accent-strong),#c06a2c)] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
          >
            {isWithdrawing ? "Confirm in wallet…" : "Withdraw"}
          </button>
        </form>
      )}
    </section>
    </>
  );
}