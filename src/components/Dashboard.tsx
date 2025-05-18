
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchEnergyListings, fetchAuctionListings, fetchTimeOfDayListings } from './marketplace/api';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Bolt, Wind, Sun } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [energyStats, setEnergyStats] = useState({
    availableEnergy: 0, // Changed from string to number
    activeTrades: 0,
    revenue: 0,
    changePercentage: 0,
    pendingApprovals: 0,
    lastMonthRevenue: 0
  });
  
  // Use React Query to fetch marketplace data
  const { data: energyListings = [] } = useQuery({
    queryKey: ['energyListings'],
    queryFn: fetchEnergyListings,
  });

  const { data: auctionListings = [] } = useQuery({
    queryKey: ['auctionListings'],
    queryFn: fetchAuctionListings,
  });

  const { data: timeOfDayListings = [] } = useQuery({
    queryKey: ['timeOfDayListings'],
    queryFn: fetchTimeOfDayListings,
  });
  
  const { data: transactions = [] } = useQuery({
    queryKey: ['recentTransactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auction_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) {
        console.error("Error fetching transactions:", error);
        return [];
      }
      return data;
    }
  });

  // Calculate energy production data based on time of day
  const generateEnergyProductionData = () => {
    const hours = [
      '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', 
      '2PM', '3PM', '4PM', '5PM', '6PM'
    ];
    
    return hours.map(hour => {
      // Base solar pattern: peaks at midday
      let solarFactor = 0;
      const hourNum = parseInt(hour.replace(/[^\d]/g, ''));
      
      if (hour.includes('AM')) {
        // Morning ramp up
        solarFactor = (hourNum - 7) / 5;
      } else {
        // Afternoon ramp down
        solarFactor = 1 - ((hourNum - 12) / 7);
      }
      
      // Wind is typically more steady
      const windFactor = 0.3 + (Math.random() * 0.4);
      
      // Use listing counts to scale the values
      const listingFactor = (energyListings.length + auctionListings.length) / 20;
      const scaleFactor = Math.max(0.5, Math.min(listingFactor, 2));
      
      // Calculate values
      const solar = Math.round(55 * solarFactor * scaleFactor);
      const wind = Math.round(16 * windFactor * scaleFactor);
      const total = solar + wind;
      
      return { name: hour, solar, wind, total };
    });
  };
  
  // Trading activity data based on auction history
  const generateTradingActivityData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    // Calculate a factor based on the number of listings
    const activityFactor = (energyListings.length + auctionListings.length) / 15;
    
    return months.map((month, index) => {
      // Increase activity over time
      const growthFactor = 1 + (index * 0.15);
      
      // Base values
      let soldBase = 40 + (index * 7);
      let boughtBase = 30 + (index * 5);
      
      // Scale by activity factor
      const sold = Math.round(soldBase * growthFactor * activityFactor);
      const bought = Math.round(boughtBase * growthFactor * activityFactor);
      
      return { month, sold, bought };
    });
  };
  
  // Energy mix data based on energy sources in listings
  const calculateEnergyMix = () => {
    // Count energy sources across all listings
    const sourceCounts = {
      solar: 0,
      wind: 0,
      biomass: 0,
      hydro: 0
    };
    
    // Count from fixed price listings
    energyListings.forEach(listing => {
      const source = listing.source.toLowerCase();
      if (source.includes('solar')) sourceCounts.solar++;
      else if (source.includes('wind')) sourceCounts.wind++;
      else if (source.includes('biomass')) sourceCounts.biomass++;
      else if (source.includes('hydro')) sourceCounts.hydro++;
    });
    
    // Count from auction listings
    auctionListings.forEach(listing => {
      const source = listing.source.toLowerCase();
      if (source.includes('solar')) sourceCounts.solar++;
      else if (source.includes('wind')) sourceCounts.wind++;
      else if (source.includes('biomass')) sourceCounts.biomass++;
      else if (source.includes('hydro')) sourceCounts.hydro++;
    });
    
    // Count from time of day listings
    timeOfDayListings.forEach(listing => {
      const source = listing.source.toLowerCase();
      if (source.includes('solar')) sourceCounts.solar++;
      else if (source.includes('wind')) sourceCounts.wind++;
      else if (source.includes('biomass')) sourceCounts.biomass++;
      else if (source.includes('hydro')) sourceCounts.hydro++;
    });
    
    // Default values if no data
    if (Object.values(sourceCounts).reduce((a, b) => a + b, 0) === 0) {
      return [
        { name: 'Solar', value: 60, color: '#f97316' },
        { name: 'Wind', value: 25, color: '#0ea5e9' },
        { name: 'Biomass', value: 10, color: '#10b981' },
        { name: 'Hydro', value: 5, color: '#3b82f6' },
      ];
    }
    
    // Calculate percentages
    const total = Object.values(sourceCounts).reduce((a, b) => a + b, 0);
    
    return [
      { name: 'Solar', value: Math.round((sourceCounts.solar / total) * 100) || 5, color: '#f97316' },
      { name: 'Wind', value: Math.round((sourceCounts.wind / total) * 100) || 5, color: '#0ea5e9' },
      { name: 'Biomass', value: Math.round((sourceCounts.biomass / total) * 100) || 5, color: '#10b981' },
      { name: 'Hydro', value: Math.round((sourceCounts.hydro / total) * 100) || 5, color: '#3b82f6' },
    ];
  };
  
  // Format transaction data
  const formatTransactions = () => {
    if (!transactions || transactions.length === 0) {
      // Fallback sample data
      return [
        { id: '1', buyer: 'Consumer A', amount: '35 kWh', price: '₹7.20/kWh', time: '10:23 AM', status: 'Completed', total: '₹252.00' },
        { id: '2', buyer: 'Consumer B', amount: '42 kWh', price: '₹7.15/kWh', time: '09:45 AM', status: 'Pending', total: '₹300.30' },
        { id: '3', buyer: 'Consumer C', amount: '28 kWh', price: '₹7.25/kWh', time: '09:12 AM', status: 'Completed', total: '₹203.00' },
        { id: '4', buyer: 'Consumer D', amount: '50 kWh', price: '₹7.10/kWh', time: '08:34 AM', status: 'Completed', total: '₹355.00' },
      ];
    }
    
    return transactions.map(tx => {
      const date = new Date(tx.created_at);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const time = `${formattedHours}:${formattedMinutes} ${ampm}`;
      
      return {
        id: tx.id,
        buyer: tx.buyer_address ? tx.buyer_address.substring(0, 6) + '...' : 'Unknown',
        amount: `${tx.quantity} kWh`,
        price: `₹${tx.price.toFixed(2)}/kWh`,
        time: time,
        status: tx.status.charAt(0).toUpperCase() + tx.status.slice(1),
        total: `₹${tx.total_value.toFixed(2)}`
      };
    });
  };
  
  // Calculate energy stats
  useEffect(() => {
    // Calculate available energy from listings
    const availableEnergy = energyListings.reduce((sum, listing) => {
      const amount = parseFloat(listing.amount.replace(/[^\d.]/g, ''));
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    
    // Count active trades/auctions
    const activeTrades = energyListings.length + auctionListings.length + timeOfDayListings.length;
    
    // Calculate revenue from transactions
    const revenue = transactions?.reduce((sum, tx) => sum + (tx.total_value || 0), 0) || 0;
    
    // Simulate last month revenue for change calculation
    const lastMonthRevenue = revenue * 0.92; // Assume 8% growth
    const changePercentage = lastMonthRevenue > 0 
      ? ((revenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;
    
    // Simulate pending approvals
    const pendingApprovals = Math.round(activeTrades * 0.25);
    
    setEnergyStats({
      availableEnergy, // now storing as a number, not a string
      activeTrades,
      revenue,
      changePercentage,
      pendingApprovals,
      lastMonthRevenue
    });
  }, [energyListings, auctionListings, timeOfDayListings, transactions]);

  // Generate data for charts
  const energyProductionData = generateEnergyProductionData();
  const tradingActivityData = generateTradingActivityData();
  const energyMixData = calculateEnergyMix();
  const recentTransactions = formatTransactions();

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Energy Trading Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your energy production, consumption, and trading activity.
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button variant="outline">Export Data</Button>
          <Button asChild>
            <Link to="/marketplace">New Trade</Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Available Energy</CardTitle>
            <CardDescription>Current stored energy for trading</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{energyStats.availableEnergy.toFixed(1)} kWh</div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on {energyListings.length} active listings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Trades</CardTitle>
            <CardDescription>Current ongoing energy trades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{energyStats.activeTrades}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {energyStats.pendingApprovals} pending approvals
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Revenue (30 days)</CardTitle>
            <CardDescription>Total earnings from energy sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">₹{energyStats.revenue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {energyStats.changePercentage > 0 ? '+' : ''}{energyStats.changePercentage.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Daily Energy Production</CardTitle>
            <CardDescription>Solar and wind generation (kWh)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={energyProductionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="solar" stroke="#f97316" strokeWidth={2} />
                  <Line type="monotone" dataKey="wind" stroke="#0ea5e9" strokeWidth={2} />
                  <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Monthly Trading Activity</CardTitle>
            <CardDescription>Energy sold vs. bought (kWh)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tradingActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sold" fill="#10b981" />
                  <Bar dataKey="bought" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Energy Mix</CardTitle>
            <CardDescription>Sources of generated energy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={energyMixData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {energyMixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-4 gap-4">
              {energyMixData.map((source, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }}></div>
                  <span className="text-xs">{source.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest energy trading activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">Buyer</th>
                    <th className="text-left py-3 px-2 font-medium">Amount</th>
                    <th className="text-left py-3 px-2 font-medium">Rate</th>
                    <th className="text-left py-3 px-2 font-medium">Time</th>
                    <th className="text-left py-3 px-2 font-medium">Status</th>
                    <th className="text-right py-3 px-2 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2">{tx.buyer}</td>
                      <td className="py-3 px-2">{tx.amount}</td>
                      <td className="py-3 px-2">{tx.price}</td>
                      <td className="py-3 px-2">{tx.time}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          tx.status === 'Completed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-medium">{tx.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
