import { nearConfig } from "@/app/lib/near/config";

type RpcCallFunctionResult = {
  result?: {
    result?: number[];
  };
  error?: unknown;
};

type CallNearContractMethodParams = {
  contractId: string;
  methodName: string;
  args?: unknown;
};

function decodeResultBytes(bytes: number[]) {
  return new TextDecoder().decode(Uint8Array.from(bytes));
}

function getRpcCandidates(rpcUrl: string, rpcUrls?: string[]) {
  const candidates = [rpcUrl, ...(rpcUrls ?? [])].filter(Boolean);
  return Array.from(new Set(candidates));
}

function toBase64Args(args: unknown) {
  const normalized = args === undefined ? {} : args;
  return Buffer.from(JSON.stringify(normalized)).toString("base64");
}

export async function callNearContractMethod<T>({
  contractId,
  methodName,
  args,
}: CallNearContractMethodParams): Promise<T | null> {
  const candidates = getRpcCandidates(nearConfig.rpcUrl, nearConfig.rpcUrls);
  const argsBase64 = toBase64Args(args);
  const requestId = methodName;

  for (const candidateRpcUrl of candidates) {
    try {
      const response = await fetch(candidateRpcUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: requestId,
          method: "query",
          params: {
            request_type: "call_function",
            finality: "final",
            account_id: contractId,
            method_name: methodName,
            args_base64: argsBase64,
          },
        }),
      });

      if (response.status >= 400) {
        continue;
      }

      if (!response.ok) {
        continue;
      }

      const payload: RpcCallFunctionResult = await response.json();
      if (payload.error) {
        continue;
      }

      const bytes = payload.result?.result;
      if (!bytes || bytes.length === 0) {
        continue;
      }

      const decoded = decodeResultBytes(bytes);
      return JSON.parse(decoded) as T;
    } catch {
      continue;
    }
  }

  return null;
}