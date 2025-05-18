
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react";
import { StatsData } from "./types";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartStatsProps {
  stats: StatsData;
}

const ChartStats = ({ stats }: ChartStatsProps) => {
  const isPositiveChange = !stats.change.includes("-");
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 border-b border-border/60">
      <div className="flex flex-col">
        <span className="text-xs font-medium text-muted-foreground">Last Price</span>
        <div className="flex items-center gap-2 mt-1">
          {stats.lastPrice ? (
            <span className="text-lg font-semibold">₹{stats.lastPrice}</span>
          ) : (
            <Skeleton className="h-7 w-20" />
          )}
        </div>
      </div>
      
      <div className="flex flex-col">
        <span className="text-xs font-medium text-muted-foreground">Change</span>
        <div className="flex items-center gap-2 mt-1">
          {stats.change ? (
            <>
              <span className={`text-lg font-semibold ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
                {stats.change} ({stats.changePercent})
              </span>
              {isPositiveChange ? 
                <ArrowUp className="h-4 w-4 text-green-500" /> : 
                <ArrowDown className="h-4 w-4 text-red-500" />
              }
            </>
          ) : (
            <Skeleton className="h-7 w-20" />
          )}
        </div>
      </div>
      
      <div className="flex flex-col">
        <span className="text-xs font-medium text-muted-foreground">24h High/Low</span>
        <div className="flex items-center gap-2 mt-1">
          {stats.high ? (
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold">₹{stats.high}</span>
              <span className="text-xs text-muted-foreground">/</span>
              <span className="text-sm font-semibold">₹{stats.low}</span>
            </div>
          ) : (
            <Skeleton className="h-6 w-28" />
          )}
        </div>
      </div>
      
      <div className="flex flex-col">
        <span className="text-xs font-medium text-muted-foreground">24h Volume</span>
        <div className="flex items-center gap-2 mt-1">
          {stats.volume ? (
            <>
              <span className="text-lg font-semibold">{stats.volume}</span>
              <span className="text-xs text-muted-foreground">kWh</span>
            </>
          ) : (
            <Skeleton className="h-7 w-20" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartStats;
