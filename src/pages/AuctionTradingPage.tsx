
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DoubleAuctionInterface from "@/components/auction/DoubleAuctionInterface";
import SmartContractsManagement from "@/components/SmartContractsManagement";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "framer-motion";

const AuctionTradingPage = () => {
  const [activeTab, setActiveTab] = useState<string>('auction');
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-6">Auction Trading Platform</h1>
            <p className="text-muted-foreground mb-8 max-w-3xl">
              Trade energy using our advanced auction mechanisms and blockchain integration. 
              Monitor real-time price movements and execute trades securely.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/50 backdrop-blur-sm dark:bg-slate-800/50 p-1 rounded-xl shadow-sm">
                <TabsTrigger value="auction" className="rounded-lg text-sm font-medium">Double Auction</TabsTrigger>
                <TabsTrigger value="blockchain" className="rounded-lg text-sm font-medium">Blockchain Integration</TabsTrigger>
              </TabsList>
              
              <TabsContent value="auction" className="mt-0">
                <ProtectedRoute>
                  <DoubleAuctionInterface />
                </ProtectedRoute>
              </TabsContent>
              
              <TabsContent value="blockchain" className="mt-0">
                <ProtectedRoute>
                  <SmartContractsManagement />
                </ProtectedRoute>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuctionTradingPage;
