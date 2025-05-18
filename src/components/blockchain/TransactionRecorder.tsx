
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BlockchainSelector from "./components/BlockchainSelector";
import WalletStatus from "./components/WalletStatus";
import TransactionForm from "./components/TransactionForm";
import { useTransactionRecorder } from "./hooks/useTransactionRecorder";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface TransactionRecorderProps {
  isPhantomConnected: boolean;
  isMetamaskConnected: boolean;
  selectedBlockchain: "solana" | "ethereum";
  onBlockchainSelect: (blockchain: "solana" | "ethereum") => void;
  onTransactionRecorded: (tx: string, timestamp: number, blockchain: string) => void;
}

const TransactionRecorder = ({
  isPhantomConnected,
  isMetamaskConnected,
  selectedBlockchain,
  onBlockchainSelect,
  onTransactionRecorded
}: TransactionRecorderProps) => {
  const { user } = useAuth();
  const [pendingTransactions, setPendingTransactions] = useState<any[]>([]);
  const { transactionInProgress, recordTransaction } = useTransactionRecorder(
    isPhantomConnected,
    isMetamaskConnected,
    selectedBlockchain,
    onTransactionRecorded
  );
  
  const getWalletConnectionStatus = () => {
    if (selectedBlockchain === "solana") {
      return isPhantomConnected;
    } else {
      return isMetamaskConnected;
    }
  };

  // Fetch pending transactions that need to be sent to blockchain
  useEffect(() => {
    const fetchPendingTransactions = async () => {
      try {
        // Only fetch if wallet is connected
        if (!getWalletConnectionStatus()) return;
        
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .is('blockchain_tx', null)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) {
          console.error("Error fetching pending transactions:", error);
          return;
        }
        
        if (data && data.length > 0) {
          setPendingTransactions(data);
          toast.info(`Found ${data.length} pending transactions that need blockchain verification`);
        }
      } catch (error) {
        console.error("Error fetching pending transactions:", error);
      }
    };
    
    fetchPendingTransactions();
  }, [isPhantomConnected, isMetamaskConnected, selectedBlockchain]);
  
  // Handle recording pending transactions to blockchain
  const handleRecordPendingTransaction = async (transaction: any) => {
    if (!getWalletConnectionStatus()) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    try {
      const amount = parseFloat(transaction.amount.replace(/[^0-9.]/g, ''));
      const description = `Energy ${transaction.type} - ${transaction.counterparty}`;
      
      // Record transaction to blockchain
      await recordTransaction(amount, description, transaction.id);
      
      // Remove from pending list after successful recording
      setPendingTransactions(prev => 
        prev.filter(tx => tx.id !== transaction.id)
      );
      
    } catch (error: any) {
      console.error("Error recording pending transaction:", error);
      toast.error(error.message || "Failed to record transaction");
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Energy Transaction</CardTitle>
        <CardDescription>Record your energy transaction on the blockchain as an immutable record</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Blockchain Selection */}
        <BlockchainSelector 
          selectedBlockchain={selectedBlockchain}
          onBlockchainSelect={onBlockchainSelect}
        />
        
        <Separator />
        
        {/* Connection Status */}
        <WalletStatus
          selectedBlockchain={selectedBlockchain}
          isWalletConnected={getWalletConnectionStatus()}
        />
        
        {getWalletConnectionStatus() && (
          <>
            {/* Pending Transactions Section */}
            {pendingTransactions.length > 0 && (
              <div className="mb-6 border rounded-md p-4">
                <h3 className="text-sm font-medium mb-3">Pending Blockchain Verification</h3>
                <div className="space-y-3">
                  {pendingTransactions.map(transaction => (
                    <div key={transaction.id} className="flex justify-between items-center bg-muted/30 p-3 rounded-md">
                      <div>
                        <p className="text-sm font-medium">{transaction.amount} @ {transaction.rate}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date} - {transaction.counterparty}</p>
                      </div>
                      <button
                        onClick={() => handleRecordPendingTransaction(transaction)}
                        disabled={transactionInProgress}
                        className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-md hover:bg-primary/90"
                      >
                        Record
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Transaction Form */}
            <TransactionForm 
              transactionInProgress={transactionInProgress}
              onSubmit={recordTransaction}
              selectedBlockchain={selectedBlockchain}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionRecorder;
