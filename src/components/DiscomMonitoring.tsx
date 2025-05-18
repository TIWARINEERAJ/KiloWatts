
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Activity, Users, Zap, TrendingUp, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Types
type DiscomMonitoringData = {
  id: string;
  discom_id: string;
  timestamp: string;
  total_energy_traded: number;
  active_users: number;
  active_contracts: number;
  grid_load_percentage: number;
  grid_stability_score: number;
  alerts: string[];
}

// Fetch function
const fetchDiscomData = async () => {
  const { data, error } = await supabase
    .from('discom_monitoring')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Error fetching DISCOM data:', error);
    throw error;
  }

  return data as DiscomMonitoringData[];
};

const DiscomMonitoring = () => {
  const [timeframe, setTimeframe] = useState('day');
  
  const { data: discomData = [], isLoading } = useQuery({
    queryKey: ['discomData'],
    queryFn: fetchDiscomData,
  });

  // Transform data for charts
  const chartData = discomData.map(item => ({
    timestamp: new Date(item.timestamp).toLocaleTimeString(),
    gridLoad: item.grid_load_percentage,
    stability: item.grid_stability_score,
    energyTraded: item.total_energy_traded / 1000, // Convert to MWh for better display
    activeUsers: item.active_users,
    activeContracts: item.active_contracts,
  })).reverse();

  // Get the latest data for the dashboard cards
  const latestData = discomData.length > 0 ? discomData[0] : null;

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">DISCOM Monitoring Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time grid oversight and energy trading statistics
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Dashboard Cards */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : latestData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Grid Load</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{latestData.grid_load_percentage.toFixed(1)}%</div>
                <div className="flex mt-2">
                  <Badge className={
                    latestData.grid_load_percentage < 60 ? "bg-green-100 text-green-800" :
                    latestData.grid_load_percentage < 80 ? "bg-amber-100 text-amber-800" :
                    "bg-red-100 text-red-800"
                  }>
                    {latestData.grid_load_percentage < 60 ? "Low" :
                     latestData.grid_load_percentage < 80 ? "Moderate" : "High"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Grid Stability</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{latestData.grid_stability_score.toFixed(1)}</div>
                <div className="flex mt-2">
                  <Badge className={
                    latestData.grid_stability_score >= 90 ? "bg-green-100 text-green-800" :
                    latestData.grid_stability_score >= 75 ? "bg-amber-100 text-amber-800" :
                    "bg-red-100 text-red-800"
                  }>
                    {latestData.grid_stability_score >= 90 ? "Excellent" :
                     latestData.grid_stability_score >= 75 ? "Good" : "Poor"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Energy Traded</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(latestData.total_energy_traded / 1000).toFixed(2)} MWh</div>
                <p className="text-xs text-muted-foreground">From {latestData.active_contracts} active contracts</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{latestData.active_users}</div>
                <p className="text-xs text-muted-foreground">Prosumers and consumers</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Alerts */}
          {latestData.alerts && latestData.alerts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Active Alerts</h2>
              <div className="space-y-3">
                {latestData.alerts.map((alert, index) => (
                  <Alert key={index} variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Grid Alert</AlertTitle>
                    <AlertDescription>{alert}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          )}
          
          {/* Charts */}
          <Tabs defaultValue="load" className="mb-8">
            <TabsList>
              <TabsTrigger value="load">Grid Load</TabsTrigger>
              <TabsTrigger value="stability">Grid Stability</TabsTrigger>
              <TabsTrigger value="trading">Energy Trading</TabsTrigger>
              <TabsTrigger value="users">Users & Contracts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="load" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grid Load Percentage</CardTitle>
                  <CardDescription>
                    Current and historical grid load measurements
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="gridLoad" stroke="#8884d8" name="Grid Load (%)" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stability" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grid Stability Score</CardTitle>
                  <CardDescription>
                    Stability metrics over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="stability" stroke="#82ca9d" name="Stability Score" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="trading" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Energy Traded (MWh)</CardTitle>
                  <CardDescription>
                    Volume of P2P energy transactions
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="energyTraded" fill="#3b82f6" name="Energy (MWh)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Users & Contracts</CardTitle>
                  <CardDescription>
                    Active platform users and energy contracts
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="activeUsers" stroke="#ff7300" name="Active Users" />
                      <Line type="monotone" dataKey="activeContracts" stroke="#387908" name="Active Contracts" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Grid Management Controls */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Grid Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Load Balancing</CardTitle>
                  <CardDescription>
                    Manage grid load distribution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Optimization Strategy:</label>
                      <Select defaultValue="balanced">
                        <SelectTrigger>
                          <SelectValue placeholder="Select strategy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="balanced">Balanced</SelectItem>
                          <SelectItem value="economic">Economic</SelectItem>
                          <SelectItem value="renewable">Renewable Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Limits</CardTitle>
                  <CardDescription>
                    Control energy trading parameters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Max Transaction Size:</label>
                      <Select defaultValue="500">
                        <SelectTrigger>
                          <SelectValue placeholder="Select limit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100">100 kWh</SelectItem>
                          <SelectItem value="500">500 kWh</SelectItem>
                          <SelectItem value="1000">1000 kWh</SelectItem>
                          <SelectItem value="unlimited">Unlimited</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Price Controls</CardTitle>
                  <CardDescription>
                    Set trading price limits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Price Range:</label>
                      <Select defaultValue="market">
                        <SelectTrigger>
                          <SelectValue placeholder="Select controls" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed (₹5-₹8/kWh)</SelectItem>
                          <SelectItem value="market">Market-driven</SelectItem>
                          <SelectItem value="regulated">Regulated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No monitoring data available</h3>
          <p className="text-muted-foreground">Check your connection to the DISCOM monitoring system</p>
        </div>
      )}
    </div>
  );
};

export default DiscomMonitoring;
