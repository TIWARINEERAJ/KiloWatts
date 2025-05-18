
import { supabase } from "@/integrations/supabase/client";

export interface EnergyDataPoint {
  timestamp: string;
  generation: number;
  consumption: number;
  surplus: number;
}

export interface TradeOffer {
  id: string;
  userId: string;
  date: string;
  timeWindow: string;
  surplusAmount: number;
  pricePerUnit: number;
  status: 'OPEN' | 'CLOSED' | 'WITHDRAWN';
  createdAt: string;
}

export interface EnergyData {
  currentLoad: number;
  currentGeneration: number;
  forecastData: EnergyDataPoint[];
  tradeOffers: TradeOffer[];
}

// Mock data for demonstration - in a real app, this would fetch from an actual API or database
export const fetchEnergyData = async (userId?: string): Promise<EnergyData> => {
  console.log("Fetching energy data for user:", userId);
  
  try {
    // In a real implementation, you would fetch this data from your EMS API or database
    // For now, we'll generate mock data for demonstration
    
    const today = new Date();
    const forecastData: EnergyDataPoint[] = [];
    
    // Generate 24 hours of forecast data
    for (let i = 0; i < 24; i++) {
      const hour = i;
      const timestamp = new Date(today);
      timestamp.setHours(hour, 0, 0, 0);
      
      // Create realistic generation curve (peaks during midday)
      const baseGeneration = hour >= 7 && hour <= 18 ? 
        10 * Math.sin(Math.PI * (hour - 7) / 11) : 0;
      
      // Create realistic consumption curve (peaks in morning and evening)
      const baseConsumption = 0.5 + 
        (hour >= 6 && hour <= 9 ? 1.5 : 0) +   // Morning peak
        (hour >= 18 && hour <= 21 ? 2 : 0);    // Evening peak
        
      const generation = Math.max(0, baseGeneration + (Math.random() * 0.5 - 0.25));
      const consumption = Math.max(0, baseConsumption + (Math.random() * 0.4 - 0.2));
      const surplus = Math.max(0, generation - consumption);
      
      forecastData.push({
        timestamp: timestamp.toISOString(),
        generation,
        consumption,
        surplus,
      });
    }
    
    // In the future, you would fetch actual trade offers from your database
    const mockTradeOffers: TradeOffer[] = [
      {
        id: "offer-1",
        userId: userId || "user-1",
        date: today.toISOString().split("T")[0],
        timeWindow: "10:00 - 14:00",
        surplusAmount: 3.2,
        pricePerUnit: 4.50,
        status: 'OPEN',
        createdAt: new Date(today.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "offer-2",
        userId: userId || "user-1",
        date: today.toISOString().split("T")[0],
        timeWindow: "12:00 - 15:00",
        surplusAmount: 2.8,
        pricePerUnit: 4.25,
        status: 'CLOSED',
        createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    return {
      currentLoad: forecastData[new Date().getHours()]?.consumption || 0,
      currentGeneration: forecastData[new Date().getHours()]?.generation || 0,
      forecastData,
      tradeOffers: mockTradeOffers
    };
  } catch (error) {
    console.error("Error fetching energy data:", error);
    throw error;
  }
};

export const createTradeOffer = async (offerData: Omit<TradeOffer, 'id' | 'createdAt'>): Promise<TradeOffer> => {
  console.log("Creating trade offer:", offerData);
  
  // In a real implementation, you would save this to your database
  const newOffer: TradeOffer = {
    ...offerData,
    id: `offer-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return newOffer;
};

export const updateTradeOffer = async (offerId: string, status: 'OPEN' | 'CLOSED' | 'WITHDRAWN'): Promise<void> => {
  console.log(`Updating trade offer ${offerId} to status: ${status}`);
  
  // In a real implementation, you would update this in your database
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
};
