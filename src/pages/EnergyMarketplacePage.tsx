
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Marketplace from "@/components/Marketplace";
import { motion } from "framer-motion";

const EnergyMarketplacePage = () => {
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
            <h1 className="text-3xl font-bold mb-6">Energy Marketplace</h1>
            <p className="text-muted-foreground mb-8 max-w-3xl">
              Browse and trade various energy offers from local producers. Filter by source, price, and proximity to find the perfect energy match for your needs.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Marketplace />
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EnergyMarketplacePage;
