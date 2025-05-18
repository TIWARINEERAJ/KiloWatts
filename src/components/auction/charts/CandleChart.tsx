
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, ReferenceArea } from "recharts";
import { ChartData } from "./types";
import { ChartTooltipContent } from "@/components/ui/chart";

interface CandleChartProps {
  data: ChartData[];
}

const CandleChartComponent = ({ data }: CandleChartProps) => {
  // Enhanced data for better visualization
  const enhancedData = data.map(item => {
    const bullish = item.close > item.open;
    return {
      ...item,
      bullish,
      bearish: !bullish,
      color: bullish ? "hsl(var(--chart-3))" : "hsl(var(--chart-4))",
      highLowLine: [item.low, item.high],
      openCloseLine: bullish ? [item.open, item.close] : [item.close, item.open]
    };
  });

  return (
    <div className="h-[300px] w-full p-2">
      <style>
        {`
          .bullish-candle {
            fill: hsl(var(--chart-3));
            stroke: hsl(var(--chart-3));
          }
          .bearish-candle {
            fill: hsl(var(--chart-4));
            stroke: hsl(var(--chart-4));
          }
        `}
      </style>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={enhancedData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
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
          <YAxis
            yAxisId="volume"
            orientation="right"
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}kW`}
            domain={['dataMin', 'dataMax']}
          />
          <Tooltip content={<ChartTooltipContent />} />
          
          {/* Vertical lines for high-low ranges */}
          {enhancedData.map((entry, index) => (
            <ReferenceArea
              key={`hl-${index}`}
              x1={index - 0.2}
              x2={index + 0.2}
              y1={entry.low}
              y2={entry.high}
              stroke={entry.color}
              strokeWidth={1.5}
              ifOverflow="extendDomain"
            />
          ))}
          
          {/* Candle bodies for open-close */}
          <Bar
            dataKey="bullish"
            barSize={12}
            className="bullish-candle"
            radius={[0, 0, 0, 0]}
            fillOpacity={0.8}
            yAxisId={0}
          />
          <Bar
            dataKey="bearish"
            barSize={12}
            className="bearish-candle"
            radius={[0, 0, 0, 0]}
            fillOpacity={0.8}
            yAxisId={0}
          />
          
          {/* Volume bars */}
          <Bar
            dataKey="buyVolume"
            name="Buy Volume"
            barSize={5}
            fill="hsl(var(--primary))"
            fillOpacity={0.5}
            yAxisId="volume"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="sellVolume"
            name="Sell Volume"
            barSize={5}
            fill="hsl(var(--secondary))"
            fillOpacity={0.5}
            yAxisId="volume"
            radius={[2, 2, 0, 0]}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CandleChartComponent;
