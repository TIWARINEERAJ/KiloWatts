import { useState, useMemo } from "react";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ReferenceLine, Area, AreaChart, ComposedChart
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { EnergyData, createTradeOffer } from "@/services/energyDataService";
import { useAuth } from "@/contexts/AuthContext";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface EnergySurplusForecastProps {
  energyData?: EnergyData;
}

const EnergySurplusForecast = ({ energyData }: EnergySurplusForecastProps) => {
  const { user } = useAuth();
  const [isCreateOfferOpen, setIsCreateOfferOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<[number, number]>([10, 14]); // Default 10 AM to 2 PM
  const [pricePerUnit, setPricePerUnit] = useState<number>(4.5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const chartConfig = {
    generation: {
      label: "Generation",
      theme: {
        dark: "#3b82f6",
        light: "#3b82f6", 
      },
    },
    consumption: {
      label: "Consumption",
      theme: {
        dark: "#ef4444",
        light: "#ef4444",
      },
    },
    surplus: {
      label: "Surplus",
      theme: {
        dark: "#10b981",
        light: "#10b981",
      },
    },
  };

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.getHours() + ":00";
  };

  const chartData = useMemo(() => {
    if (!energyData?.forecastData) return [];
    
    return energyData.forecastData.map(point => ({
      time: formatTime(point.timestamp),
      hour: new Date(point.timestamp).getHours(),
      generation: point.generation.toFixed(2),
      consumption: point.consumption.toFixed(2),
      surplus: point.surplus.toFixed(2)
    }));
  }, [energyData]);

  const surplusData = useMemo(() => {
    if (!chartData) return [];
    return chartData.filter(d => parseFloat(d.surplus) > 0);
  }, [chartData]);

  const totalSurplus = useMemo(() => {
    if (!surplusData.length) return 0;
    return surplusData.reduce((sum, data) => sum + parseFloat(data.surplus), 0);
  }, [surplusData]);

  const selectedRangeSurplus = useMemo(() => {
    if (!chartData) return 0;
    const [startHour, endHour] = selectedTimeRange;
    
    return chartData
      .filter(d => d.hour >= startHour && d.hour < endHour)
      .reduce((sum, d) => sum + Math.max(0, parseFloat(d.surplus)), 0);
  }, [chartData, selectedTimeRange]);

  const potentialEarnings = useMemo(() => {
    return selectedRangeSurplus * pricePerUnit;
  }, [selectedRangeSurplus, pricePerUnit]);

  const handleRangeChange = (value: number[]) => {
    setSelectedTimeRange([value[0], value[1]]);
  };

  const handleCreateOffer = async () => {
    if (!user) {
      toast.error("You must be logged in to create offers.");
      return;
    }

    if (selectedRangeSurplus <= 0) {
      toast.error("No surplus energy available in the selected time range.");
      return;
    }

    setIsSubmitting(true);

    try {
      const [startHour, endHour] = selectedTimeRange;
      const timeWindow = `${startHour}:00 - ${endHour}:00`;
      
      await createTradeOffer({
        userId: user.id,
        date: new Date().toISOString().split("T")[0],
        timeWindow,
        surplusAmount: selectedRangeSurplus,
        pricePerUnit,
        status: 'OPEN'
      });
      
      toast.success("Trade offer created successfully!");
      setIsCreateOfferOpen(false);
    } catch (error) {
      console.error("Error creating trade offer:", error);
      toast.error("Failed to create trade offer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!energyData) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Generation</CardTitle>
            <CardDescription>Solar energy being produced now</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {energyData.currentGeneration.toFixed(2)} kWh
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Consumption</CardTitle>
            <CardDescription>Energy being used right now</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              {energyData.currentLoad.toFixed(2)} kWh
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Today's Surplus</CardTitle>
            <CardDescription>Total excess energy forecast</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              {totalSurplus.toFixed(2)} kWh
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>24-Hour Energy Forecast</CardTitle>
          <CardDescription>
            Projected generation, consumption, and surplus energy
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="50%" height="50%">
                <ComposedChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }} data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="time" />
                  <YAxis unit=" kWh" />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="generation" 
                    stroke="var(--color-generation)" 
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="consumption" 
                    stroke="var(--color-consumption)"
                    strokeWidth={2} 
                  />
                  <Area
                    type="monotone"
                    dataKey="surplus"
                    fill="var(--color-surplus)"
                    stroke="var(--color-surplus)"
                    fillOpacity={0.3}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Surplus Trading Potential</CardTitle>
            <CardDescription>
              Create an offer to sell your excess energy
            </CardDescription>
          </div>
          <Dialog open={isCreateOfferOpen} onOpenChange={setIsCreateOfferOpen}>
            <DialogTrigger asChild>
              <Button>Create Trade Offer</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Energy Trade Offer</DialogTitle>
                <DialogDescription>
                  Set your time window and price for trading surplus energy.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Selected Time Window: {selectedTimeRange[0]}:00 - {selectedTimeRange[1]}:00</Label>
                  <Slider
                    defaultValue={[selectedTimeRange[0], selectedTimeRange[1]]}
                    min={0}
                    max={24}
                    step={1}
                    value={[selectedTimeRange[0], selectedTimeRange[1]]}
                    onValueChange={handleRangeChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price per kWh (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    min={1}
                    max={10}
                    step={0.25}
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(parseFloat(e.target.value))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Available Surplus</Label>
                    <div className="text-xl font-medium">{selectedRangeSurplus.toFixed(2)} kWh</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Potential Earnings</Label>
                    <div className="text-xl font-medium">₹{potentialEarnings.toFixed(2)}</div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  onClick={handleCreateOffer}
                  disabled={isSubmitting || selectedRangeSurplus <= 0}
                >
                  {isSubmitting ? "Creating..." : "Create Offer"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }} data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="time" />
                  <YAxis unit=" kWh" />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <ReferenceLine y={0} stroke="#666" />
                  <Bar dataKey="surplus" name="Surplus (kWh)" fill="var(--color-surplus)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Best Trading Window:</span>
              <span className="font-medium">10:00 - 14:00 (Peak Generation)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Tradable Surplus:</span>
              <span className="font-medium">{totalSurplus.toFixed(2)} kWh</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Recommended Price:</span>
              <span className="font-medium">₹4.25 - ₹4.75 per kWh</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnergySurplusForecast;
