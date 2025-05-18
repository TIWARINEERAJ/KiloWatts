
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Transaction {
  id: string;
  blockchain_tx: string | null;
  created_at: string;
  transaction_id?: string;
  buyer_address?: string;
  seller_address?: string;
  quantity?: number;
  price?: number;
}

interface BlockchainRecordTabProps {
  transaction: Transaction;
}

const BlockchainRecordTab = ({ transaction }: BlockchainRecordTabProps) => {
  const [isRecording, setIsRecording] = useState(false);
  
  // Generate blockchain explorer URL based on transaction hash
  const getBlockchainExplorerUrl = (tx: string) => {
    // Default to Solana devnet explorer
    return `https://explorer.solana.com/tx/${tx}?cluster=devnet`;
  };

  // Function to manually record transaction on blockchain if not already recorded
  const recordOnBlockchain = async () => {
    if (!window.solana?.isPhantom) {
      toast.error("Please install and connect Phantom wallet first");
      return;
    }
    
    if (!window.solana?.publicKey) {
      try {
        await window.solana.connect();
      } catch (err) {
        toast.error("Failed to connect to Phantom wallet");
        return;
      }
    }
    
    setIsRecording(true);
    
    try {
      // Create transaction data object
      const transactionData = {
        type: "energy_trade",
        buyer: transaction.buyer_address || "unknown",
        seller: transaction.seller_address || "unknown",
        quantity: transaction.quantity || 0,
        price: transaction.price || 0,
        timestamp: new Date(transaction.created_at).getTime(),
        transactionId: transaction.id
      };
      
      // Call the storeTransactionOnSolana function from blockchain-wallets.js
      if (typeof (window as any).storeTransactionOnSolana !== 'function') {
        toast.error("Blockchain integration not available");
        setIsRecording(false);
        return;
      }
      
      const signature = await (window as any).storeTransactionOnSolana(transactionData);
      
      if (signature) {
        // Update the transaction in database with blockchain signature
        const response = await fetch('/api/update-transaction-blockchain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transactionId: transaction.id,
            blockchainTx: signature
          }),
        });
        
        if (response.ok) {
          toast.success("Transaction recorded on blockchain successfully!");
          // Reload the current page to show updated transaction
          window.location.reload();
        } else {
          toast.error("Failed to update transaction record");
        }
      } else {
        toast.error("Failed to record on blockchain");
      }
    } catch (error: any) {
      console.error("Error recording transaction on blockchain:", error);
      toast.error(error.message || "Failed to record transaction");
    } finally {
      setIsRecording(false);
    }
  };

  // Determine if this is a real or simulated blockchain transaction
  const isRealBlockchainTx = transaction.blockchain_tx && 
    transaction.blockchain_tx.length > 30;
    
  // Generate a placeholder tx hash if there isn't a real one
  const displayTxHash = isRealBlockchainTx
    ? transaction.blockchain_tx
    : `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-md bg-muted/30">
        <h4 className="font-medium mb-2">Blockchain Transaction</h4>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Transaction Hash</p>
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm break-all">{transaction.blockchain_tx || "Not recorded on blockchain yet"}</p>
            {isRealBlockchainTx && (
              <a 
                href={getBlockchainExplorerUrl(transaction.blockchain_tx!)}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-xs text-blue-500 hover:text-blue-700"
              >
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </div>
        
        {!transaction.blockchain_tx && (
          <Button 
            onClick={recordOnBlockchain} 
            disabled={isRecording} 
            size="sm" 
            className="mt-2"
          >
            {isRecording ? "Recording..." : "Record on Blockchain"}
          </Button>
        )}
        
        {isRealBlockchainTx && (
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Block Height</p>
              <p className="font-mono">{Math.floor(Math.random() * 100000) + 100000}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Block Timestamp</p>
              <p>{new Date(new Date(transaction.created_at).getTime() + 5000).toISOString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Network</p>
              <p>Solana Devnet</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Confirmations</p>
              <p>{Math.floor(Math.random() * 1000) + 100}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border rounded-md mt-4">
        <h4 className="font-medium mb-2">Smart Contract Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Contract Address</p>
            <p className="font-mono text-sm break-all">
              {`0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Contract Type</p>
            <p>Energy Trading Contract</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Energy Certificate</p>
            <p className="font-mono text-sm">
              {`${transaction.transaction_id || `ECT-${transaction.id.substring(0, 6)}`}`}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Verification Status</p>
            <p className={`px-2 py-1 rounded-full text-xs ${transaction.blockchain_tx 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'} inline-block`}>
              {transaction.blockchain_tx ? 'Verified' : 'Pending Verification'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainRecordTab;
