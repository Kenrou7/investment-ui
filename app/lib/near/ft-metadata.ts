import { callNearContractMethod } from "@/app/lib/near/call-contract-method";

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