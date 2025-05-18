
import { useState, useEffect } from "react";
import { Bid, AuctionResult } from "@/utils/auction/types";
import { DoubleAuction } from "@/utils/auction/doubleAuction";
import { format, subMonths, subDays, subHours, addDays } from "date-fns";

/**
 * Hook for initializing auction with dummy data for demo purposes
 */
export const useAuctionInitialization = (
  auctionEngine: DoubleAuction,
  setBuyBids: (bids: Bid[]) => void,
  setSellBids: (bids: Bid[]) => void,
  setAuctionHistory: (history: AuctionResult[]) => void
) => {
  useEffect(() => {
    // Initialize with some dummy bids on component mount
    console.log("Initializing auction with dummy bids");
    
    const basePrice = 12.50;
    const dummyBuyBids: Bid[] = [];
    const dummySellBids: Bid[] = [];
    
    // Generate 30 sample users (previously 5)
    // Add some initial buy bids (increased to 15)
    for (let i = 0; i < 15; i++) {
      const price = basePrice - ((i % 5 + 1) * 0.25);
      dummyBuyBids.push({
        buyerId: `sample-buyer-${i}`,
        price,
        quantity: 1.5 + Math.random(),
        exists: true
      });
    }
    
    // Add some initial sell bids (increased to 15)
    for (let i = 0; i < 15; i++) {
      const price = basePrice + ((i % 5 + 1) * 0.25);
      dummySellBids.push({
        sellerId: `sample-seller-${i}`,
        price,
        quantity: 1.5 + Math.random(),
        exists: true
      });
    }
    
    // Add to auction engine
    dummyBuyBids.forEach(bid => {
      if (bid.buyerId && bid.quantity && bid.price) {
        auctionEngine.addBuyer(bid.buyerId, bid.quantity, bid.price);
      }
    });
    
    dummySellBids.forEach(bid => {
      if (bid.sellerId && bid.quantity && bid.price) {
        auctionEngine.addSeller(bid.sellerId, bid.quantity, bid.price);
      }
    });
    
    // Update state with the bids
    const { buyBids, sellBids } = auctionEngine.getCurrentBids();
    setBuyBids([...buyBids]);
    setSellBids([...sellBids]);
    
    // Generate a full year of historical auction results for the price chart
    const initialHistory: AuctionResult[] = [];
    const now = Date.now();
    
    // Create 365 days of historical data points for better chart visualization
    const yearAgo = subMonths(now, 12);
    const totalDays = 365;
    
    // Parameters for seasonal patterns
    const annualCycle = 365; // days in a year
    const monthlyCycle = 30; // approx days in a month
    const weeklyCycle = 7; // days in a week
    
    // Sample user IDs for transactions (increased to 30)
    const sampleUserIds = Array.from({ length: 30 }, (_, i) => `user-${i+1}`);
    const locations = [
      "Delhi", "Mumbai", "Chennai", "Kolkata", "Bangalore", 
      "Hyderabad", "Ahmedabad", "Pune", "Surat", "Jaipur"
    ];
    
    // Generate a year's worth of daily data points with enhanced details
    for (let i = 0; i < totalDays; i++) {
      const dayOffset = i;
      const currentDate = subDays(now, totalDays - dayOffset);
      const currentTimestamp = currentDate.getTime();
      
      // Create multiple data points per day (every 6 hours)
      for (let h = 0; h < 4; h++) {
        const timestamp = subHours(currentTimestamp, h * 6).getTime(); // Convert Date to number timestamp
        
        // Base price with seasonal components
        // 1. Annual seasonal component (higher in winter, lower in summer)
        const annualComponent = Math.sin((dayOffset / annualCycle) * 2 * Math.PI) * 1.5;
        
        // 2. Monthly component (price tends to peak mid-month)
        const monthlyComponent = Math.sin((dayOffset % monthlyCycle / monthlyCycle) * 2 * Math.PI) * 0.8;
        
        // 3. Weekly component (weekend vs weekday pattern)
        const dayOfWeek = dayOffset % weeklyCycle;
        const weekendMultiplier = (dayOfWeek === 5 || dayOfWeek === 6) ? -0.7 : 0.3; // lower on weekends
        
        // 4. Random noise component
        const noise = (Math.random() - 0.5) * 0.5;
        
        // 5. Long term trend (slight upward trend)
        const trend = dayOffset * 0.005;
        
        // Combine components for final price
        let price = basePrice + annualComponent + monthlyComponent + weekendMultiplier + noise + trend;
        
        // Ensure price stays positive and reasonable
        price = Math.max(price, basePrice * 0.5);
        
        // Add some volume variance based on price (higher volume when price is more extreme)
        const priceDeviation = Math.abs(price - basePrice);
        const volumeMultiplier = 1 + (priceDeviation / basePrice) * 3;
        const volume = (1 + Math.random() * 3) * volumeMultiplier;
        
        // Generate detailed transaction data with random users from our sample pool
        const buyerIndex = Math.floor(Math.random() * sampleUserIds.length);
        const sellerIndex = (buyerIndex + 1 + Math.floor(Math.random() * (sampleUserIds.length - 1))) % sampleUserIds.length;
        
        // Add metadata for transaction details view
        const locationIndex = Math.floor(Math.random() * locations.length);
        const blockchainTx = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        
        initialHistory.push({
          buyer: sampleUserIds[buyerIndex],
          seller: sampleUserIds[sellerIndex],
          quantityTraded: volume,
          clearingPrice: price,
          timestamp,
          // Enhanced transaction metadata
          blockchainTx,
          location: locations[locationIndex],
          feesPaid: price * volume * 0.02, // 2% transaction fee
          settlementTime: Math.floor(Math.random() * 300) + 10, // Settlement time in seconds
          transactionId: `TX-${dayOffset}-${h}-${Math.floor(Math.random() * 1000)}`,
          status: Math.random() > 0.05 ? "completed" : "pending", // 5% chance of pending
        });
      }
    }
    
    // Sort by timestamp to ensure chronological order
    const sortedHistory = [...initialHistory].sort((a, b) => a.timestamp - b.timestamp);
    setAuctionHistory(sortedHistory);
    
    console.log("Initial auction state setup complete with 1 year of data:", { 
      buyBids, 
      sellBids, 
      historyPoints: sortedHistory.length,
      uniqueUsers: new Set([...sortedHistory.map(item => item.buyer), ...sortedHistory.map(item => item.seller)]).size
    });
  }, [auctionEngine, setBuyBids, setSellBids, setAuctionHistory]);
};
