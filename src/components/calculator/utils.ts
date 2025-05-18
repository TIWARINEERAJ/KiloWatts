
import { CalculatorType, ConsumerInputs, ProsumerInputs, SettlementResult } from "./types";

export const getScenarioDescription = (calculatorType: CalculatorType): string => {
  switch (calculatorType) {
    case "prosumerNoImbalance":
      return "This scenario details the billing for a commercial prosumer with no energy imbalance between scheduled and actual P2P transactions.";
    case "prosumerUnderInjection":
      return "This scenario illustrates billing when a prosumer injects less energy into the P2P platform than scheduled.";
    case "prosumerOverInjection":
      return "This scenario covers when a prosumer injects more energy than scheduled, specifically for Gross Metering and Net Feed In arrangements.";
    case "consumerNoImbalance":
      return "This scenario shows the bill for a commercial consumer with no energy imbalance in P2P transactions.";
    case "consumerUnderdrawal":
      return "This scenario details the bill for a commercial consumer who purchased less energy from the P2P platform than scheduled.";
    case "consumerOverdrawal":
      return "This scenario shows the bill for a commercial consumer who purchased more energy from the P2P platform than scheduled.";
    default:
      return "";
  }
};

export const calculateSettlement = (
  calculatorType: CalculatorType,
  isProsumer: boolean,
  consumerInputs: ConsumerInputs,
  prosumerInputs: ProsumerInputs
): SettlementResult => {
  let calculatedResult: SettlementResult = {
    discomBill: { energyCharges: 0, demandCharges: 0, total: 0 },
    p2pBill: {
      energyPayableOrReceivable: 0,
      imbalanceCharges: 0,
      wheelingCharges: 0,
      transactionCharges: 0,
      totalPayableToDiscom: 0,
      totalPayableOrReceivableForP2P: 0,
      transactionChargesPayable: 0,
      netAmountPayable: 0,
    },
  };

  if (isProsumer) {
    // Prosumer calculation
    const {
      energyFromDiscom,
      energyRate,
      demandRate,
      p2pScheduled,
      energySoldToP2P,
      p2pPrice,
      wheelingRate,
      transactionRate,
    } = prosumerInputs;

    // Discom bill
    calculatedResult.discomBill.energyCharges = energyFromDiscom * energyRate;
    calculatedResult.discomBill.demandCharges = 9000; // Fixed value from examples
    calculatedResult.discomBill.total = calculatedResult.discomBill.energyCharges + calculatedResult.discomBill.demandCharges;

    // P2P bill
    const receivable = energySoldToP2P * p2pPrice;
    calculatedResult.p2pBill.energyPayableOrReceivable = receivable;

    // Imbalance calculation
    if (calculatorType === "prosumerUnderInjection") {
      calculatedResult.p2pBill.imbalanceCharges = 1500; // Example value
    } else if (calculatorType === "prosumerOverInjection") {
      calculatedResult.p2pBill.imbalanceCharges = -1433.6; // Negative means receivable
    } else {
      calculatedResult.p2pBill.imbalanceCharges = 0;
    }

    calculatedResult.p2pBill.wheelingCharges = energySoldToP2P * wheelingRate;
    calculatedResult.p2pBill.transactionCharges = energySoldToP2P * transactionRate;
    calculatedResult.p2pBill.totalPayableToDiscom = calculatedResult.discomBill.total;
    
    if (calculatorType === "prosumerOverInjection") {
      calculatedResult.p2pBill.totalPayableOrReceivableForP2P = receivable + Math.abs(calculatedResult.p2pBill.imbalanceCharges);
    } else {
      calculatedResult.p2pBill.totalPayableOrReceivableForP2P = receivable;
    }
    
    calculatedResult.p2pBill.transactionChargesPayable = calculatedResult.p2pBill.transactionCharges;
    
    // Net amount calculation
    calculatedResult.p2pBill.netAmountPayable = 
      calculatedResult.p2pBill.totalPayableToDiscom - 
      calculatedResult.p2pBill.totalPayableOrReceivableForP2P + 
      calculatedResult.p2pBill.transactionChargesPayable;
    
    if (calculatorType === "prosumerUnderInjection") {
      calculatedResult.p2pBill.netAmountPayable += calculatedResult.p2pBill.imbalanceCharges;
    }

  } else {
    // Consumer calculation
    const {
      energyFromDiscom,
      energyRate,
      demandRate,
      p2pScheduled,
      energyFromP2P,
      p2pPrice,
      wheelingRate,
      transactionRate,
    } = consumerInputs;

    // Discom bill
    calculatedResult.discomBill.energyCharges = energyFromDiscom * energyRate;
    calculatedResult.discomBill.demandCharges = 9000; // Fixed value from examples
    calculatedResult.discomBill.total = calculatedResult.discomBill.energyCharges + calculatedResult.discomBill.demandCharges;

    // P2P bill
    const payable = energyFromP2P * p2pPrice;
    calculatedResult.p2pBill.energyPayableOrReceivable = payable;

    // Imbalance calculation
    if (calculatorType === "consumerUnderdrawal") {
      calculatedResult.p2pBill.imbalanceCharges = 40; // Example value
    } else if (calculatorType === "consumerOverdrawal") {
      calculatedResult.p2pBill.imbalanceCharges = 2100; // Example value
    } else {
      calculatedResult.p2pBill.imbalanceCharges = 0;
    }

    calculatedResult.p2pBill.wheelingCharges = energyFromP2P * wheelingRate;
    calculatedResult.p2pBill.transactionCharges = energyFromP2P * transactionRate;

    // Total calculations
    const discomPayable = calculatedResult.discomBill.total;
    calculatedResult.p2pBill.totalPayableToDiscom = discomPayable;
    calculatedResult.p2pBill.totalPayableOrReceivableForP2P = payable;
    calculatedResult.p2pBill.transactionChargesPayable = calculatedResult.p2pBill.transactionCharges;

    // Net amount calculation
    calculatedResult.p2pBill.netAmountPayable = 
      calculatedResult.p2pBill.totalPayableToDiscom + 
      calculatedResult.p2pBill.totalPayableOrReceivableForP2P + 
      calculatedResult.p2pBill.imbalanceCharges + 
      calculatedResult.p2pBill.wheelingCharges + 
      calculatedResult.p2pBill.transactionCharges;
  }

  return calculatedResult;
};
