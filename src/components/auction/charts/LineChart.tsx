
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, ReferenceLine } from "recharts";
import { ChartData } from "./types";
import { ChartTooltipContent } from "@/components/ui/chart";

interface LineChartProps {
  data: ChartData[];
}

const LineChartComponent = ({ data }: LineChartProps) => {
  // Calculate average price for reference line
  const averagePrice = data.length > 0 
    ? (data.reduce((acc, item) => acc + item.price, 0) / data.length).toFixed(2) 
    : 0;
    
  // Calculate trend (first vs last price)
  const firstPrice = data.length > 0 ? data[0].price : 0;
  const lastPrice = data.length > 0 ? data[data.length - 1].price : 0;
  const priceChange = lastPrice - firstPrice;
  const trendColor = priceChange >= 0 ? "hsl(143, 85%, 58%)" : "hsl(358, 75%, 59%)";
    
  console.log("LineChart rendering with data:", data.length, "points");

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
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
        <Line
          type="monotone"
          dataKey="price"
          name="Price"
          stroke={trendColor}
          strokeWidth={2.5}
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
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
