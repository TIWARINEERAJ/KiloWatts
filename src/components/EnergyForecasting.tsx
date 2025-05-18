
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Sample data for demonstration purposes
const hourlyForecastData = [
  { hour: "00:00", production: 25, consumption: 42 },
  { hour: "01:00", production: 20, consumption: 35 },
  { hour: "02:00", production: 15, consumption: 30 },
  { hour: "03:00", production: 10, consumption: 28 },
  { hour: "04:00", production: 8, consumption: 27 },
  { hour: "05:00", production: 12, consumption: 29 },
  { hour: "06:00", production: 30, consumption: 35 },
  { hour: "07:00", production: 45, consumption: 60 },
  { hour: "08:00", production: 80, consumption: 85 },
  { hour: "09:00", production: 100, consumption: 95 },
  { hour: "10:00", production: 120, consumption: 105 },
  { hour: "11:00", production: 130, consumption: 110 },
  { hour: "12:00", production: 135, consumption: 115 },
  { hour: "13:00", production: 130, consumption: 120 },
  { hour: "14:00", production: 120, consumption: 125 },
  { hour: "15:00", production: 100, consumption: 130 },
  { hour: "16:00", production: 80, consumption: 125 },
  { hour: "17:00", production: 60, consumption: 120 },
  { hour: "18:00", production: 50, consumption: 115 },
  { hour: "19:00", production: 40, consumption: 100 },
  { hour: "20:00", production: 35, consumption: 90 },
  { hour: "21:00", production: 30, consumption: 80 },
  { hour: "22:00", production: 28, consumption: 70 },
  { hour: "23:00", production: 27, consumption: 55 },
];

const weeklyForecastData = [
  { day: "Mon", production: 800, consumption: 900, deviation: 11 },
  { day: "Tue", production: 820, consumption: 880, deviation: 7 },
  { day: "Wed", production: 850, consumption: 850, deviation: 0 },
  { day: "Thu", production: 830, consumption: 870, deviation: 5 },
  { day: "Fri", production: 790, consumption: 910, deviation: 15 },
  { day: "Sat", production: 750, consumption: 780, deviation: 4 },
  { day: "Sun", production: 720, consumption: 760, deviation: 5 },
];

const monthlyForecastData = [
  { month: "Jan", production: 24000, consumption: 25500 },
  { month: "Feb", production: 22000, consumption: 23800 },
  { month: "Mar", production: 26000, consumption: 25900 },
  { month: "Apr", production: 28000, consumption: 27200 },
  { month: "May", production: 29500, consumption: 28100 },
  { month: "Jun", production: 32000, consumption: 30000 },
  { month: "Jul", production: 34000, consumption: 32500 },
  { month: "Aug", production: 33000, consumption: 31800 },
  { month: "Sep", production: 31000, consumption: 30200 },
  { month: "Oct", production: 28500, consumption: 29000 },
  { month: "Nov", production: 26000, consumption: 27500 },
  { month: "Dec", production: 25000, consumption: 26200 },
];

type TimeframeType = "hourly" | "weekly" | "monthly";
type DataPointType = "production" | "consumption" | "both";

