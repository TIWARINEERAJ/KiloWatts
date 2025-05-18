
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWalletConnection } from "./hooks/useWalletConnection";
import { useBlockchainTransaction } from "./hooks/useBlockchainTransaction";
import { useTransactionRecorder } from "./hooks/useTransactionRecorder";
import EmptyTransactionState from "./components/EmptyTransactionState";
import WalletConnectDialog from "./components/WalletConnectDialog";
import NetworkSelectorDialog from "./components/NetworkSelectorDialog";
import TransactionList from "./components/TransactionList";
import BlockchainSelector from "./components/BlockchainSelector";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw, Filter, Send } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import WalletStatus from "./components/WalletStatus";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Transaction {
  tx: string;
  timestamp: number;
  blockchain: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  isPhantomConnected: boolean;
  isMetamaskConnected: boolean;
  selectedBlockchain: "solana" | "ethereum";
  onBlockchainSelect: (blockchain: "solana" | "ethereum") => void;
  onTransactionRecorded: (tx: string, timestamp: number, blockchain: string) => void;
}

const TransactionHistory = ({ 
  transactions: propTransactions,
  isPhantomConnected,
  isMetamaskConnected,
  selectedBlockchain,
  onBlockchainSelect,
  onTransactionRecorded
}: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<"all" | "verified" | "pending">("all");
  const [showRecordSection, setShowRecordSection] = useState<boolean>(false);
  
  const { 
    isWalletConnected, 
    isWalletDialogOpen, 
    setIsWalletDialogOpen, 
    connectWallet 
  } = useWalletConnection();
  
  const { 
    isDialogOpen,
    setIsDialogOpen,
    network,
    setNetwork,
    isProcessing,
    handleSendToBlockchain,
    getBlockchainExplorerUrl,
    sendTransactionToSolana
  } = useBlockchainTransaction();
  
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

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      
      // Start with a query for all transactions
      let query = supabase.from('transactions').select('*').order('created_at', { ascending: false });
      
      // Apply filters
      if (filter === "verified") {
        query = query.not('blockchain_tx', 'is', null);
      } else if (filter === "pending") {
        query = query.is('blockchain_tx', null);
      }
      
      const { data, error } = await query.limit(50);
      
      if (error) {
        console.error("Error fetching transactions:", error);
        return;
      }
      
      if (data) {
        setTransactions(data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchTransactions();
  };
  
  // Handle recording pending transaction to blockchain
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
      
      // Refresh transaction list after recording
      fetchTransactions();
    } catch (error: any) {
      console.error("Error recording pending transaction:", error);
      toast.error(error.message || "Failed to record transaction");
    }
  };
  
  // Convert DB transactions to format expected by TransactionList
  const formattedTransactions = transactions.map(tx => ({
    tx: tx.blockchain_tx || tx.id,
    timestamp: new Date(tx.created_at || tx.date).getTime(),
    blockchain: tx.blockchain_network || "solana",
    id: tx.id,
    date: tx.date,
    counterparty: tx.counterparty,
    amount: tx.amount,
    status: tx.status
  }));
  
  // Count of pending transactions
  const pendingCount = transactions.filter(tx => !tx.blockchain_tx).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Blockchain Transaction History</CardTitle>
          <CardDescription>View your recorded blockchain transactions and verify pending ones</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowRecordSection(!showRecordSection)}>
            <Send className="mr-2 h-4 w-4" />
            {showRecordSection ? "Hide Recorder" : "Record Transaction"}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={filter} onValueChange={(value: any) => setFilter(value)}>
                <DropdownMenuRadioItem value="all">All Transactions</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="verified">Blockchain Verified</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="pending">Pending Verification</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showRecordSection && (
          <div className="mb-6 space-y-4">
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
            
            {/* Pending Transactions Section */}
            {getWalletConnectionStatus() && pendingCount > 0 && (
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-3">Pending Blockchain Verification ({pendingCount})</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {transactions
                    .filter(tx => !tx.blockchain_tx)
                    .map(transaction => (
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
                    ))
                  }
                </div>
              </div>
            )}
            
            <Separator />
          </div>
        )}
        
        {isLoading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : formattedTransactions.length === 0 ? (
          <EmptyTransactionState />
        ) : (
          <TransactionList 
            transactions={formattedTransactions}
            onViewBlockchain={(tx) => handleSendToBlockchain(tx, isWalletConnected, setIsWalletDialogOpen)}
            getBlockchainExplorerUrl={(tx, blockchain) => getBlockchainExplorerUrl(tx, blockchain)}
          />
        )}
        
        {pendingCount > 0 && !showRecordSection && (
          <div className="mt-4 p-4 border rounded-md bg-yellow-50 dark:bg-yellow-900/20">
            <p className="text-sm text-yellow-800 dark:text-yellow-400 flex items-center justify-between">
              <span>You have {pendingCount} transactions pending blockchain verification.</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4 bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800"
                onClick={() => setShowRecordSection(true)}
              >
                Verify Now
              </Button>
            </p>
          </div>
        )}
        
        {transactions.length > 0 && formattedTransactions.some(tx => tx.tx && tx.tx.length > 30) && (
          <div className="mt-4 pt-4 border-t text-sm">
            <p className="text-muted-foreground">
              You can view detailed transaction data on the respective blockchain explorers by clicking the View links above.
            </p>
          </div>
        )}
        
        {/* Send to Blockchain Dialog */}
        <NetworkSelectorDialog 
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          network={network}
          setNetwork={setNetwork}
          sendTransaction={sendTransactionToSolana}
          isProcessing={isProcessing}
        />
        
        {/* Wallet Connection Dialog */}
        <WalletConnectDialog 
          isOpen={isWalletDialogOpen}
          onOpenChange={setIsWalletDialogOpen}
          connectWallet={connectWallet}
        />
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
