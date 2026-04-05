import type { WalletSelector } from "@near-wallet-selector/core";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { nearConfig } from "@/app/lib/near/config";

export async function initializeWalletSelector(): Promise<WalletSelector> {
  return setupWalletSelector({
    network: nearConfig.networkId,
    optimizeWalletOrder: true,
    modules: [
      setupMeteorWallet(),
      setupMyNearWallet({
        walletUrl: nearConfig.walletUrl,
      }),
    ],
  });
}

export function showWalletModal(selector: WalletSelector) {
  return setupModal(selector, {
    contractId: nearConfig.contractId,
    theme: "light",
    description: "Connect your NEAR wallet to enter the investment workspace.",
  });
}