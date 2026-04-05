"use client";

import type { WalletSelector } from "@near-wallet-selector/core";
import { createContext, startTransition, useContext, useEffect, useState } from "react";
import { initializeWalletSelector, showWalletModal } from "@/app/features/wallet/lib/wallet-selector";

type NearWalletContextValue = {
  accountId: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  error: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  isReady: boolean;
};

const NearWalletContext = createContext<NearWalletContextValue | undefined>(undefined);

function getActiveAccountId(selector: WalletSelector) {
  return (
    selector.store.getState().accounts.find((account) => account.active)?.accountId ??
    selector.store.getState().accounts[0]?.accountId ??
    null
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to complete the wallet action.";
}

export function NearWalletProvider({ children }: { children: React.ReactNode }) {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function bootstrapWallet() {
      try {
        const walletSelector = await initializeWalletSelector();

        if (cancelled) {
          return;
        }

        walletSelector.subscribeOnAccountChange((nextAccountId) => {
          if (cancelled) {
            return;
          }

          startTransition(() => {
            setAccountId(nextAccountId || null);
            setIsConnecting(false);
          });
        });

        startTransition(() => {
          setSelector(walletSelector);
          setAccountId(getActiveAccountId(walletSelector));
          setIsReady(true);
        });
      } catch (bootstrapError) {
        if (cancelled) {
          return;
        }

        startTransition(() => {
          setError(getErrorMessage(bootstrapError));
          setIsReady(true);
        });
      }
    }

    bootstrapWallet();

    return () => {
      cancelled = true;
    };
  }, []);

  async function connect() {
    if (!selector) {
      return;
    }

    setError(null);
    setIsConnecting(true);

    try {
      const modal = showWalletModal(selector);
      const subscription = modal.on("onHide", () => {
        startTransition(() => {
          setIsConnecting(false);
          setAccountId(getActiveAccountId(selector));
        });
        subscription.remove();
      });

      modal.show();
    } catch (connectError) {
      startTransition(() => {
        setIsConnecting(false);
        setError(getErrorMessage(connectError));
      });
    }
  }

  async function disconnect() {
    if (!selector) {
      return;
    }

    setError(null);

    try {
      const wallet = await selector.wallet();
      await wallet.signOut();

      startTransition(() => {
        setAccountId(null);
      });
    } catch (disconnectError) {
      startTransition(() => {
        setError(getErrorMessage(disconnectError));
      });
    }
  }

  return (
    <NearWalletContext.Provider
      value={{
        accountId,
        connect,
        disconnect,
        error,
        isConnected: Boolean(accountId),
        isConnecting,
        isReady,
      }}
    >
      <div className="wallet-selector-theme min-h-screen">{children}</div>
    </NearWalletContext.Provider>
  );
}

export function useNearWallet() {
  const context = useContext(NearWalletContext);

  if (!context) {
    throw new Error("useNearWallet must be used within NearWalletProvider.");
  }

  return context;
}