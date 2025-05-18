
import { Bid } from "./types";

export function addBuyerBid(
  buyers: Map<string, Bid[]>, 
  buyerId: string, 
  quantity: number, 
  price: number
): void {
  if (quantity <= 0) {
    throw new Error("Quantity must be positive");
  }
  if (price <= 0) {
    throw new Error("Price must be positive");
  }

  // Create a new bid with the correct properties
  const bid: Bid = { 
    quantity, 
    price, 
    buyerId, 
    exists: true 
  };
  
  // Initialize the buyer's bid array if it doesn't exist
  if (!buyers.has(buyerId)) {
    buyers.set(buyerId, []);
  }
  
  // Get the buyer's bids array and add the new bid
  const buyerBids = buyers.get(buyerId) || [];
  buyerBids.push(bid);
  buyers.set(buyerId, buyerBids);
  
  console.log(`Added buy bid for ${buyerId}: ${quantity} kWh at ₹${price}`);
}

export function addSellerBid(
  sellers: Map<string, Bid[]>, 
  sellerId: string, 
  quantity: number, 
  price: number
): void {
  if (quantity <= 0) {
    throw new Error("Quantity must be positive");
  }
  if (price <= 0) {
    throw new Error("Price must be positive");
  }

  // Create a new bid with the correct properties
  const bid: Bid = { 
    quantity, 
    price, 
    sellerId, 
    exists: true 
  };
  
  // Initialize the seller's bid array if it doesn't exist
  if (!sellers.has(sellerId)) {
    sellers.set(sellerId, []);
  }
  
  // Get the seller's bids array and add the new bid
  const sellerBids = sellers.get(sellerId) || [];
  sellerBids.push(bid);
  sellers.set(sellerId, sellerBids);
  
  console.log(`Added sell bid for ${sellerId}: ${quantity} kWh at ₹${price}`);
}

export function clearUserBids(
  buyers: Map<string, Bid[]>,
  sellers: Map<string, Bid[]>,
  userId: string
): void {
  // Remove all buy bids for this user
  if (buyers.has(userId)) {
    buyers.delete(userId);
    console.log(`Cleared all buy bids for user ${userId}`);
  }
  
  // Remove all sell bids for this user
  if (sellers.has(userId)) {
    sellers.delete(userId);
    console.log(`Cleared all sell bids for user ${userId}`);
  }
}

export function cancelBuyBid(
  buyers: Map<string, Bid[]>,
  buyerId: string, 
  price: number, 
  quantity: number
): void {
  if (!buyers.has(buyerId)) {
    throw new Error("No buy bids found for this user");
  }
  
  const buyerBids = buyers.get(buyerId) || [];
  const index = buyerBids.findIndex(bid => 
    Math.abs(bid.price - price) < 0.001 && Math.abs(bid.quantity - quantity) < 0.001
  );
  
  if (index === -1) {
    throw new Error("Specific buy bid not found");
  }
  
  // Remove the bid
  buyerBids.splice(index, 1);
  console.log(`Cancelled buy bid for ${buyerId}: ${quantity} kWh at ₹${price}`);
  
  // If there are no more bids, remove the buyer
  if (buyerBids.length === 0) {
    buyers.delete(buyerId);
  } else {
    buyers.set(buyerId, buyerBids);
  }
}

export function cancelSellBid(
  sellers: Map<string, Bid[]>,
  sellerId: string, 
  price: number, 
  quantity: number
): void {
  if (!sellers.has(sellerId)) {
    throw new Error("No sell bids found for this user");
  }
  
  const sellerBids = sellers.get(sellerId) || [];
  const index = sellerBids.findIndex(bid => 
    Math.abs(bid.price - price) < 0.001 && Math.abs(bid.quantity - quantity) < 0.001
  );
  
  if (index === -1) {
    throw new Error("Specific sell bid not found");
  }
  
  // Remove the bid
  sellerBids.splice(index, 1);
  console.log(`Cancelled sell bid for ${sellerId}: ${quantity} kWh at ₹${price}`);
  
  // If there are no more bids, remove the seller
  if (sellerBids.length === 0) {
    sellers.delete(sellerId);
  } else {
    sellers.set(sellerId, sellerBids);
  }
}

export function collectAllBids(
  buyers: Map<string, Bid[]>,
  sellers: Map<string, Bid[]>
): { buyBids: Bid[], sellBids: Bid[] } {
  const buyBids: Bid[] = [];
  buyers.forEach((bids, buyerId) => {
    bids.forEach(bid => {
      buyBids.push({ ...bid, buyerId, exists: true });
    });
  });
  
  const sellBids: Bid[] = [];
  sellers.forEach((bids, sellerId) => {
    bids.forEach(bid => {
      sellBids.push({ ...bid, sellerId, exists: true });
    });
  });
  
  return { buyBids, sellBids };
}
