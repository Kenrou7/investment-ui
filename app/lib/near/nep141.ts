import { callNearContractMethod } from "@/app/lib/near/call-contract-method";

// NEP-141: Fungible Token Standard
// https://nomicon.io/Standards/Tokens/FungibleToken/Core

// 50 TGas — enough headroom for ft_transfer_call cross-contract execution
const FT_TRANSFER_CALL_GAS = "50000000000000";
// NEP-141 requires exactly 1 yoctoNEAR attached to ft_transfer_call
const ONE_YOCTO = "1";

// Minimal NAJ-compatible FunctionCall action shape expected by wallet-selector at runtime.
// wallet-selector's signAndSendTransaction runs najActionToInternal() on each action,
// which checks for action.functionCall — not action.type.
export type NajFunctionCallAction = {
  functionCall: {
    methodName: string;
    args: string;
    gas: bigint;
    deposit: bigint;
  };
};

/**
 * Returns the receiverId + NAJ-format actions needed to call ft_transfer_call on a
 * NEP-141 contract, forwarding tokens to a receiver contract with an arbitrary message.
 */
export function buildFtTransferCallTx({
  tokenContractId,
  receiverId,
  amount,
  msg,
  memo,
}: {
  tokenContractId: string;
  receiverId: string;
  amount: string;
  msg: string;
  /** Include memo field in args (required by some testnet contracts). */
  memo?: string;
}): { receiverId: string; actions: NajFunctionCallAction[] } {
  const args: Record<string, string> = { receiver_id: receiverId, amount, msg };
  if (memo !== undefined) {
    args.memo = memo;
  }

  return {
    receiverId: tokenContractId,
    actions: [
      {
        functionCall: {
          methodName: "ft_transfer_call",
          args: JSON.stringify(args),
          gas: BigInt(FT_TRANSFER_CALL_GAS),
          deposit: BigInt(ONE_YOCTO),
        },
      },
    ],
  };
}

export type FungibleTokenMetadata = {
  spec: string;
  name: string;
  symbol: string;
  icon?: string;
  reference?: string;
  reference_hash?: string;
  decimals: number;
};

export async function fetchFtMetadata({
  contractId,
}: {
  contractId: string;
}): Promise<FungibleTokenMetadata | null> {
  return callNearContractMethod<FungibleTokenMetadata>({
    contractId,
    methodName: "ft_metadata",
    args: {},
  });
}

export async function fetchFtBalance({
  contractId,
  accountId,
}: {
  contractId: string;
  accountId: string;
}): Promise<string | null> {
  return callNearContractMethod<string>({
    contractId,
    methodName: "ft_balance_of",
    args: { account_id: accountId },
  });
}
