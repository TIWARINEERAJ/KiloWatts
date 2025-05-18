
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bid, AuctionResult } from "@/utils/auction/types";
import BiddingForm from "@/components/auction/BiddingForm";
import EnergyPriceChart from "@/components/auction/EnergyPriceChart";
import AuctionOrderBookSection from "@/components/auction/AuctionOrderBookSection";
import AuctionResultsTable from "@/components/auction/AuctionResultsTable";
import TransactionHistory from "@/components/auction/TransactionHistory";
import { useWalletConnection } from "@/components/auction/hooks/useWalletConnection";
import { useAuctionState } from "@/components/auction/hooks/useAuctionState";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// Define global window interface for blockchain functions
declare global {
  interface Window {
    solana?: any;
    ethereum?: any;
    connectPhantomWallet?: () => Promise<string | null>;
    disconnectPhantomWallet?: () => Promise<boolean>;
    storeAuctionResultOnSolana?: (auctionResult: any) => Promise<string | null>;
    requestEthereumAccounts?: () => Promise<string | null>;
    switchEthereumNetwork?: (networkId: number) => Promise<boolean>;
  }
}

const DoubleAuctionInterface = () => {
  // State for transaction history refresh
  const [transactionRefreshTrigger, setTransactionRefreshTrigger] = useState<number>(0);
  const { user } = useAuth();
  
  // Use our custom hooks
  const { walletAddress, isConnected } = useWalletConnection();
  const { 
    buyBids,
    sellBids,
    auctionResults,
    auctionHistory,
    isProcessing,
    userBids,
    placeBuyBid,
    placeSellBid,
    cancelAllBids,
    cancelSpecificBid,
    executeAuction
  } = useAuctionState(walletAddress, isConnected);

  useEffect(() => {
    // Force a repaint to ensure all styles are applied correctly
    console.log("DoubleAuctionInterface rendered");
    console.log("User authenticated:", user ? "Yes" : "No", "User ID:", user?.id);
  }, [user]);
  
  // Update transaction refresh trigger whenever auction results change
  useEffect(() => {
    if (auctionResults.length > 0) {
      setTransactionRefreshTrigger(prev => prev + 1);
      
      // Record the latest auction result on the blockchain
      const recordAuctionOnBlockchain = async () => {
        try {
          if (auctionResults.length === 0) return;
          
          const latestResult = auctionResults[0];
          
          // Check if we have a connected wallet and the required function
          if (window.solana?.isPhantom && 
              window.solana?.publicKey && 
              typeof window.storeAuctionResultOnSolana === 'function') {
            
            const signature = await window.storeAuctionResultOnSolana(latestResult);
            
            if (signature) {
              console.log("Auction result stored on blockchain with signature:", signature);
              toast.success("Auction result recorded on blockchain");
            }
          }
        } catch (error) {
          console.error("Error recording auction on blockchain:", error);
        }
      };
      
      recordAuctionOnBlockchain();
    }
  }, [auctionResults]);

  return (
    <div className="container mx-auto p-4 space-y-10">
      <h1 className="text-2xl font-bold mb-6">Double Auction Energy Trading</h1>
      
      {/* Price Chart Section - Full Width */}
      <div className="w-full mb-10 bg-background rounded-lg p-2">
        <EnergyPriceChart auctionHistory={auctionHistory} />
      </div>
      
      {/* Trading Interface Section - Split into Two Columns with More Spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        {/* Bidding Form - Left Column */}
        <div className="space-y-6">
          <BiddingForm
            isConnected={isConnected}
            placeBuyBid={placeBuyBid}
            placeSellBid={placeSellBid}
            cancelAllBids={cancelAllBids}
            userBids={userBids}
            cancelSpecificBid={cancelSpecificBid}
          />
        </div>
        
        {/* Order Book Section - Right Column */}
        <div className="space-y-6">
          <AuctionOrderBookSection
            buyBids={buyBids}
            sellBids={sellBids}
            executeAuction={executeAuction}
            isConnected={isConnected}
            isProcessing={isProcessing}
          />
        </div>
      </div>
      
      {/* Auction Results - Full Width */}
      <div className="w-full mb-10">
        <AuctionResultsTable results={auctionResults} />
      </div>
      
      {/* Transaction History - Full Width */}
      <div className="w-full">
        <TransactionHistory refreshTrigger={transactionRefreshTrigger} />
      </div>
    </div>
  );
};

export default DoubleAuctionInterface;
