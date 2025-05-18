
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlockchainWalletConnect from "./blockchain/BlockchainWalletConnect";
import TransactionHistory from "./blockchain/TransactionHistory";
import BlockchainInfoCards from "./blockchain/BlockchainInfoCards";

interface Transaction {
  tx: string;
  timestamp: number;
  blockchain: string;
}

const SmartContractsManagement = () => {
  // Selected blockchain network
  const [selectedBlockchain, setSelectedBlockchain] = useState<"solana" | "ethereum">("solana");
  
  // Wallet connection states
  const [walletInfo, setWalletInfo] = useState({
    isPhantomConnected: false,
    isMetamaskConnected: false,
    phantomWalletAddress: null as string | null,
    metamaskWalletAddress: null as string | null
  });
  
  // Transaction history
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([]);
  
  // Handle wallet connection update
  const handleWalletUpdate = (walletInfo: {
    isPhantomConnected: boolean;
    isMetamaskConnected: boolean;
    phantomWalletAddress: string | null;
    metamaskWalletAddress: string | null;
  }) => {
    setWalletInfo(walletInfo);
  };
  
  // Handle blockchain selection
  const handleBlockchainSelect = (blockchain: "solana" | "ethereum") => {
    setSelectedBlockchain(blockchain);
  };
  
  // Handle transaction recorded
  const handleTransactionRecorded = (tx: string, timestamp: number, blockchain: string) => {
    setTransactionHistory(prev => [...prev, { tx, timestamp, blockchain }]);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Blockchain Integration Hub</h1>
      
      <Tabs defaultValue="wallets" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="wallets">Wallet Connection</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>
        
        {/* Wallet Connection Tab */}
        <TabsContent value="wallets" className="space-y-6">
          <BlockchainWalletConnect onWalletUpdate={handleWalletUpdate} />
        </TabsContent>
        
        {/* Transaction History Tab */}
        <TabsContent value="history">
          <TransactionHistory 
            transactions={transactionHistory} 
            isPhantomConnected={walletInfo.isPhantomConnected}
            isMetamaskConnected={walletInfo.isMetamaskConnected}
            selectedBlockchain={selectedBlockchain}
            onBlockchainSelect={handleBlockchainSelect}
            onTransactionRecorded={handleTransactionRecorded}
          />
        </TabsContent>
      </Tabs>
      
      {/* Information Cards */}
      <BlockchainInfoCards />
    </div>
  );
};

export default SmartContractsManagement;
