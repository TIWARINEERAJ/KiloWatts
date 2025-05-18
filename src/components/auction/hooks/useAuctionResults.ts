
import { useState } from "react";
import { toast } from "sonner";
import { AuctionResult } from "@/utils/auction/types";
import { DoubleAuction } from "@/utils/auction/doubleAuction";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export interface AuctionResultsState {
  auctionResults: AuctionResult[];
  auctionHistory: AuctionResult[];
  isProcessing: boolean;
  executeAuction: () => Promise<void>;
}

/**
 * Hook for managing auction results and execution
 */
export const useAuctionResults = (
  auctionEngine: DoubleAuction,
  walletAddress: string | null, 
  isConnected: boolean,
  user: User | null,
  updateBidStates: () => void
): AuctionResultsState => {
  const [auctionResults, setAuctionResults] = useState<AuctionResult[]>([]);
  const [auctionHistory, setAuctionHistory] = useState<AuctionResult[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Function to save auction results to the transaction history in Supabase
  const saveAuctionResultsToDb = async (results: AuctionResult[]) => {
    try {
      console.log("Saving auction results to database:", results);
      
      if (!results || results.length === 0) {
        console.log("No results to save");
        return;
      }
      
      // Map auction results to transactions format
      const transactions = results.map(result => {
        // Determine if the current wallet is buying or selling
        const transactionType = walletAddress && walletAddress === result.buyer ? 'purchase' : 'sale';
        
        return {
          user_id: user?.id || null, // Save even if user is not authenticated
          buyer_address: result.buyer,
          seller_address: result.seller,
          quantity: result.quantityTraded,
          price: result.clearingPrice,
          total_value: result.quantityTraded * result.clearingPrice,
          transaction_type: transactionType,
          blockchain_tx: null, // Will be updated if blockchain verification is successful
          status: 'completed'
        };
      });
      
      console.log("Transactions to insert:", transactions);
      
      if (transactions.length > 0) {
        const { data, error } = await supabase
          .from('auction_transactions')
          .insert(transactions);
          
        if (error) {
          console.error("Error saving auction results to database:", error);
          toast.error("Failed to save auction results to database");
        } else {
          console.log("Auction results saved successfully to database");
          toast.success("Transaction records saved to database");
        }
      }
    } catch (error) {
      console.error("Exception saving auction results:", error);
      toast.error("Failed to save transaction records");
    }
  };

  // Function to execute the auction
  const executeAuction = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log("Executing auction...");
      const results = auctionEngine.executeAuction();
      console.log("Auction execution results:", results);
      
      setAuctionResults(results);
      
      // Update auction history with new results
      const newHistory = [...auctionHistory, ...results];
      setAuctionHistory(newHistory);
      
      // Update bid states after auction execution
      updateBidStates();
      
      if (results.length > 0) {
        toast.success(`Auction executed with ${results.length} successful trades!`, {
          description: `Total energy traded: ${results.reduce((sum, r) => sum + r.quantityTraded, 0).toFixed(2)} kWh`
        });
        
        // Always attempt to store auction results in database
        await saveAuctionResultsToDb(results);
        
        // Store auction results on blockchain if available
        if (typeof window.storeAuctionResultOnSolana === 'function') {
          try {
            const signature = await window.storeAuctionResultOnSolana(results);
            if (signature) {
              toast.success("Auction results recorded on Solana blockchain");
              
              // Update blockchain transaction IDs in database if user is logged in
              if (user) {
                const { error } = await supabase
                  .from('auction_transactions')
                  .update({ blockchain_tx: signature })
                  .eq('user_id', user.id)
                  .is('blockchain_tx', null);
                  
                if (error) {
                  console.error("Error updating blockchain transaction IDs:", error);
                }
              }
            }
          } catch (blockchainError) {
            console.error("Error recording on blockchain:", blockchainError);
          }
        }
      } else {
        toast.info("No matching bids found for execution");
      }
      
    } catch (error: any) {
      console.error("Error executing auction:", error);
      toast.error(error.message || "Failed to execute auction");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    auctionResults,
    auctionHistory,
    isProcessing,
    executeAuction
  };
};
