"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchFtBalance } from "@/app/lib/near/nep141";

type UseFtBalanceOptions = {
  contractId: string;
  accountId: string | null | undefined;
  refetchInterval?: number;
};

export function useFtBalance({
  contractId,
  accountId,
  refetchInterval = 30_000,
}: UseFtBalanceOptions) {
  return useQuery({
    queryKey: ["ft-balance", contractId, accountId],
    queryFn: () =>
      fetchFtBalance({ contractId, accountId: accountId! }).then((b) => b ?? "0"),
    enabled: Boolean(accountId),
    refetchInterval,
  });
}
