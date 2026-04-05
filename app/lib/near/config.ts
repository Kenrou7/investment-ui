import { NEAR_NETWORKS, resolveNearNetworkId } from "@/app/lib/near/networks";

const networkIdFromEnv = process.env.NEXT_PUBLIC_NEAR_NETWORK_ID;

if (!networkIdFromEnv) {
	throw new Error(
		"Missing NEXT_PUBLIC_NEAR_NETWORK_ID in environment. Set it in .env or .env.local."
	);
}

if (networkIdFromEnv !== "mainnet" && networkIdFromEnv !== "testnet") {
	throw new Error(
		`Invalid NEXT_PUBLIC_NEAR_NETWORK_ID: \"${networkIdFromEnv}\". Use \"mainnet\" or \"testnet\".`
	);
}

const networkId = resolveNearNetworkId(networkIdFromEnv);
const network = NEAR_NETWORKS[networkId];
const connection = network.connection;
const contracts = network.contracts;

export const nearConfig = {
	appName: "Kenrou Investments",
	networkId: network.networkId,
	contractId: process.env.NEXT_PUBLIC_NEAR_CONTRACT_ID,
	connection,
	contracts,
	rpcUrl: connection.rpcUrl,
	rpcUrls: connection.rpcUrls,
	helperUrl: connection.helperUrl,
	explorerUrl: connection.explorerUrl,
	walletUrl: connection.walletUrl,
	usdtContractId: contracts.usdtContractId,
};
