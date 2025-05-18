
import PriceLevel from "./PriceLevel";

interface SellOrdersProps {
  sellPriceLevels: Record<number, { total: number, cumulative: number }>;
  maxCumulative: number;
}

const SellOrders = ({ sellPriceLevels, maxCumulative }: SellOrdersProps) => {
  return (
    <div className="max-h-[180px] overflow-y-auto scrollbar-thin">
      {Object.keys(sellPriceLevels)
        .map(Number)
        .sort((a, b) => b - a)
        .map((price) => {
          const { total, cumulative } = sellPriceLevels[price];
          return (
            <PriceLevel 
              key={`sell-${price}`}
              price={price}
              total={total}
              cumulative={cumulative}
              maxCumulative={maxCumulative}
              isBuy={false}
            />
          );
        })}
    </div>
  );
};

export default SellOrders;
