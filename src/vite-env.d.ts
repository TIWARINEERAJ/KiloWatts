
/// <reference types="vite/client" />

// Global type declarations for the entire application
// This ensures consistency across all files that use these types

// Transaction data structure
interface TransactionData {
  type: string;
  amount: number;
  timestamp: number;
  description: string;
  counterparty?: string;
  originalTx?: string; // For mainnet transfers
  network?: string; // For network selection
  [key: string]: any; // Allow additional properties
}

// Phantom wallet interface
interface PhantomWallet {
  isPhantom?: boolean;
  publicKey?: {
    toString(): string;
  };
  connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString(): string } }>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: any) => Promise<any>;
  signAllTransactions: (transactions: any[]) => Promise<any[]>;
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
  signAndSendTransaction?: (transaction: any) => Promise<{ signature: string }>;
}

// Define global types that will be used across multiple files
declare global {
  interface Window {
    solana?: PhantomWallet;
    ethereum?: any; // Metamask provider
    connectPhantomWallet?: () => Promise<string | null>;
    disconnectPhantomWallet?: () => Promise<boolean>;
    storeTransactionOnSolana?: (transactionData: TransactionData) => Promise<string | null>;
    sendTransactionToSolanaMainnet?: (transactionData: TransactionData) => Promise<string | null>;
    storeAuctionResultOnSolana?: (auctionResult: any) => Promise<string | null>;
    switchEthereumNetwork?: (networkId: number) => Promise<boolean>;
    requestEthereumAccounts?: () => Promise<string | null>;
  }
}
