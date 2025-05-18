
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bid } from "@/utils/auction/types";
import { ArrowDownUp, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";

interface AuctionOrderBookProps {
  buyBids: Bid[];
  sellBids: Bid[];
  executeAuction: () => Promise<void>;
  isConnected: boolean;
  isProcessing: boolean;
}

const AuctionOrderBookSection = ({ 
  buyBids, 
  sellBids, 
  executeAuction,
  isConnected,
  isProcessing
}: AuctionOrderBookProps) => {
  const [displayBuyBids, setDisplayBuyBids] = useState<Bid[]>([]);
  const [displaySellBids, setDisplaySellBids] = useState<Bid[]>([]);
  
  // Fill the order book with some dummy bids if real bids are too few
  useEffect(() => {
    const fillOrderBook = () => {
      console.log("Filling order book with real bids:", { buyBids, sellBids });
      
      // Create dummy bids to fill the order book
      const dummyBuyBids: Bid[] = [];
      const dummySellBids: Bid[] = [];
      
      const basePrice = 12.50;
      
      // Generate more dummy bids if real bids are few
      const requiredBidCount = 8;
      
      if (buyBids.length < requiredBidCount) {
        for (let i = 0; i < requiredBidCount - buyBids.length; i++) {
          const price = basePrice - ((i + 1) * 0.15);
          dummyBuyBids.push({
            buyerId: `dummy-buyer-${i}`,
            price,
            quantity: 1 + Math.random() * 2,
            exists: true
          });
        }
      }
      
      if (sellBids.length < requiredBidCount) {
        for (let i = 0; i < requiredBidCount - sellBids.length; i++) {
          const price = basePrice + ((i + 1) * 0.15);
          dummySellBids.push({
            sellerId: `dummy-seller-${i}`,
            price,
            quantity: 1 + Math.random() * 2,
            exists: true
          });
        }
      }
      
      const mergedBuyBids = [...buyBids, ...dummyBuyBids];
      const mergedSellBids = [...sellBids, ...dummySellBids];
      
      // Sort buy bids by price (descending)
      mergedBuyBids.sort((a, b) => b.price - a.price);
      
      // Sort sell bids by price (ascending)
      mergedSellBids.sort((a, b) => a.price - b.price);
      
      console.log("Order book filled:", { 
        mergedBuyBids, 
        mergedSellBids,
        realBuyBids: buyBids.length,
        realSellBids: sellBids.length 
      });
      
      setDisplayBuyBids(mergedBuyBids);
      setDisplaySellBids(mergedSellBids);
    };
    
    fillOrderBook();
  }, [buyBids, sellBids]);

  const handleExecuteAuction = async () => {
    try {
      console.log("Executing auction with bids:", { buyBids, sellBids });
      await executeAuction();
      toast.success("Auction executed successfully!");
    } catch (error) {
      console.error("Error executing auction:", error);
      toast.error("Failed to execute auction");
    }
  };
  
  // Calculate spread between highest buy and lowest sell
  const spread = displaySellBids.length > 0 && displayBuyBids.length > 0
    ? (displaySellBids[0].price - displayBuyBids[0].price).toFixed(2)
    : "N/A";

  const hasMatchingBids = displaySellBids.length > 0 && displayBuyBids.length > 0 && 
    displayBuyBids[0].price >= displaySellBids[0].price;

  return (
    <div className="space-y-4">
      <Card className="shadow-lg border-2 border-muted/20">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm font-medium">Order Book</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-3 text-xs font-medium text-muted-foreground">
            <div>Quantity (kWh)</div>
            <div className="text-center">Price (₹)</div>
            <div className="text-right">Total (₹)</div>
          </div>
          
          {/* Sell orders - displayed from highest to lowest price */}
          <div className="space-y-1 mb-2">
            {displaySellBids.map((bid, index) => (
              <div 
                key={`sell-${index}`}
                className={`grid grid-cols-3 text-xs py-1 border-b border-border/40 ${
                  hasMatchingBids && index === 0 && displayBuyBids[0].price >= bid.price 
                    ? "bg-green-50 dark:bg-green-950/20" 
                    : ""
                }`}
              >
                <div>{bid.quantity.toFixed(2)}</div>
                <div className="text-center text-red-500 font-medium">
                  {bid.price.toFixed(2)} <ArrowUp className="inline h-3 w-3" />
                </div>
                <div className="text-right">{(bid.quantity * bid.price).toFixed(2)}</div>
              </div>
            ))}
          </div>
          
          {/* Price spread indicator */}
          <div className={`my-3 py-2 text-center ${
            hasMatchingBids ? "bg-green-100 dark:bg-green-900/20" : "bg-muted/20"
          } rounded-md`}>
            <div className="text-sm font-medium flex justify-center items-center gap-2">
              <span>Spread: </span>
              <span className={`${hasMatchingBids ? "text-green-600 dark:text-green-400" : "text-primary"}`}>
                {hasMatchingBids ? "MATCHING BIDS!" : `₹${spread}`}
              </span>
              <ArrowDownUp className={`h-3 w-3 ${
                hasMatchingBids ? "text-green-500" : "text-muted-foreground"
              }`} />
            </div>
          </div>
          
          {/* Buy orders - displayed from highest to lowest price */}
          <div className="space-y-1 mt-2">
            {displayBuyBids.map((bid, index) => (
              <div 
                key={`buy-${index}`}
                className={`grid grid-cols-3 text-xs py-1 border-b border-border/40 ${
                  hasMatchingBids && index === 0 && bid.price >= displaySellBids[0].price 
                    ? "bg-green-50 dark:bg-green-950/20" 
                    : ""
                }`}
              >
                <div>{bid.quantity.toFixed(2)}</div>
                <div className="text-center text-green-500 font-medium">
                  {bid.price.toFixed(2)} <ArrowDown className="inline h-3 w-3" />
                </div>
                <div className="text-right">{(bid.quantity * bid.price).toFixed(2)}</div>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={handleExecuteAuction} 
            className={`w-full mt-4 ${
              hasMatchingBids 
                ? "bg-green-600 hover:bg-green-700" 
                : ""
            }`}
            disabled={!isConnected || buyBids.length === 0 || sellBids.length === 0 || isProcessing}
          >
            {isProcessing ? "Processing..." : hasMatchingBids ? "Execute Matching Orders" : "Execute Auction"}
          </Button>
          
          {hasMatchingBids && (
            <p className="text-xs text-center mt-2 text-green-600 dark:text-green-400">
              Matching orders available! Click to execute trades.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuctionOrderBookSection;
