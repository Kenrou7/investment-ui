export type NearNetworkId = "mainnet" | "testnet";

export type NearNetworkConnectionConfig = {
  rpcUrl: string;
  rpcUrls: string[];
  helperUrl: string;
  explorerUrl: string;
  walletUrl: string;
};

export type NearNetworkContractsConfig = {
  usdtContractId: string;
  investmentContractId: string | null;
};

export type NearNetworkConfig = {
  networkId: NearNetworkId;
  connection: NearNetworkConnectionConfig;
  contracts: NearNetworkContractsConfig;
};

export const NEAR_NETWORKS: Record<NearNetworkId, NearNetworkConfig> = {
  mainnet: {
    networkId: "mainnet",
    connection: {
      rpcUrl: "https://rpc.mainnet.near.org",
      rpcUrls: [
        "https://rpc.mainnet.near.org",
        "https://free.rpc.fastnear.com",
        "https://near.lava.build",
      ],
      helperUrl: "https://helper.mainnet.near.org",
      explorerUrl: "https://nearblocks.io",
      walletUrl: "https://app.mynearwallet.com/",
    },
    contracts: {
      usdtContractId: "usdt.tether-token.near",
      investmentContractId: null,
    },
  },
  testnet: {
    networkId: "testnet",
    connection: {
      rpcUrl: "https://rpc.testnet.near.org",
      rpcUrls: [
        "https://rpc.testnet.near.org",
        "https://test.rpc.fastnear.com",
        "https://near-testnet.lava.build",
      ],
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://testnet.nearblocks.io",
      walletUrl: "https://testnet.mynearwallet.com/",
    },
    contracts: {
      usdtContractId: "kenrou-usdt.testnet",
      investmentContractId: "kenrou-investment.testnet",
    },
  },
};

export function resolveNearNetworkId(value?: string): NearNetworkId {
  return value === "mainnet" ? "mainnet" : "testnet";
}