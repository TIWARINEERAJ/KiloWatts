
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import { ChartData } from "./types";
import { ChartTooltipContent } from "@/components/ui/chart";

interface AreaChartProps {
  data: ChartData[];
}

const AreaChartComponent = ({ data }: AreaChartProps) => {
  // Calculate average price for reference line
  const averagePrice = data.length > 0 
    ? (data.reduce((acc, item) => acc + item.price, 0) / data.length).toFixed(2) 
    : 0;
  
  // Calculate trend (first vs last price)
  const firstPrice = data.length > 0 ? data[0].price : 0;
  const lastPrice = data.length > 0 ? data[data.length - 1].price : 0;
  const priceChange = lastPrice - firstPrice;
  const trendColor = priceChange >= 0 ? "hsl(143, 85%, 58%)" : "hsl(358, 75%, 59%)";
  const gradientId = priceChange >= 0 ? "greenGradient" : "redGradient";
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
        <defs>
          <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(143, 85%, 58%)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="hsl(143, 85%, 58%)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(358, 75%, 59%)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="hsl(358, 75%, 59%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" vertical={false} />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} 
          tickLine={false}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          dy={5}
        />
        <YAxis 
          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} 
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value}`}
          dx={-5}
        />
        <Tooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="price"
          name="Price"
          stroke={trendColor}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={{ r: 2, strokeWidth: 0, fill: trendColor }}
          activeDot={{ r: 6, strokeWidth: 0, fill: trendColor }}
          animationDuration={1000}
        />
        <ReferenceLine 
          y={Number(averagePrice)} 
          stroke="hsl(var(--secondary))" 
          strokeDasharray="3 3" 
          label={{ 
            position: 'right',
            value: `Avg: ₹${averagePrice}`,
            fill: 'hsl(var(--secondary))',
            fontSize: 10
          }}
        />
        {/* Add trend reference line */}
        {data.length > 1 && (
          <ReferenceLine 
            segment={[
              { x: data[0].date, y: firstPrice },
              { x: data[data.length - 1].date, y: lastPrice }
            ]}
            stroke={trendColor}
            strokeWidth={1}
            strokeDasharray="5 5"
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartComponent;
