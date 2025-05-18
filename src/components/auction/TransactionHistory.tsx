
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactionHistory, Transaction } from './hooks/useTransactionHistory';
import EmptyTransactionState from './components/EmptyTransactionState';
import TransactionList from './components/TransactionList';
import TransactionDetailsDialog from './components/TransactionDetailsDialog';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';

interface TransactionHistoryProps {
  refreshTrigger?: number;
  showVisualizeButton?: boolean;
}

const TransactionHistory = ({ 
  refreshTrigger = 0, 
  showVisualizeButton = true 
}: TransactionHistoryProps) => {
  const { transactions, isLoading } = useTransactionHistory({ 
    refreshTrigger,
    limit: 50 // Limit to recent transactions for better performance
  });
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  
  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsOpen(true);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Loading your transaction history...</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent auction transactions</CardDescription>
        </div>
        {showVisualizeButton && transactions.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => {
              const chartEl = document.querySelector('[data-chart]');
              if (chartEl) {
                chartEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
          >
            <BarChart3 className="h-4 w-4" />
            <span>View Chart</span>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <EmptyTransactionState />
        ) : (
          <>
            <TransactionList 
              transactions={transactions} 
              onViewDetails={handleViewDetails} 
            />
            
            {transactions.some(transaction => transaction.blockchain_tx) && (
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <p className="text-sm">
                  All transactions are securely recorded on the blockchain for transparency and verification.
                </p>
              </div>
            )}
          </>
        )}
        
        <TransactionDetailsDialog 
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          transaction={selectedTransaction}
        />
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
