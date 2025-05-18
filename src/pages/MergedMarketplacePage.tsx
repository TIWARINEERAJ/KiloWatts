
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Marketplace from "@/components/Marketplace";
import DoubleAuctionInterface from "@/components/auction/DoubleAuctionInterface";
import SmartContractsManagement from "@/components/SmartContractsManagement";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
import { motion } from "framer-motion";

const MergedMarketplacePage = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<string>(tabParam || 'marketplace');
  
  const {
    walletAddress,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet
  } = useWalletConnection();

  useEffect(() => {
    // Update active tab when URL params change
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  
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
            <MarketplaceHeader 
              walletAddress={walletAddress}
              isConnected={isConnected}
              isConnecting={isConnecting}
              connectWallet={connectWallet}
              disconnectWallet={disconnectWallet}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/50 backdrop-blur-sm dark:bg-slate-800/50 p-1 rounded-xl shadow-sm">
                <TabsTrigger value="marketplace" className="rounded-lg text-sm font-medium">Energy Marketplace</TabsTrigger>
                <TabsTrigger value="auction" className="rounded-lg text-sm font-medium">Auction Trading</TabsTrigger>
                <TabsTrigger value="blockchain" className="rounded-lg text-sm font-medium">Blockchain Integration</TabsTrigger>
              </TabsList>
              
              <TabsContent value="marketplace" className="mt-0">
                <Marketplace />
              </TabsContent>
              
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

export default MergedMarketplacePage;
