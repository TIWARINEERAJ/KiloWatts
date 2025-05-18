
import { format } from "date-fns";
import { AuctionResult } from "@/utils/auction/types";
import { ChartData, StatsData } from "./types";

export const formatChartData = (auctionHistory: AuctionResult[]): ChartData[] => {
  if (!auctionHistory || auctionHistory.length === 0) {
    console.warn("No auction history data available for chart");
    return [];
  }
  
  // Sort by timestamp to ensure chronological order
  const sortedHistory = [...auctionHistory].sort((a, b) => a.timestamp - b.timestamp);
  
  // For very large datasets, consider data sampling to improve performance
  let dataToProcess = sortedHistory;
  if (sortedHistory.length > 500) {
    // Sample the data for better performance when displaying long time ranges
    const samplingRate = Math.floor(sortedHistory.length / 500);
    dataToProcess = sortedHistory.filter((_, index) => index % samplingRate === 0);
    console.log(`Sampling data for chart: using ${dataToProcess.length} points from ${sortedHistory.length} total`);
  }
  
  return dataToProcess.map((result, index, array) => {
    const prevPrice = index > 0 ? array[index - 1].clearingPrice : result.clearingPrice;
    const date = new Date(result.timestamp);
    
    // Format date based on data density
    let dateFormat = "MMM d, HH:mm";
    if (sortedHistory.length > 1000) {
      dateFormat = "MMM d"; // Just show month and day for very long ranges
    }
    
    return {
      date: format(date, dateFormat),
      price: result.clearingPrice,
      volume: result.quantityTraded,
      high: result.clearingPrice * 1.02, // Simulated high
      low: result.clearingPrice * 0.98,  // Simulated low
      open: prevPrice, // Use previous clearing price as open
      close: result.clearingPrice,       // Close is the clearing price
      buyVolume: result.quantityTraded * 0.6, // Simulating buy volume
      sellVolume: result.quantityTraded * 0.4, // Simulating sell volume
    };
  });
};

export const calculateStats = (auctionHistory: AuctionResult[]): StatsData => {
  if (!auctionHistory || auctionHistory.length === 0) {
    return {
      lastPrice: "N/A",
      change: "0",
      changePercent: "0%",
      high: "N/A",
      low: "N/A",
      volume: "0"
    };
  }

  // Ensure data is sorted by timestamp
  const sortedHistory = [...auctionHistory].sort((a, b) => a.timestamp - b.timestamp);
  
  // Get data for the last 24 hours for the stats display
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const last24HoursData = sortedHistory.filter(item => item.timestamp >= oneDayAgo);
  
  // Use the 24-hour data if available, otherwise use all data
  const dataForStats = last24HoursData.length > 0 ? last24HoursData : sortedHistory;
  const chartData = formatChartData(dataForStats);
  
  // Get the current and previous price points
  const current = chartData[chartData.length - 1];
  const previous = chartData.length > 1 ? chartData[chartData.length - 2] : current;
  
  const change = current.price - previous.price;
  const changePercent = ((change / previous.price) * 100).toFixed(2);
  
  // Find highest and lowest prices in the 24h period
  const high = Math.max(...chartData.map(item => item.price));
  const low = Math.min(...chartData.map(item => item.price));
  
  // Calculate total volume in the 24h period
  const volume = chartData.reduce((sum, item) => sum + item.volume, 0);
  
  return {
    lastPrice: current.price.toFixed(2),
    change: change.toFixed(2),
    changePercent: `${changePercent}%`,
    high: high.toFixed(2),
    low: low.toFixed(2),
    volume: volume.toFixed(2)
  };
};

// Helper function to get appropriate timeframe data
export const getTimeframeData = (auctionHistory: AuctionResult[], timeframe: string): AuctionResult[] => {
  if (!auctionHistory || auctionHistory.length === 0) {
    return [];
  }
  
  const now = Date.now();
  let cutoffTime: number;
  
  switch (timeframe) {
    case "1h":
      cutoffTime = now - 60 * 60 * 1000; // 1 hour
      break;
    case "24h":
      cutoffTime = now - 24 * 60 * 60 * 1000; // 24 hours
      break;
    case "7d":
      cutoffTime = now - 7 * 24 * 60 * 60 * 1000; // 7 days
      break;
    case "1m":
      cutoffTime = now - 30 * 24 * 60 * 60 * 1000; // ~1 month (30 days)
      break;
    default:
      cutoffTime = now - 24 * 60 * 60 * 1000; // Default to 24h
  }
  
  return auctionHistory.filter(item => item.timestamp >= cutoffTime);
};

// New function to transform transaction history into auction history format
export const transactionsToAuctionHistory = (transactions: any[]): AuctionResult[] => {
  if (!transactions || transactions.length === 0) {
    return [];
  }

  return transactions.map(tx => ({
    buyer: tx.buyer_address || "Unknown Buyer",
    seller: tx.seller_address || "Unknown Seller",
    quantityTraded: Number(tx.quantity) || 0,
    clearingPrice: Number(tx.price) || 0,
    timestamp: new Date(tx.created_at).getTime(),
  }));
};
