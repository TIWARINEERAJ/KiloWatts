
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Transaction {
  tx: string;
  timestamp: number;
  blockchain: string;
  id?: string;
}

export const useBlockchainTransaction = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [network, setNetwork] = useState<"devnet" | "mainnet">("devnet");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendToBlockchain = (tx: Transaction, isWalletConnected: boolean, setIsWalletDialogOpen: (open: boolean) => void) => {
    if (!isWalletConnected) {
      setIsWalletDialogOpen(true);
      return;
    }
    
    setSelectedTransaction(tx);
    setIsDialogOpen(true);
  };
  
  const getBlockchainExplorerUrl = (tx: string, blockchain: string, isMainnet = false) => {
    if (blockchain === "solana") {
      return isMainnet 
        ? `https://explorer.solana.com/tx/${tx}`
        : `https://explorer.solana.com/tx/${tx}?cluster=devnet`;
    } else {
      return isMainnet
        ? `https://etherscan.io/tx/${tx}`
        : `https://sepolia.etherscan.io/tx/${tx}`;
    }
  };

  const sendTransactionToSolana = async () => {
    if (!selectedTransaction) return;
    
    setIsProcessing(true);
    
    try {
      // Check if Phantom wallet is connected
      if (!window.solana?.isPhantom || !window.solana?.publicKey) {
        toast.error("Please connect your Phantom wallet first");
        setIsProcessing(false);
        return;
      }
      
      // Check which network function to use
      const functionName = network === "mainnet" 
        ? "sendTransactionToSolanaMainnet" 
        : "storeTransactionOnSolana";
      
      // Check if the function exists in the global scope
      const sendFunc = (window as any)[functionName];
      
      if (typeof sendFunc !== 'function') {
        toast.error(`Blockchain function for ${network} not available`);
        console.error(`${functionName} function not found`);
        setIsProcessing(false);
        return;
      }
      
      const transactionData = {
        originalTx: selectedTransaction.tx,
        timestamp: Date.now(),
        network: network,
        transactionId: selectedTransaction.id
      };
      
      // Call the appropriate function based on the selected network
      const signature = await sendFunc(transactionData);
      
      if (signature) {
        // Update the transaction in the database if it was successful
        if (selectedTransaction.id) {
          await updateTransactionNetworkInfo(selectedTransaction.id, signature, network);
        }
        
        toast.success(`Transaction sent to Solana ${network}!`, {
          description: `Transaction signature: ${signature.substring(0, 8)}...`
        });
        
        // Close the dialog
        setIsDialogOpen(false);
      } else {
        toast.error(`Failed to send transaction to Solana ${network}`);
      }
    } catch (error: any) {
      console.error("Error sending transaction to blockchain:", error);
      toast.error(error.message || "Failed to send transaction to blockchain");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Update transaction with network information
  const updateTransactionNetworkInfo = async (transactionId: string, signature: string, network: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          blockchain_network: network,
          blockchain_tx: signature,
          status: network === "mainnet" ? "verified" : "completed",
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId);
        
      if (error) {
        console.error("Error updating transaction network info:", error);
      }
    } catch (error) {
      console.error("Error updating transaction network info:", error);
    }
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    selectedTransaction,
    setSelectedTransaction,
    network,
    setNetwork,
    isProcessing,
    handleSendToBlockchain,
    getBlockchainExplorerUrl,
    sendTransactionToSolana
  };
};