const EnergyForecasting: React.FC = () => {
  const [timeframe, setTimeframe] = useState<TimeframeType>("hourly");
  const [dataPoint, setDataPoint] = useState<DataPointType>("both");
  const [confidenceLevel, setConfidenceLevel] = useState<number>(85);
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);

  // Function to get appropriate data based on timeframe
  const getData = () => {
    switch (timeframe) {
      case "hourly":
        return hourlyForecastData;
      case "weekly":
        return weeklyForecastData;
      case "monthly":
        return monthlyForecastData;
      default:
        return hourlyForecastData;
    }
  };

  // Function to get appropriate x-axis key
  const getXAxisKey = () => {
    switch (timeframe) {
      case "hourly":
        return "hour";
      case "weekly":
        return "day";
      case "monthly":
        return "month";
      default:
        return "hour";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Energy Forecasting</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Energy Production Forecast</CardTitle>
            <CardDescription>Predicted energy generation for your assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary mb-2">1,245 kWh</div>
            <div className="text-sm text-muted-foreground">Forecasted for tomorrow</div>
            <div className="flex items-center mt-2">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-green-600">+5.2% from today</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consumption Forecast</CardTitle>
            <CardDescription>Predicted energy usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-secondary mb-2">1,420 kWh</div>
            <div className="text-sm text-muted-foreground">Expected for tomorrow</div>
            <div className="flex items-center mt-2">
              <div className="h-2 w-2 rounded-full bg-rose-500 mr-2"></div>
              <span className="text-sm text-rose-600">+3.8% from today</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Forecast Accuracy</CardTitle>
            <CardDescription>Confidence score of predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-accent mb-2">87.5%</div>
            <div className="text-sm text-muted-foreground">Average accuracy over 30 days</div>
            <div className="flex items-center mt-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm text-blue-600">+2.1% improvement</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Energy Forecast Visualization</CardTitle>
            <CardDescription>View production and consumption forecasts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-4">
              <Button
                variant={timeframe === "hourly" ? "default" : "outline"}
                onClick={() => setTimeframe("hourly")}
              >
                Hourly
              </Button>
              <Button
                variant={timeframe === "weekly" ? "default" : "outline"}
                onClick={() => setTimeframe("weekly")}
              >
                Weekly
              </Button>
              <Button
                variant={timeframe === "monthly" ? "default" : "outline"}
                onClick={() => setTimeframe("monthly")}
              >
                Monthly
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
              <Button
                variant={dataPoint === "production" ? "default" : "outline"}
                onClick={() => setDataPoint("production")}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Production
              </Button>
              <Button
                variant={dataPoint === "consumption" ? "default" : "outline"}
                onClick={() => setDataPoint("consumption")}
                className="bg-rose-500 hover:bg-rose-600 text-white"
              >
                Consumption
              </Button>
              <Button
                variant={dataPoint === "both" ? "default" : "outline"}
                onClick={() => setDataPoint("both")}
              >
                Both
              </Button>
            </div>

            <div className="h-80">
              <ChartContainer
                config={{
                  production: { color: "#4ade80" }, // green-500
                  consumption: { color: "#fb7185" }, // rose-400
                }}
              >
                {timeframe === "weekly" ? (
                  <BarChart data={getData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={getXAxisKey()} />
                    <YAxis />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                    <Legend />
                    {(dataPoint === "production" || dataPoint === "both") && (
                      <Bar
                        dataKey="production"
                        name="Production"
                        fill="#4ade80"
                      />
                    )}
                    {(dataPoint === "consumption" || dataPoint === "both") && (
                      <Bar
                        dataKey="consumption"
                        name="Consumption"
                        fill="#fb7185"
                      />
                    )}
                  </BarChart>
                ) : (
                  <LineChart data={getData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={getXAxisKey()} />
                    <YAxis />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                    <Legend />
                    {(dataPoint === "production" || dataPoint === "both") && (
                      <Line
                        type="monotone"
                        dataKey="production"
                        name="Production"
                        stroke="#4ade80"
                        activeDot={{ r: 8 }}
                      />
                    )}
                    {(dataPoint === "consumption" || dataPoint === "both") && (
                      <Line
                        type="monotone"
                        dataKey="consumption"
                        name="Consumption"
                        stroke="#fb7185"
                        activeDot={{ r: 8 }}
                      />
                    )}
                  </LineChart>
                )}
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Forecast Settings</CardTitle>
            <CardDescription>Adjust parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="date">Forecast Date</Label>
                <Input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="confidence">Confidence Level: {confidenceLevel}%</Label>
                <Slider
                  id="confidence"
                  value={[confidenceLevel]}
                  min={50}
                  max={99}
                  step={1}
                  onValueChange={(value) => setConfidenceLevel(value[0])}
                  className="mt-2"
                />
              </div>

              <Button className="w-full">Update Forecast</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weather Factors</CardTitle>
            <CardDescription>Weather conditions affecting forecasts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Solar Irradiance</span>
                <span className="font-medium">6.2 kWh/m²</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Wind Speed</span>
                <span className="font-medium">12 km/h</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Temperature</span>
                <span className="font-medium">24°C</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Cloud Cover</span>
                <span className="font-medium">15%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Factors</CardTitle>
            <CardDescription>Market conditions affecting forecasts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Peak Grid Demand</span>
                <span className="font-medium">82%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Average Energy Price</span>
                <span className="font-medium">₹8.75/kWh</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Demand Response Events</span>
                <span className="font-medium">None Predicted</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Grid Stability</span>
                <span className="font-medium">High</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnergyForecasting;
