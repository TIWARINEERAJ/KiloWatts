
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import EnergyMarketplacePage from "./pages/EnergyMarketplacePage";
import AuctionTradingPage from "./pages/AuctionTradingPage";
import TransactionsPage from "./pages/TransactionsPage";
import NotFound from "./pages/NotFound";
import DiscomPage from "./pages/DiscomPage";
import ForecastingPage from "./pages/ForecastingPage";
import CalculatorPage from "./pages/CalculatorPage";
import EnergySurplusPage from "./pages/EnergySurplusPage";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/energy-marketplace" element={<EnergyMarketplacePage />} />
              <Route path="/auction-trading" element={<AuctionTradingPage />} />
              <Route path="/transactions" element={
                <ProtectedRoute>
                  <TransactionsPage />
                </ProtectedRoute>
              } />
              <Route path="/discom" element={
                <ProtectedRoute>
                  <DiscomPage />
                </ProtectedRoute>
              } />
              <Route path="/forecasting" element={
                <ProtectedRoute>
                  <ForecastingPage />
                </ProtectedRoute>
              } />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/energy-surplus" element={<EnergySurplusPage />} />
              
              {/* Redirect old routes */}
              <Route path="/marketplace" element={<Navigate to="/energy-marketplace" replace />} />
              <Route path="/about" element={<Navigate to="/" replace />} />
              <Route path="/smart-contracts" element={<Navigate to="/auction-trading?tab=blockchain" replace />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
