import { useState, useEffect } from "react";
import { Bid } from "@/utils/auction/types";

export const useOrderBook = (buyBids: Bid[], sellBids: Bid[]) => {
  const [spreadAmount, setSpreadAmount] = useState<number | null>(null);
  const [spreadPercentage, setSpreadPercentage] = useState<number | null>(null);
  const [lastPriceDirection, setLastPriceDirection] = useState<'up' | 'down' | null>(null);
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  
  // Calculate the market price and spread
  useEffect(() => {
    console.log("OrderBook received bids:", { buyBids: buyBids.length, sellBids: sellBids.length });
    
    if (buyBids.length > 0 && sellBids.length > 0) {
      // Sort bids appropriately
      const sortedBuyBids = [...buyBids].sort((a, b) => b.price - a.price);
      const sortedSellBids = [...sellBids].sort((a, b) => a.price - b.price);
      
      // Find highest buy and lowest sell
      const highestBuy = sortedBuyBids[0]?.price;
      const lowestSell = sortedSellBids[0]?.price;
      
      if (highestBuy !== undefined && lowestSell !== undefined) {
        const spread = lowestSell - highestBuy;
        setSpreadAmount(spread);
        setSpreadPercentage((spread / lowestSell) * 100);

        // Calculate midpoint price
        const midPrice = (highestBuy + lowestSell) / 2;
        
        // Update last price and direction
        if (lastPrice !== null) {
          setLastPriceDirection(midPrice > lastPrice ? 'up' : 'down');
        }
        setLastPrice(midPrice);
      }
    } else {
      setSpreadAmount(null);
      setSpreadPercentage(null);
    }
  }, [buyBids, sellBids, lastPrice]);
  
  // Calculate total quantity at each price level
  const calculatePriceLevels = (bids: Bid[], isBuyOrder: boolean) => {
    const priceLevels: Record<number, { total: number, cumulative: number }> = {};
    
    console.log(`Calculating price levels for ${isBuyOrder ? 'buy' : 'sell'} orders:`, bids);
    
    // Sort bids
    const sortedBids = [...bids].sort((a, b) => 
      isBuyOrder ? b.price - a.price : a.price - b.price
    );
    
    // Group by price and sum quantities
    sortedBids.forEach(bid => {
      if (bid.price !== undefined && bid.quantity !== undefined) {
        const priceKey = Number(bid.price.toFixed(2));
        if (!priceLevels[priceKey]) {
          priceLevels[priceKey] = { total: 0, cumulative: 0 };
        }
        priceLevels[priceKey].total += bid.quantity;
      }
    });
    
    // Calculate cumulative values
    let cumulative = 0;
    const priceKeys = Object.keys(priceLevels).map(Number);
    priceKeys.sort((a, b) => isBuyOrder ? b - a : a - b);
    
    priceKeys.forEach(price => {
      cumulative += priceLevels[price].total;
      priceLevels[price].cumulative = cumulative;
    });
    
    return priceLevels;
  };
  
  const buyPriceLevels = calculatePriceLevels(buyBids, true);
  const sellPriceLevels = calculatePriceLevels(sellBids, false);
  
  // Find max cumulative value for depth chart scaling
  const maxCumulative = Math.max(
    ...Object.values(buyPriceLevels).map(level => level.cumulative || 0),
    ...Object.values(sellPriceLevels).map(level => level.cumulative || 0),
    0.1 // prevent zero division
  );
  
  return {
    spreadAmount,
    spreadPercentage,
    lastPriceDirection,
    lastPrice,
    buyPriceLevels,
    sellPriceLevels,
    maxCumulative
  };
};
