
interface OrderBookSummaryProps {
  buyBidsLength: number;
  sellBidsLength: number;
}

const OrderBookSummary = ({ buyBidsLength, sellBidsLength }: OrderBookSummaryProps) => {
  return (
    <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground flex justify-between">
      <span>Buy Orders: {buyBidsLength}</span>
      <span>Sell Orders: {sellBidsLength}</span>
    </div>
  );
};

export default OrderBookSummary;
