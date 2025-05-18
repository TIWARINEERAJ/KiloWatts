
import { ArrowUp, ArrowDown } from "lucide-react";

interface MarketPriceProps {
  lastPrice: number | null;
  lastPriceDirection: 'up' | 'down' | null;
  spreadAmount: number | null;
}

const MarketPrice = ({ lastPrice, lastPriceDirection, spreadAmount }: MarketPriceProps) => {
  return (
    <div className="border-y border-border py-2 flex justify-between items-center px-4">
      <div className="text-xs font-medium">
        {lastPrice !== null ? (
          <span className={`font-mono text-base ${
            lastPriceDirection === 'up' ? "text-green-500" : 
            lastPriceDirection === 'down' ? "text-red-500" : "text-primary"
          }`}>
            ₹{lastPrice.toFixed(2)}
          </span>
        ) : (
          <span className="text-muted-foreground">No price data</span>
        )}
      </div>
      
      <div className="flex items-center gap-1">
        {lastPriceDirection === 'up' && <ArrowUp className="h-3.5 w-3.5 text-green-500" />}
        {lastPriceDirection === 'down' && <ArrowDown className="h-3.5 w-3.5 text-red-500" />}
        <span className="text-xs text-muted-foreground">
          {spreadAmount !== null ? (
            <span>Market Price</span>
          ) : (
            <span>Waiting for orders</span>
          )}
        </span>
      </div>
    </div>
  );
};

export default MarketPrice;
