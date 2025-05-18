
import { ConsumerInputs, ProsumerInputs, ChartDataItem } from "./types";

export const defaultConsumerInputs: ConsumerInputs = {
  energyFromDiscom: 12000,
  p2pScheduled: 2800,
  energyFromP2P: 2800,
  contractedDemand: 20,
  energyRate: 8.75,
  demandRate: 450,
  wheelingRate: 0.92,
  transactionRate: 0.21,
  p2pPrice: 5,
};

export const defaultProsumerInputs: ProsumerInputs = {
  energyFromDiscom: 15000,
  p2pScheduled: 2800,
  energySoldToP2P: 2800,
  loadOnP2P: 20,
  energyRate: 8.75,
  demandRate: 450,
  wheelingRate: 0.92,
  transactionRate: 0.21,
  p2pPrice: 5,
};

// Chart data for the cost breakdown
export const costBreakdownData: ChartDataItem[] = [
  { name: "Discom Bill", amount: 114000, color: "#fb7185" },
  { name: "P2P Energy Cost", amount: 16100, color: "#3b82f6" },
  { name: "Wheeling Charges", amount: 2576, color: "#f97316" },
  { name: "Transaction Charges", amount: 588, color: "#8b5cf6" },
  { name: "Net Payable", amount: 131164, color: "#4ade80" },
];

// Chart data for benefit comparison
export const benefitComparisonData: ChartDataItem[] = [
  { name: "Without P2P", amount: 140000, color: "#fb7185" },
  { name: "With P2P", amount: 131164, color: "#3b82f6" },
  { name: "Benefit", amount: 8836, color: "#4ade80" },
];
