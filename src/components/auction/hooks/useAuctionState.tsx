
import { useState, useEffect } from "react";
import { DoubleAuction } from "@/utils/auction/doubleAuction";
import { Bid, AuctionResult } from "@/utils/auction/types";
import { useAuth } from "@/contexts/AuthContext";
import { useAuctionResults } from "./useAuctionResults";
import { useBidManagement } from "./useBidManagement";
import { useAuctionInitialization } from "./useAuctionInitialization";
import { toast } from "sonner";

export const useAuctionState = (walletAddress: string | null, isConnected: boolean) => {
  console.log("[useAuctionState] Initializing with wallet:", walletAddress, "connected:", isConnected);
  
  // Create auction engine instance
  const [auctionEngine] = useState<DoubleAuction>(new DoubleAuction());
  const { user } = useAuth();
  
  // Create bid state to pass to sub-hooks
  const [buyBids, setBuyBids] = useState<Bid[]>([]);
  const [sellBids, setSellBids] = useState<Bid[]>([]);
  const [auctionHistory, setAuctionHistory] = useState<AuctionResult[]>([]);
  
  // Use bid management hook
  const bidManagement = useBidManagement(auctionEngine, walletAddress, isConnected);
  
  // Use auction results hook - pass the user from useAuth
  const auctionResults = useAuctionResults(
    auctionEngine, 
    walletAddress, 
    isConnected,
    user, // Pass the authenticated user
    bidManagement.updateBidStates
  );
  
  // Initialize auction with dummy data
  useAuctionInitialization(auctionEngine, setBuyBids, setSellBids, setAuctionHistory);
  
  // Log state changes for debugging
  useEffect(() => {
    console.log("[useAuctionState] Wallet connected:", isConnected, "address:", walletAddress);
    console.log("[useAuctionState] User authenticated:", user ? "Yes" : "No", "User ID:", user?.id);
    
    if (!isConnected && walletAddress !== null) {
      console.log("[useAuctionState] Warning: wallet address exists but not connected");
    }
    
    if (isConnected && !walletAddress) {
      console.log("[useAuctionState] Warning: wallet connected but address is null");
      toast.error("Wallet connection issue detected");
    }
  }, [isConnected, walletAddress, user]);
  
  // Enhanced bid placement with additional checks
  const enhancedPlaceBuyBid = (quantity: number, price: number) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    console.log("[useAuctionState] Enhanced placeBuyBid called with", { quantity, price });
    const result = bidManagement.placeBuyBid(quantity, price);
    
    // Force a refresh of the bid states after a short delay
    setTimeout(bidManagement.updateBidStates, 100);
    return result;
  };
  
  const enhancedPlaceSellBid = (quantity: number, price: number) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    console.log("[useAuctionState] Enhanced placeSellBid called with", { quantity, price });
    const result = bidManagement.placeSellBid(quantity, price);
    
    // Force a refresh of the bid states after a short delay
    setTimeout(bidManagement.updateBidStates, 100);
    return result;
  };
  
  return {
    // From bid management hook
    buyBids: bidManagement.buyBids,
    sellBids: bidManagement.sellBids,
    userBids: bidManagement.userBids,
    placeBuyBid: enhancedPlaceBuyBid,
    placeSellBid: enhancedPlaceSellBid,
    cancelAllBids: bidManagement.cancelAllBids,
    cancelSpecificBid: bidManagement.cancelSpecificBid,
    
    // From auction results hook
    auctionResults: auctionResults.auctionResults,
    auctionHistory: auctionResults.auctionHistory,
    isProcessing: auctionResults.isProcessing,
    executeAuction: auctionResults.executeAuction
  };
};
