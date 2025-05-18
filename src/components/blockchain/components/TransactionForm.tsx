
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TransactionFormProps {
  transactionInProgress: boolean;
  onSubmit: (amount: number, description: string) => void;
  selectedBlockchain: "solana" | "ethereum";
}

const TransactionForm = ({ 
  transactionInProgress, 
  onSubmit,
  selectedBlockchain
}: TransactionFormProps) => {
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionDescription, setTransactionDescription] = useState("");
  
  const handleSubmit = () => {
    onSubmit(transactionAmount, transactionDescription);
  };
  
  return (
    <>
      <div className="grid gap-4">
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium">
            Energy Amount (kWh)
          </label>
          <Input
            id="amount"
            type="number"
            min="0"
            step="0.1"
            value={transactionAmount}
            onChange={(e) => setTransactionAmount(parseFloat(e.target.value) || 0)}
            placeholder="Enter amount in kWh"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Transaction Description
          </label>
          <Textarea
            id="description"
            value={transactionDescription}
            onChange={(e) => setTransactionDescription(e.target.value)}
            rows={3}
            placeholder="Enter transaction details"
          />
        </div>
      </div>
      
      <div className="pt-2">
        <Button
          className="w-full font-semibold"
          onClick={handleSubmit}
          disabled={transactionInProgress}
        >
          {transactionInProgress ? "Processing..." : `Record on ${selectedBlockchain === "solana" ? "Solana" : "Ethereum"} Blockchain`}
        </Button>
      </div>
      
      <div className="pt-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
        <p>This will record the energy transaction on the {selectedBlockchain === "solana" ? "Solana" : "Ethereum"} blockchain as an immutable record.</p>
        <p className="mt-1">Network: {selectedBlockchain === "solana" ? "Solana Devnet" : "Ethereum Sepolia Testnet"}</p>
      </div>
    </>
  );
};

export default TransactionForm;
