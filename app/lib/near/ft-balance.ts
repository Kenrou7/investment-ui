import { callNearContractMethod } from "@/app/lib/near/call-contract-method";

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
    args: {
      account_id: accountId,
    },
  });
}