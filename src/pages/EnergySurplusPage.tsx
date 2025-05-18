
import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EnergySurplusForecast from "@/components/energy-surplus/EnergySurplusForecast";
import SurplusTradeOffers from "@/components/energy-surplus/SurplusTradeOffers";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchEnergyData } from "@/services/energyDataService";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const EnergySurplusPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("forecast");

  const { data: energyData, isLoading } = useQuery({
    queryKey: ["energyData", user?.id || "anonymous"],
    queryFn: () => fetchEnergyData(user?.id || "anonymous"),
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Energy Surplus Forecasting & Trading</h1>
            <p className="text-muted-foreground text-lg mb-8">
              You need to login to access this feature. Please sign in to view your energy forecasting data and trading options.
            </p>
            <Button asChild size="lg">
              <Link to="/auth">Sign In</Link>
            </Button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Energy Surplus Forecasting & Trading</h1>
          <p className="text-muted-foreground max-w-3xl">
            Forecast your surplus solar energy generation, analyze consumption patterns, and trade excess 
            energy on the peer-to-peer marketplace.
          </p>
        </motion.div>

        <Tabs defaultValue="forecast" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="forecast">Forecast & Surplus</TabsTrigger>
            <TabsTrigger value="trading">Trade Offers</TabsTrigger>
          </TabsList>
          
          {isLoading ? (
            <Card className="p-8 flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Loading energy data...</span>
            </Card>
          ) : (
            <>
              <TabsContent value="forecast" className="mt-0">
                <EnergySurplusForecast energyData={energyData} />
              </TabsContent>
              
              <TabsContent value="trading" className="mt-0">
                <SurplusTradeOffers energyData={energyData} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default EnergySurplusPage;
