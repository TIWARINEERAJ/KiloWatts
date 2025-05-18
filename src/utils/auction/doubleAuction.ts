
import { Bid, AuctionResult } from "./types";
import { 
  addBuyerBid, 
  addSellerBid, 
  clearUserBids, 
  cancelBuyBid, 
  cancelSellBid,
  collectAllBids 
} from "./bidManagement";
import { executeAuction, updateBidsAfterExecution } from "./auctionExecution";

// Fix re-export to use export type for TypeScript isolated modules
export type { Bid, AuctionResult } from "./types";

export class DoubleAuction {
  private buyers: Map<string, Bid[]>;
  private sellers: Map<string, Bid[]>;
  private auctionHistory: AuctionResult[];

  constructor() {
    this.buyers = new Map();
    this.sellers = new Map();
    this.auctionHistory = [];
  }

  addBuyer(buyerId: string, quantity: number, price: number): void {
    addBuyerBid(this.buyers, buyerId, quantity, price);
  }

  addSeller(sellerId: string, quantity: number, price: number): void {
    addSellerBid(this.sellers, sellerId, quantity, price);
  }

  clearUserBids(userId: string): void {
    clearUserBids(this.buyers, this.sellers, userId);
  }
  
  cancelBuyBid(buyerId: string, price: number, quantity: number): void {
    cancelBuyBid(this.buyers, buyerId, price, quantity);
  }
  
  cancelSellBid(sellerId: string, price: number, quantity: number): void {
    cancelSellBid(this.sellers, sellerId, price, quantity);
  }

  executeAuction(): AuctionResult[] {
    // Collect all bids
    const { buyBids, sellBids } = collectAllBids(this.buyers, this.sellers);

    // Execute auction and get results
    const results = executeAuction(buyBids, sellBids);
    
    // Add results to history
    this.auctionHistory.push(...results);

    // Update the remaining bids
    updateBidsAfterExecution(
      this.buyers, 
      this.sellers, 
      buyBids, 
      sellBids, 
      0, 
      0
    );

    return results;
  }

  getCurrentBids(): { buyBids: Bid[], sellBids: Bid[] } {
    return collectAllBids(this.buyers, this.sellers);
  }

  getAuctionHistory(): AuctionResult[] {
    return [...this.auctionHistory];
  }
}
