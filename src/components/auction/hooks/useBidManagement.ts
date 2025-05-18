
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Bid } from "@/utils/auction/types";
import { DoubleAuction } from "@/utils/auction/doubleAuction";

export interface BidManagementState {
  buyBids: Bid[];
  sellBids: Bid[];
  userBids: { buyBids: Bid[], sellBids: Bid[] };
  placeBuyBid: (quantity: number, price: number) => void;
  placeSellBid: (quantity: number, price: number) => void;
  cancelAllBids: () => void;
  cancelSpecificBid: (isBuyBid: boolean, price: number, quantity: number) => void;
  updateBidStates: () => void;
}

/**
 * Hook for managing bids (placing, cancelling, and tracking)
 */
export const useBidManagement = (
  auctionEngine: DoubleAuction,
  walletAddress: string | null,
  isConnected: boolean
): BidManagementState => {
  const [buyBids, setBuyBids] = useState<Bid[]>([]);
  const [sellBids, setSellBids] = useState<Bid[]>([]);
  const [userBids, setUserBids] = useState<{ buyBids: Bid[], sellBids: Bid[] }>({
    buyBids: [],
    sellBids: []
  });

  // Update bid states from auction engine - made into a callback to avoid recreation
  const updateBidStates = useCallback(() => {
    console.log("[useBidManagement] Updating bid states from auction engine");
    try {
      const { buyBids: updatedBuyBids, sellBids: updatedSellBids } = auctionEngine.getCurrentBids();
      
      // Log the bids for debugging
      console.log("[useBidManagement] Current buy bids:", updatedBuyBids);
      console.log("[useBidManagement] Current sell bids:", updatedSellBids);
      
      setBuyBids([...updatedBuyBids]);
      setSellBids([...updatedSellBids]);
    } catch (error) {
      console.error("[useBidManagement] Error updating bid states:", error);
      toast.error("Failed to update bid states");
    }
  }, [auctionEngine]);

  // Initial load of bids
  useEffect(() => {
    console.log("[useBidManagement] Initial load of bids");
    updateBidStates();
  }, [updateBidStates]);

  // Update bid states when wallet connection changes
  useEffect(() => {
    console.log("[useBidManagement] Wallet connection changed:", isConnected);
    if (isConnected) {
      updateBidStates();
    }
  }, [isConnected, updateBidStates]);

  // Update user bids when wallet address or bid arrays change
  useEffect(() => {
    if (walletAddress) {
      console.log("[useBidManagement] Updating user bids for wallet:", walletAddress);
      
      const userBuyBids = buyBids.filter(bid => bid.buyerId === walletAddress);
      const userSellBids = sellBids.filter(bid => bid.sellerId === walletAddress);
      
      console.log("[useBidManagement] User bids updated:", { 
        buyBids: userBuyBids.length,
        sellBids: userSellBids.length 
      });
      
      setUserBids({
        buyBids: userBuyBids,
        sellBids: userSellBids
      });
    } else {
      setUserBids({ buyBids: [], sellBids: [] });
    }
  }, [walletAddress, buyBids, sellBids]);

  // Function to place a buy bid
  const placeBuyBid = useCallback((quantity: number, price: number) => {
    console.log("[useBidManagement] Attempting to place buy bid:", { quantity, price, walletAddress });
    
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!walletAddress) {
      toast.error("Wallet address not found");
      return;
    }

    if (quantity <= 0 || price <= 0) {
      toast.error("Please enter valid quantity and price");
      return;
    }

    try {
      console.log(`[useBidManagement] Placing buy bid: ${quantity} kWh at ₹${price}`);
      auctionEngine.addBuyer(walletAddress, quantity, price);
      
      // Update the UI
      updateBidStates();
      
      // Determine if there are matching sell orders
      const { sellBids: currentSellBids } = auctionEngine.getCurrentBids();
      const matchingSellOrders = currentSellBids.some(sellBid => sellBid.price <= price);
      
      if (matchingSellOrders) {
        toast.success("Buy bid placed! Matching sell orders available.", {
          description: "Execute the auction to complete trades."
        });
      } else {
        toast.success("Buy bid placed successfully");
      }
      
      // Force a refresh after a short delay to ensure UI updates
      setTimeout(updateBidStates, 100);
      
      return true;
    } catch (error: any) {
      console.error("[useBidManagement] Error placing buy bid:", error);
      toast.error(error.message || "Failed to place buy bid");
      return false;
    }
  }, [auctionEngine, isConnected, walletAddress, updateBidStates]);

  // Function to place a sell bid
  const placeSellBid = useCallback((quantity: number, price: number) => {
    console.log("[useBidManagement] Attempting to place sell bid:", { quantity, price, walletAddress });
    
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!walletAddress) {
      toast.error("Wallet address not found");
      return;
    }

    if (quantity <= 0 || price <= 0) {
      toast.error("Please enter valid quantity and price");
      return;
    }

    try {
      console.log(`[useBidManagement] Placing sell bid: ${quantity} kWh at ₹${price}`);
      auctionEngine.addSeller(walletAddress, quantity, price);
      
      // Update the UI
      updateBidStates();
      
      // Determine if there are matching buy orders
      const { buyBids: currentBuyBids } = auctionEngine.getCurrentBids();
      const matchingBuyOrders = currentBuyBids.some(buyBid => buyBid.price >= price);
      
      if (matchingBuyOrders) {
        toast.success("Sell bid placed! Matching buy orders available.", {
          description: "Execute the auction to complete trades."
        });
      } else {
        toast.success("Sell bid placed successfully");
      }
      
      // Force a refresh after a short delay to ensure UI updates
      setTimeout(updateBidStates, 100);
      
      return true;
    } catch (error: any) {
      console.error("[useBidManagement] Error placing sell bid:", error);
      toast.error(error.message || "Failed to place sell bid");
      return false;
    }
  }, [auctionEngine, isConnected, walletAddress, updateBidStates]);

  // Function to cancel all bids for the current user
  const cancelAllBids = useCallback(() => {
    if (!isConnected || !walletAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      console.log(`[useBidManagement] Cancelling all bids for user: ${walletAddress}`);
      auctionEngine.clearUserBids(walletAddress);
      toast.success("All bids cancelled successfully");
      
      // Update the UI
      updateBidStates();
      
      // Force a refresh after a short delay to ensure UI updates
      setTimeout(updateBidStates, 100);
    } catch (error: any) {
      console.error("[useBidManagement] Error cancelling bids:", error);
      toast.error(error.message || "Failed to cancel bids");
    }
  }, [auctionEngine, isConnected, walletAddress, updateBidStates]);

  // Function to cancel specific bid
  const cancelSpecificBid = useCallback((isBuyBid: boolean, price: number, quantity: number) => {
    if (!isConnected || !walletAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      if (isBuyBid) {
        console.log(`[useBidManagement] Cancelling buy bid: ${quantity} kWh at ₹${price}`);
        auctionEngine.cancelBuyBid(walletAddress, price, quantity);
      } else {
        console.log(`[useBidManagement] Cancelling sell bid: ${quantity} kWh at ₹${price}`);
        auctionEngine.cancelSellBid(walletAddress, price, quantity);
      }
      
      toast.success(`${isBuyBid ? 'Buy' : 'Sell'} bid cancelled successfully`);
      
      // Update the UI
      updateBidStates();
      
      // Force a refresh after a short delay to ensure UI updates
      setTimeout(updateBidStates, 100);
    } catch (error: any) {
      console.error("[useBidManagement] Error cancelling bid:", error);
      toast.error(error.message || "Failed to cancel bid");
    }
  }, [auctionEngine, isConnected, walletAddress, updateBidStates]);

  return {
    buyBids,
    sellBids,
    userBids,
    placeBuyBid,
    placeSellBid,
    cancelAllBids,
    cancelSpecificBid,
    updateBidStates
  };
};
