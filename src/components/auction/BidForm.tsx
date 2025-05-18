
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { validateBidInput } from "./utils/formUtils";
import { toast } from "sonner";

export interface ExampleBid {
  description: string;
  quantity: number;
  price: number;
}

interface BidFormProps {
  type: "buy" | "sell";
  isConnected: boolean;
  examples: ExampleBid[];
  onSubmit: (quantity: number, price: number) => void;
}

const BidForm = ({ type, isConnected, examples, onSubmit }: BidFormProps) => {
  const [quantity, setQuantity] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [selectedExample, setSelectedExample] = useState<string>("");
  
  const isBuy = type === "buy";
  const actionLabel = isBuy ? "Buy" : "Sell";
  const buttonLabel = `Place ${actionLabel} Bid`;
  
  const handleExampleSelect = (value: string) => {
    if (!value) return;
    
    const index = parseInt(value);
    if (examples[index]) {
      const example = examples[index];
      setQuantity(example.quantity.toString());
      setPrice(example.price.toString());
      setSelectedExample(value);
      
      console.log(`Selected ${actionLabel} example:`, example);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Parse string inputs to numbers
    const numQuantity = parseFloat(quantity);
    const numPrice = parseFloat(price);
    
    console.log(`${actionLabel} bid submit clicked`, { quantity: numQuantity, price: numPrice });
    
    if (!validateBidInput(numQuantity, numPrice)) {
      toast.error(`Invalid ${type} quantity or price`);
      return;
    }
    
    // Call the onSubmit with proper number values
    onSubmit(numQuantity, numPrice);
    
    // Clear the form after submission
    setQuantity("");
    setPrice("");
    setSelectedExample("");
    
    console.log(`${actionLabel} bid submitted:`, { quantity: numQuantity, price: numPrice });
  };

  // Check if inputs are valid for enabling/disabling the button
  const isFormValid = () => {
    const numQuantity = parseFloat(quantity);
    const numPrice = parseFloat(price);
    return validateBidInput(numQuantity, numPrice);
  };

  // For debugging - log props
  useEffect(() => {
    console.log(`${type} BidForm rendered with isConnected:`, isConnected);
  }, [type, isConnected]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${type}ExampleSelect`}>Select a preset example</Label>
        <Select value={selectedExample} onValueChange={handleExampleSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a use case..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Common Examples</SelectLabel>
              <ScrollArea className="h-[200px]">
                {examples.map((example, index) => (
                  <SelectItem key={`${type}-${index}`} value={index.toString()}>
                    {example.description} ({example.quantity} kWh at ₹{example.price}/kWh)
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`${type}Quantity`}>Quantity (kWh)</Label>
        <Input
          id={`${type}Quantity`}
          type="number"
          min="0.1"
          step="0.1"
          value={quantity}
          onChange={handleQuantityChange}
          placeholder={`Enter amount of energy to ${isBuy ? 'buy' : 'sell'}`}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`${type}Price`}>Price per kWh (₹)</Label>
        <Input
          id={`${type}Price`}
          type="number"
          min="0.01"
          step="0.01"
          value={price}
          onChange={handlePriceChange}
          placeholder={`Enter your ${isBuy ? 'bid' : 'ask'} price`}
        />
      </div>
      
      <Button 
        className="w-full" 
        onClick={handleSubmit}
        disabled={!isConnected || !isFormValid()}
        type="button"
      >
        {buttonLabel}
      </Button>
    </div>
  );
};

export default BidForm;
