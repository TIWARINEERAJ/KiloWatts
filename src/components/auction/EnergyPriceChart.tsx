
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuctionResult } from "@/utils/auction/types";
import { formatChartData, calculateStats, getTimeframeData, transactionsToAuctionHistory } from "./charts/utils";
import ChartStats from "./charts/ChartStats";
import AreaChartComponent from "./charts/AreaChart";
import LineChartComponent from "./charts/LineChart";
import CandleChartComponent from "./charts/CandleChart";
import { ChartContainer } from "@/components/ui/chart";
import { ChartBar } from "lucide-react";
import { useTransactionHistory } from './hooks/useTransactionHistory';

interface EnergyPriceChartProps {
  auctionHistory?: AuctionResult[];
}

const chartConfig = {
  price: {
    label: "Price"
  },
  volume: {
    label: "Volume"
  }
};

const EnergyPriceChart = ({ auctionHistory = [] }: EnergyPriceChartProps) => {
  const [timeframe, setTimeframe] = useState<string>("24h");
  const { transactions, isLoading } = useTransactionHistory();
  const [combinedHistory, setCombinedHistory] = useState<AuctionResult[]>([]);

  // Combine auction history with transaction history
  useEffect(() => {
    // Convert transactions to auction history format
    const transactionHistory = transactionsToAuctionHistory(transactions);
    
    // Combine with provided auction history
    const combined = [...auctionHistory, ...transactionHistory];
    
    // Sort by timestamp (newest first)
    combined.sort((a, b) => b.timestamp - a.timestamp);
    
    setCombinedHistory(combined);
    
    console.log(`EnergyPriceChart: Combined history has ${combined.length} entries (${auctionHistory.length} from auction, ${transactionHistory.length} from transactions)`);
  }, [auctionHistory, transactions]);
  
  // Add fallback for empty history
  const safeHistory = combinedHistory.length > 0 
    ? combinedHistory 
    : [
        {
          buyer: "initial-buyer",
          seller: "initial-seller",
          quantityTraded: 2.5,
          clearingPrice: 12.50,
          timestamp: Date.now() - 3600000
        }
      ];
  
  // Filter data based on selected timeframe
  const filteredData = getTimeframeData(safeHistory, timeframe);
  const stats = calculateStats(filteredData);
  const chartData = formatChartData(filteredData);

  return (
    <Card className="w-full shadow-lg border border-border/50 overflow-hidden">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <ChartBar className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-lg font-medium">Energy Price Chart</CardTitle>
        </div>
        <Tabs defaultValue={timeframe} value={timeframe} className="w-auto">
          <TabsList className="h-8 bg-background/50">
            <TabsTrigger 
              value="1h" 
              className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" 
              onClick={() => setTimeframe("1h")}
            >
              1H
            </TabsTrigger>
            <TabsTrigger 
              value="24h" 
              className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" 
              onClick={() => setTimeframe("24h")}
            >
              24H
            </TabsTrigger>
            <TabsTrigger 
              value="7d" 
              className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" 
              onClick={() => setTimeframe("7d")}
            >
              7D
            </TabsTrigger>
            <TabsTrigger 
              value="1m" 
              className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" 
              onClick={() => setTimeframe("1m")}
            >
              1M
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0">
        {/* Chart data overview */}
        <ChartStats stats={stats} />
        
        <Tabs defaultValue="area">
          <div className="flex justify-center p-2 border-b border-border/60">
            <TabsList className="h-7 bg-background/50">
              <TabsTrigger value="area" className="text-xs">Area</TabsTrigger>
              <TabsTrigger value="line" className="text-xs">Line</TabsTrigger>
              <TabsTrigger value="candle" className="text-xs">Candle</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="bg-gradient-to-b from-background/80 to-background">
            <TabsContent value="area" className="mt-0">
              <ChartContainer config={chartConfig}>
                <div className="h-[400px] w-full">
                  <AreaChartComponent data={chartData} />
                </div>
              </ChartContainer>
            </TabsContent>
            
            <TabsContent value="line" className="mt-0">
              <ChartContainer config={chartConfig}>
                <div className="h-[400px] w-full">
                  <LineChartComponent data={chartData} />
                </div>
              </ChartContainer>
            </TabsContent>
            
            <TabsContent value="candle" className="mt-0">
              <ChartContainer config={chartConfig}>
                <div className="h-[400px] w-full">
                  <CandleChartComponent data={chartData} />
                </div>
              </ChartContainer>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnergyPriceChart;
