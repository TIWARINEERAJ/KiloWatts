
export type CalculatorType = "prosumerNoImbalance" | "prosumerUnderInjection" | "prosumerOverInjection" | "consumerNoImbalance" | "consumerUnderdrawal" | "consumerOverdrawal";

export interface ConsumerInputs {
  energyFromDiscom: number;
  p2pScheduled: number;
  energyFromP2P: number;
  contractedDemand: number;
  energyRate: number;
  demandRate: number;
  wheelingRate: number;
  transactionRate: number;
  p2pPrice: number;
}

export interface ProsumerInputs {
  energyFromDiscom: number;
  p2pScheduled: number;
  energySoldToP2P: number;
  loadOnP2P: number;
  energyRate: number;
  demandRate: number;
  wheelingRate: number;
  transactionRate: number;
  p2pPrice: number;
}

export interface SettlementResult {
  discomBill: {
    energyCharges: number;
    demandCharges: number;
    total: number;
  };
  p2pBill: {
    energyPayableOrReceivable: number;
    imbalanceCharges: number;
    wheelingCharges: number;
    transactionCharges: number;
    totalPayableToDiscom: number;
    totalPayableOrReceivableForP2P: number;
    transactionChargesPayable: number;
    netAmountPayable: number;
  };
}

export interface ChartDataItem {
  name: string;
  amount: number;
  color: string;
}
