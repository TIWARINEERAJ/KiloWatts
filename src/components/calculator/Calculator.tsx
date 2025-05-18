
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalculatorType, ConsumerInputs, ProsumerInputs, SettlementResult } from "./types";
import { defaultConsumerInputs, defaultProsumerInputs } from "./constants";
import { calculateSettlement, getScenarioDescription } from "./utils";
import InputForm from "./InputForm";
import ResultsDisplay from "./ResultsDisplay";
import BenefitAnalysis from "./BenefitAnalysis";

const Calculator: React.FC = () => {
  const [calculatorType, setCalculatorType] = useState<CalculatorType>("consumerNoImbalance");
  const [isProsumer, setIsProsumer] = useState(false);
  
  const [consumerInputs, setConsumerInputs] = useState<ConsumerInputs>(defaultConsumerInputs);
  const [prosumerInputs, setProsumerInputs] = useState<ProsumerInputs>(defaultProsumerInputs);
  
  const [result, setResult] = useState<SettlementResult | null>(null);

  const handleInputChange = (name: string, value: string) => {
    if (isProsumer) {
      setProsumerInputs({ ...prosumerInputs, [name]: parseFloat(value) || 0 });
    } else {
      setConsumerInputs({ ...consumerInputs, [name]: parseFloat(value) || 0 });
    }
  };

  const handleCalculate = () => {
    const calculatedResult = calculateSettlement(calculatorType, isProsumer, consumerInputs, prosumerInputs);
    setResult(calculatedResult);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">P2P Energy Settlement Calculator</h1>
      
      <Tabs
        defaultValue="consumerNoImbalance"
        value={calculatorType}
        onValueChange={(value) => {
          setCalculatorType(value as CalculatorType);
          setIsProsumer(value.startsWith("prosumer"));
        }}
        className="w-full mb-8"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
          <TabsTrigger value="prosumerNoImbalance">Prosumer No Imbalance</TabsTrigger>
          <TabsTrigger value="prosumerUnderInjection">Prosumer Under Injection</TabsTrigger>
          <TabsTrigger value="prosumerOverInjection">Prosumer Over Injection</TabsTrigger>
          <TabsTrigger value="consumerNoImbalance">Consumer No Imbalance</TabsTrigger>
          <TabsTrigger value="consumerUnderdrawal">Consumer Underdrawal</TabsTrigger>
          <TabsTrigger value="consumerOverdrawal">Consumer Overdrawal</TabsTrigger>
        </TabsList>

        <TabsContent value={calculatorType} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{isProsumer ? "Prosumer" : "Consumer"} ({isProsumer ? "Commercial" : "Commercial"}) {calculatorType.replace(/^(prosumer|consumer)/, "")}</CardTitle>
              <CardDescription>{getScenarioDescription(calculatorType)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputForm 
                  isProsumer={isProsumer}
                  consumerInputs={consumerInputs}
                  prosumerInputs={prosumerInputs}
                  handleInputChange={handleInputChange}
                  calculateSettlement={handleCalculate}
                />
                
                <div>
                  <h3 className="text-xl font-medium mb-4">Results</h3>
                  <ResultsDisplay 
                    result={result}
                    isProsumer={isProsumer}
                    calculatorType={calculatorType}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {result && <BenefitAnalysis result={result} />}
    </div>
  );
};

export default Calculator;
