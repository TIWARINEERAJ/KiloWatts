
import PriceLevel from "./PriceLevel";

interface BuyOrdersProps {
  buyPriceLevels: Record<number, { total: number, cumulative: number }>;
  maxCumulative: number;
}

const BuyOrders = ({ buyPriceLevels, maxCumulative }: BuyOrdersProps) => {
  return (
    <div className="max-h-[180px] overflow-y-auto scrollbar-thin">
      {Object.keys(buyPriceLevels)
        .map(Number)
        .sort((a, b) => b - a)
        .map((price) => {
          const { total, cumulative } = buyPriceLevels[price];
          return (
            <PriceLevel 
              key={`buy-${price}`}
              price={price}
              total={total}
              cumulative={cumulative}
              maxCumulative={maxCumulative}
              isBuy={true}
            />
          );
        })}
    </div>
  );
};

export default BuyOrders;
