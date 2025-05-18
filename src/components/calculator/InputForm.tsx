
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ConsumerInputs, ProsumerInputs } from "./types";

interface InputFormProps {
  isProsumer: boolean;
  consumerInputs: ConsumerInputs;
  prosumerInputs: ProsumerInputs;
  handleInputChange: (name: string, value: string) => void;
  calculateSettlement: () => void;
}

const InputForm: React.FC<InputFormProps> = ({
  isProsumer,
  consumerInputs,
  prosumerInputs,
  handleInputChange,
  calculateSettlement,
}) => {
  return (
    <div>
      <h3 className="text-xl font-medium mb-4">Input Variables</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isProsumer ? (
          <>
            <div>
              <Label htmlFor="energyFromDiscom">Energy Purchased from Discom (kWh)</Label>
              <Input
                id="energyFromDiscom"
                type="number"
                value={prosumerInputs.energyFromDiscom}
                onChange={(e) => handleInputChange("energyFromDiscom", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="p2pScheduled">P2P Scheduled Energy (kWh)</Label>
              <Input
                id="p2pScheduled"
                type="number"
                value={prosumerInputs.p2pScheduled}
                onChange={(e) => handleInputChange("p2pScheduled", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="energySoldToP2P">Energy Sold to P2P Platform (kWh)</Label>
              <Input
                id="energySoldToP2P"
                type="number"
                value={prosumerInputs.energySoldToP2P}
                onChange={(e) => handleInputChange("energySoldToP2P", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="loadOnP2P">Load on P2P Platform (kW)</Label>
              <Input
                id="loadOnP2P"
                type="number"
                value={prosumerInputs.loadOnP2P}
                onChange={(e) => handleInputChange("loadOnP2P", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="energyRate">Energy Charges (Rs./kWh)</Label>
              <Input
                id="energyRate"
                type="number"
                value={prosumerInputs.energyRate}
                onChange={(e) => handleInputChange("energyRate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="demandRate">Demand Charges (Rs./kW)</Label>
              <Input
                id="demandRate"
                type="number"
                value={prosumerInputs.demandRate}
                onChange={(e) => handleInputChange("demandRate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="wheelingRate">Wheeling charges (Rs./kWh)</Label>
              <Input
                id="wheelingRate"
                type="number"
                value={prosumerInputs.wheelingRate}
                onChange={(e) => handleInputChange("wheelingRate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="transactionRate">Transaction Charge (Rs./kWh)</Label>
              <Input
                id="transactionRate"
                type="number"
                value={prosumerInputs.transactionRate}
                onChange={(e) => handleInputChange("transactionRate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="p2pPrice">Mutually agreed transaction price (Rs/kWh)</Label>
              <Input
                id="p2pPrice"
                type="number"
                value={prosumerInputs.p2pPrice}
                onChange={(e) => handleInputChange("p2pPrice", e.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="energyFromDiscom">Energy Purchased from Discom (kWh)</Label>
              <Input
                id="energyFromDiscom"
                type="number"
                value={consumerInputs.energyFromDiscom}
                onChange={(e) => handleInputChange("energyFromDiscom", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="p2pScheduled">P2P Scheduled Energy (kWh)</Label>
              <Input
                id="p2pScheduled"
                type="number"
                value={consumerInputs.p2pScheduled}
                onChange={(e) => handleInputChange("p2pScheduled", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="energyFromP2P">Energy Purchased from P2P Platform (kWh)</Label>
              <Input
                id="energyFromP2P"
                type="number"
                value={consumerInputs.energyFromP2P}
                onChange={(e) => handleInputChange("energyFromP2P", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="contractedDemand">Contracted Demand (kW)</Label>
              <Input
                id="contractedDemand"
                type="number"
                value={consumerInputs.contractedDemand}
                onChange={(e) => handleInputChange("contractedDemand", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="energyRate">Energy Charges (Rs./kWh)</Label>
              <Input
                id="energyRate"
                type="number"
                value={consumerInputs.energyRate}
                onChange={(e) => handleInputChange("energyRate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="demandRate">Demand Charges (Rs./kW)</Label>
              <Input
                id="demandRate"
                type="number"
                value={consumerInputs.demandRate}
                onChange={(e) => handleInputChange("demandRate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="wheelingRate">Wheeling charges (Rs./kWh)</Label>
              <Input
                id="wheelingRate"
                type="number"
                value={consumerInputs.wheelingRate}
                onChange={(e) => handleInputChange("wheelingRate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="transactionRate">Transaction Charge (Rs./kWh)</Label>
              <Input
                id="transactionRate"
                type="number"
                value={consumerInputs.transactionRate}
                onChange={(e) => handleInputChange("transactionRate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="p2pPrice">Mutually agreed transaction price (Rs/kWh)</Label>
              <Input
                id="p2pPrice"
                type="number"
                value={consumerInputs.p2pPrice}
                onChange={(e) => handleInputChange("p2pPrice", e.target.value)}
              />
            </div>
          </>
        )}
      </div>
      <Button 
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700" 
        onClick={calculateSettlement}
      >
        Calculate
      </Button>
    </div>
  );
};

export default InputForm;
