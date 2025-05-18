
import { Bid, AuctionResult } from "./types";

export function executeAuction(
  allBuyBids: Bid[], 
  allSellBids: Bid[]
): AuctionResult[] {
  // Sort buy bids in descending order of price
  const sortedBuyBids = [...allBuyBids].sort((a, b) => b.price - a.price);
  
  // Sort sell bids in ascending order of price
  const sortedSellBids = [...allSellBids].sort((a, b) => a.price - b.price);

  const results: AuctionResult[] = [];
  let i = 0, j = 0;

  while (i < sortedBuyBids.length && j < sortedSellBids.length) {
    const buyBid = sortedBuyBids[i];
    const sellBid = sortedSellBids[j];

    // Check if a trade is possible
    if (buyBid.price >= sellBid.price) {
      // Determine clearing price - midpoint between buy and sell
      const clearingPrice = (buyBid.price + sellBid.price) / 2;
      
      // Determine trade quantity - minimum of buy and sell quantities
      const quantityTraded = Math.min(buyBid.quantity, sellBid.quantity);

      // Record the trade
      const result: AuctionResult = {
        buyer: buyBid.buyerId!,
        seller: sellBid.sellerId!,
        quantityTraded,
        clearingPrice,
        timestamp: Date.now()
      };
      
      results.push(result);

      // Update remaining quantities
      buyBid.quantity -= quantityTraded;
      sellBid.quantity -= quantityTraded;

      // Move to next bid if quantity is depleted
      if (buyBid.quantity === 0) i++;
      if (sellBid.quantity === 0) j++;
    } else {
      // No more trades possible
      break;
    }
  }

  return results;
}

export function updateBidsAfterExecution(
  buyers: Map<string, Bid[]>,
  sellers: Map<string, Bid[]>,
  allBuyBids: Bid[],
  allSellBids: Bid[],
  startBuyIndex: number,
  startSellIndex: number
): void {
  // Clear existing maps
  buyers.clear();
  sellers.clear();

  // Add back remaining partial bids
  for (let k = startBuyIndex; k < allBuyBids.length; k++) {
    const bid = allBuyBids[k];
    if (bid.quantity > 0 && bid.buyerId) {
      if (!buyers.has(bid.buyerId)) {
        buyers.set(bid.buyerId, []);
      }
      buyers.get(bid.buyerId)!.push(bid);
    }
  }

  for (let k = startSellIndex; k < allSellBids.length; k++) {
    const bid = allSellBids[k];
    if (bid.quantity > 0 && bid.sellerId) {
      if (!sellers.has(bid.sellerId)) {
        sellers.set(bid.sellerId, []);
      }
      sellers.get(bid.sellerId)!.push(bid);
    }
  }
}
