
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EnergySettlementCalculator from "@/components/EnergySettlementCalculator";

const CalculatorPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50">
      <Navbar />
      <main className="flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto py-8"
        >
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4 gradient-text">P2P Energy Settlement Calculator</h1>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Calculate the financial details of your P2P energy transactions, including costs, benefits, 
              and potential savings for both prosumers and consumers.
            </p>
          </div>
          
          <EnergySettlementCalculator />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default CalculatorPage;
