// ============================================================
// lib/ritualConfig.ts
// Ritual testnet configuration for MetaMask connection
// ============================================================

export const RITUAL_CHAIN_CONFIG = {
  chainId: "0x1", // Will update with actual Ritual chain ID
  chainName: "Ritual Testnet",
  nativeCurrency: {
    name: "Ritual Token",
    symbol: "RTL",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.ritualfoundation.org"],
  blockExplorerUrls: ["https://explorer.ritualfoundation.org"], // Update if available
  iconUrl: "/ritual-logo.svg",
};

// Alternative RPC endpoints (fallback)
export const RPC_URL = "https://rpc.ritualfoundation.org";
export const RITUAL_CHAIN_ID = "0x1"; // Update with actual chain ID from docs
export const FAUCET_URL = "https://faucet.ritualfoundation.org"; // Add your real Ritual testnet faucet here
export const FAUCET_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000"; // Update with actual faucet token address
export const FAUCET_TOKEN_SYMBOL = "FAU";

// Contract addresses (if needed later)
export const CONTRACTS = {
  // Add contract addresses here as needed
};
