import { nearConfig } from "@/app/lib/near/config";
import { callNearContractMethod } from "@/app/lib/near/call-contract-method";
import type { NajFunctionCallAction } from "@/app/lib/near/nep141";

// Gas for a simple state-mutating call — 10 TGas is sufficient
const DEPOSIT_GAS = "10000000000000";
const NEAR_PRICE_DECIMALS = 24;

/**
 * Converts a human-readable decimal string (e.g. "4.50") to a fixed-point integer
 * string with the given number of decimal places (e.g. "4500000000000000000000000").
 */
function toFixedPoint(value: string, decimals: number): string {
  const [whole = "0", fraction = ""] = value.trim().split(".");
  const paddedFraction = fraction.slice(0, decimals).padEnd(decimals, "0");
  const multiplier = BigInt(10) ** BigInt(decimals);
  const raw = BigInt(whole) * multiplier + BigInt(paddedFraction || "0");
  return raw.toString();
}

export type DepositParams = {
  usdt_deposit: string;
  near_price: string;
};

export type WithdrawParams = {
  shares: string;
  near_price: string;
};

/**
 * Builds the transaction for calling `deposit` on the mock Kenrou investment contract.
 * This is a temporary mock contract and does NOT involve real token transfers.
 */
export function buildMockDepositTx({
  usdt_deposit,
  near_price,
}: DepositParams): { receiverId: string; actions: NajFunctionCallAction[] } {
  if (!nearConfig.investmentContractId) {
    throw new Error("Investment contract is not configured for this network.");
  }

  return {
    receiverId: nearConfig.investmentContractId,
    actions: [
      {
        functionCall: {
          methodName: "deposit",
          args: JSON.stringify({
            usdt_deposit,
            near_price: toFixedPoint(near_price, NEAR_PRICE_DECIMALS),
          }),
          gas: BigInt(DEPOSIT_GAS),
          deposit: BigInt(0),
        },
      },
    ],
  };
}

export function buildWithdrawTx({
  shares,
  near_price,
}: WithdrawParams): { receiverId: string; actions: NajFunctionCallAction[] } {
  if (!nearConfig.investmentContractId) {
    throw new Error("Investment contract is not configured for this network.");
  }

  return {
    receiverId: nearConfig.investmentContractId,
    actions: [
      {
        functionCall: {
          methodName: "withdraw",
          args: JSON.stringify({
            shares,
            near_price: toFixedPoint(near_price, NEAR_PRICE_DECIMALS),
          }),
          gas: BigInt(DEPOSIT_GAS),
          deposit: BigInt(0),
        },
      },
    ],
  };
}

export async function fetchUserShares({
  contractId,
  accountId,
}: {
  contractId: string;
  accountId: string;
}): Promise<string | null> {
  return callNearContractMethod<string>({
    contractId,
    methodName: "get_user_shares",
    args: { account_id: accountId },
  });
}
