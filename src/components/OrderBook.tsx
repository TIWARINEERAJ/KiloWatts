
import { Card, CardContent } from "@/components/ui/card";
import { Bid } from "@/utils/auction/types";
import OrderBookHeader from "./orderbook/OrderBookHeader";
import SellOrders from "./orderbook/SellOrders";
import BuyOrders from "./orderbook/BuyOrders";
import MarketPrice from "./orderbook/MarketPrice";
import OrderBookSummary from "./orderbook/OrderBookSummary";
import { useOrderBook } from "./orderbook/useOrderBook";

interface OrderBookProps {
  buyBids: Bid[];
  sellBids: Bid[];
}

const OrderBook = ({ buyBids, sellBids }: OrderBookProps) => {
  const {
    spreadAmount,
    spreadPercentage,
    lastPriceDirection,
    lastPrice,
    buyPriceLevels,
    sellPriceLevels,
    maxCumulative
  } = useOrderBook(buyBids, sellBids);
  
  console.log("OrderBook rendering with:", { 
    buyLevels: Object.keys(buyPriceLevels).length, 
    sellLevels: Object.keys(sellPriceLevels).length,
    lastPrice
  });
  
  return (
    <Card className="w-full bg-background border border-border">
      <OrderBookHeader 
        spreadAmount={spreadAmount} 
        spreadPercentage={spreadPercentage} 
      />
      <CardContent className="p-0">
        {/* Price headers */}
        <div className="grid grid-cols-3 w-full text-[10px] uppercase font-semibold border-b border-border py-1.5 px-4">
          <div className="text-right pr-2">Amount (kWh)</div>
          <div className="text-center">Price (₹)</div>
          <div className="text-left pl-2">Total (kWh)</div>
        </div>
        
        <SellOrders 
          sellPriceLevels={sellPriceLevels} 
          maxCumulative={maxCumulative} 
        />
        
        <MarketPrice 
          lastPrice={lastPrice} 
          lastPriceDirection={lastPriceDirection} 
          spreadAmount={spreadAmount} 
        />
        
        <BuyOrders 
          buyPriceLevels={buyPriceLevels} 
          maxCumulative={maxCumulative} 
        />
        
        <OrderBookSummary 
          buyBidsLength={buyBids.length} 
          sellBidsLength={sellBids.length} 
        />
      </CardContent>
    </Card>
  );
};

export default OrderBook;
