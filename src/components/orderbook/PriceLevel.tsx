
import { cn } from "@/lib/utils";

interface PriceLevelProps {
  price: number;
  total: number;
  cumulative: number;
  maxCumulative: number;
  isBuy: boolean;
}

const PriceLevel = ({ price, total, cumulative, maxCumulative, isBuy }: PriceLevelProps) => {
  const colorClass = isBuy ? "text-green-500" : "text-red-500";
  const bgClass = isBuy ? "bg-green-500/10" : "bg-red-500/10";
  const direction = isBuy ? "left" : "right";
  
  return (
    <div className="flex w-full relative group">
      <div
        className={`absolute ${direction}-0 h-full ${bgClass}`}
        style={{ width: `${(cumulative / maxCumulative) * 100}%` }}
      />
      <div className="grid grid-cols-3 w-full py-0.5 px-4 text-xs relative z-10 hover:bg-muted/50">
        <div className="text-right pr-2 font-mono">{total.toFixed(2)}</div>
        <div className={`text-center ${colorClass} font-medium font-mono`}>
          {price.toFixed(2)}
        </div>
        <div className="text-left pl-2 font-mono text-muted-foreground">{cumulative.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default PriceLevel;
