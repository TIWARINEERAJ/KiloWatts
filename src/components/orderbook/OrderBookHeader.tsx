
import { ChartBar } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface OrderBookHeaderProps {
  spreadAmount: number | null;
  spreadPercentage: number | null;
}

const OrderBookHeader = ({ spreadAmount, spreadPercentage }: OrderBookHeaderProps) => {
  return (
    <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
      <div className="flex items-center gap-2">
        <ChartBar className="h-4 w-4 text-muted-foreground" />
        <CardTitle className="text-sm font-medium">Order Book</CardTitle>
      </div>
      {spreadAmount !== null && (
        <div className="text-xs font-normal text-muted-foreground">
          Spread: ₹{spreadAmount.toFixed(2)} ({spreadPercentage?.toFixed(2)}%)
        </div>
      )}
    </CardHeader>
  );
};

export default OrderBookHeader;
