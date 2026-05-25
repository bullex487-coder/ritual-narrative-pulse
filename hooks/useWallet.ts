// ============================================================
// hooks/useWallet.ts
// Hook untuk manage MetaMask wallet connection & state
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { RITUAL_CHAIN_CONFIG, RPC_URL, RITUAL_CHAIN_ID, FAUCET_TOKEN_ADDRESS, FAUCET_TOKEN_SYMBOL } from "@/lib/ritualConfig";

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  balance: string | null;
  tokenBalance: string | null;
  tokenSymbol: string | null;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    error: null,
    balance: null,
    tokenBalance: null,
    tokenSymbol: null,
  });

  // =========================================================
  // Check if wallet connected on mount
  // =========================================================

  useEffect(() => {
    checkWalletConnection();
  }, []);

  // =========================================================
  // Check existing connection
  // =========================================================

  async function checkWalletConnection() {
    try {
      const ethereum = (window as any).ethereum;

      if (!ethereum) {
        setWallet((prev) => ({ ...prev, error: "MetaMask not installed" }));
        return;
      }

      // Get connected accounts
      const accounts = await ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        setWallet({
          address: accounts[0],
          isConnected: true,
          isConnecting: false,
          error: null,
          balance: null,
          tokenBalance: null,
          tokenSymbol: null,
        });

        // Fetch balance
        fetchBalance(accounts[0]);
        fetchTokenBalance(accounts[0]);
      }
    } catch (err) {
      console.error("Wallet check error:", err);
    }
  }

  // =========================================================
  // Connect wallet
  // =========================================================

  async function connectWallet() {
    setWallet((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const ethereum = (window as any).ethereum;

      if (!ethereum) {
        throw new Error("MetaMask not found. Please install MetaMask extension.");
      }

      // Request accounts
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        throw new Error("Failed to connect wallet");
      }

      // Try to add Ritual network
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [RITUAL_CHAIN_CONFIG],
        });
      } catch (err: any) {
        // Might already be added, continue anyway
        console.log("Chain add info:", err.message);
      }

      // Switch to Ritual network
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: RITUAL_CHAIN_ID }],
        });
      } catch (err: any) {
        console.log("Chain switch info:", err.message);
      }

      setWallet({
        address: accounts[0],
        isConnected: true,
        isConnecting: false,
        error: null,
        balance: null,
        tokenBalance: null,
        tokenSymbol: null,
      });

      // Fetch balance
      fetchBalance(accounts[0]);
      fetchTokenBalance(accounts[0]);

      // Listen to account changes
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", () => window.location.reload());
    } catch (err: any) {
      console.error("Connect error:", err);
      setWallet((prev) => ({
        ...prev,
        isConnecting: false,
        error: err.message || "Failed to connect wallet",
      }));
    }
  }

  // =========================================================
  // Disconnect wallet
  // =========================================================

  async function disconnectWallet() {
    const ethereum = (window as any).ethereum;

    if (ethereum) {
      ethereum.removeAllListeners("accountsChanged");
      ethereum.removeAllListeners("chainChanged");
    }

    setWallet({
      address: null,
      isConnected: false,
      isConnecting: false,
      error: null,
      balance: null,
      tokenBalance: null,
      tokenSymbol: null,
    });
  }

  // =========================================================
  // Fetch wallet balance
  // =========================================================

  async function fetchBalance(address: string) {
    try {
      const provider = new BrowserProvider((window as any).ethereum);
      const balance = await provider.getBalance(address);

      // Convert to readable format
      const balanceInEther = (balance / BigInt(10 ** 18)).toString();

      setWallet((prev) => ({
        ...prev,
        balance: parseFloat(balanceInEther).toFixed(4),
      }));
    } catch (err) {
      console.error("Balance fetch error:", err);
    }
  }

  async function fetchTokenBalance(address: string) {
    if (
      !FAUCET_TOKEN_ADDRESS ||
      FAUCET_TOKEN_ADDRESS === "0x0000000000000000000000000000000000000000"
    ) {
      return;
    }

    try {
      const provider = new BrowserProvider((window as any).ethereum);
      const tokenAbi = [
        "function balanceOf(address owner) view returns (uint256)",
        "function decimals() view returns (uint8)",
        "function symbol() view returns (string)",
      ];
      const contract = new Contract(FAUCET_TOKEN_ADDRESS, tokenAbi, provider);
      const [rawBalance, decimals, symbol] = await Promise.all([
        contract.balanceOf(address),
        contract.decimals(),
        contract.symbol(),
      ]);

      const formatted = formatUnits(rawBalance, decimals);
      setWallet((prev) => ({
        ...prev,
        tokenBalance: parseFloat(formatted).toFixed(4),
        tokenSymbol: symbol || FAUCET_TOKEN_SYMBOL,
      }));
    } catch (err) {
      console.error("Token balance fetch error:", err);
      setWallet((prev) => ({
        ...prev,
        tokenBalance: null,
        tokenSymbol: FAUCET_TOKEN_SYMBOL,
      }));
    }
  }

  // =========================================================
  // Handle account changes
  // =========================================================

  function handleAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setWallet((prev) => ({
        ...prev,
        address: accounts[0],
      }));
      fetchBalance(accounts[0]);
      fetchTokenBalance(accounts[0]);
    }
  }

  return {
    ...wallet,
    connectWallet,
    disconnectWallet,
  };
}
