
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Transaction interface
interface TransactionData {
  type: string;
  amount: number;
  timestamp: number;
  description: string;
  counterparty?: string;
  transactionId?: string;
}

export const useTransactionRecorder = (
  isPhantomConnected: boolean,
  isMetamaskConnected: boolean,
  selectedBlockchain: "solana" | "ethereum",
  onTransactionRecorded: (tx: string, timestamp: number, blockchain: string) => void
) => {
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  
  // Function to record a transaction on the Solana blockchain
  const recordTransactionOnSolana = async (amount: number, description: string, existingTransactionId?: string) => {
    if (!isPhantomConnected) {
      toast.error("Please connect your Phantom wallet first");
      return;
    }

    if (amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!description) {
      toast.error("Please enter a transaction description");
      return;
    }

    setTransactionInProgress(true);
    
    try {
      const transactionData: TransactionData = {
        type: "energy_purchase",
        amount: amount,
        timestamp: Date.now(),
        description: description,
        counterparty: "KiloWatts Energy Platform",
        transactionId: existingTransactionId
      };

      let signature: string | null = null;
      
      // Safely access the global function using bracket notation and type casting
      const storeTransactionFunc = (window as any)["storeTransactionOnSolana"];
      
      if (typeof storeTransactionFunc === 'function') {
        signature = await storeTransactionFunc(transactionData);
      } else {
        // Fallback to direct method if helper not available
        toast.error("Blockchain transaction functionality not available");
        console.error("storeTransactionOnSolana function not found");
        setTransactionInProgress(false);
        return;
      }

      if (signature) {
        toast.success("Transaction recorded on Solana blockchain!");
        console.log("Transaction signature:", signature);
        
        // Call the callback with transaction details
        onTransactionRecorded(signature, Date.now(), "solana");
        
        // If we have an existing transaction ID, update it rather than creating a new one
        if (existingTransactionId) {
          await updateExistingTransaction(existingTransactionId, signature);
        } else {
          // Store the transaction in Supabase as a new record
          await storeTransactionInDatabase(signature, transactionData, "solana");
        }
      } else {
        toast.error("Failed to record transaction on blockchain");
      }
    } catch (error: any) {
      console.error("Error recording transaction:", error);
      toast.error(error.message || "Failed to record transaction");
    } finally {
      setTransactionInProgress(false);
    }
  };
  
  // Function to record a transaction on the Ethereum blockchain
  const recordTransactionOnEthereum = async (amount: number, description: string, existingTransactionId?: string) => {
    if (!isMetamaskConnected) {
      toast.error("Please connect your Metamask wallet first");
      return;
    }

    if (amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!description) {
      toast.error("Please enter a transaction description");
      return;
    }

    setTransactionInProgress(true);
    
    try {
      // Create transaction data
      const transactionData = {
        type: "energy_purchase",
        amount: amount,
        description: description,
        timestamp: Date.now(),
        transactionId: existingTransactionId
      };
      
      // Convert to hex string
      const dataHex = '0x' + Buffer.from(JSON.stringify(transactionData)).toString('hex');
      
      // Send transaction
      const ethereum = window.ethereum as any;
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const txParams = {
        from: accounts[0],
        to: accounts[0], // Self-transaction for data recording
        value: '0x0', // 0 ETH
        data: dataHex // Our data as hex
      };
      
      const txHash = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      });
      
      if (txHash) {
        toast.success("Transaction recorded on Ethereum blockchain!");
        console.log("Transaction hash:", txHash);
        
        // Call the callback with transaction details
        onTransactionRecorded(txHash, Date.now(), "ethereum");
        
        // If we have an existing transaction ID, update it rather than creating a new one
        if (existingTransactionId) {
          await updateExistingTransaction(existingTransactionId, txHash);
        } else {
          // Store the transaction in database as a new record
          await storeTransactionInDatabase(txHash, transactionData, "ethereum");
        }
      } else {
        toast.error("Failed to record transaction on blockchain");
      }
    } catch (error: any) {
      console.error("Error recording transaction:", error);
      toast.error(error.message || "Failed to record transaction");
    } finally {
      setTransactionInProgress(false);
    }
  };

  // Store transaction in Supabase
  const storeTransactionInDatabase = async (signature: string, transactionData: TransactionData, blockchain: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          id: signature.substring(0, 8),
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          type: 'purchase',
          counterparty: transactionData.counterparty || 'Unknown',
          amount: `${transactionData.amount} kWh`,
          rate: '₹5.50/kWh',
          total: `₹${(transactionData.amount * 5.5).toFixed(2)}`,
          status: 'completed',
          blockchain_tx: signature,
          blockchain_network: blockchain
        });
        
      if (error) {
        console.error("Error storing transaction in database:", error);
        toast.error("Transaction recorded on blockchain but failed to update database");
      } else {
        toast.success("Transaction successfully stored in database");
      }
    } catch (error: any) {
      console.error("Error storing transaction in database:", error);
    }
  };
  
  // Update an existing transaction with blockchain signature
  const updateExistingTransaction = async (transactionId: string, signature: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          blockchain_tx: signature,
          status: 'verified',
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId);
        
      if (error) {
        console.error("Error updating transaction in database:", error);
        toast.error("Transaction recorded on blockchain but failed to update database record");
      } else {
        toast.success("Transaction successfully verified on blockchain");
      }
    } catch (error: any) {
      console.error("Error updating transaction in database:", error);
    }
  };
  
  const recordTransaction = (amount: number, description: string, existingTransactionId?: string) => {
    if (selectedBlockchain === "solana") {
      recordTransactionOnSolana(amount, description, existingTransactionId);
    } else {
      recordTransactionOnEthereum(amount, description, existingTransactionId);
    }
  };

  return {
    transactionInProgress,
    recordTransaction
  };
};
