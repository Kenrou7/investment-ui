"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUserShares } from "@/app/lib/near/mock-kenrou-contract";

type UseUserSharesOptions = {
  contractId: string | null | undefined;
  accountId: string | null | undefined;
  refetchInterval?: number;
};

export function useUserShares({
  contractId,
  accountId,
  refetchInterval = 30_000,
}: UseUserSharesOptions) {
  return useQuery({
    queryKey: ["user-shares", contractId, accountId],
    queryFn: () =>
      fetchUserShares({ contractId: contractId!, accountId: accountId! }).then(
        (s) => s ?? "0"
      ),
    enabled: Boolean(contractId) && Boolean(accountId),
    refetchInterval,
  });
}
