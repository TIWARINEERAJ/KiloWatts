
import { Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const EmptyTransactionState = () => {
  const { user } = useAuth();
  
  return (
    <div className="text-center text-muted-foreground py-10 bg-muted/20 rounded-lg border border-dashed border-border/60">
      <Info className="w-12 h-12 mx-auto mb-4 opacity-20" />
      <h3 className="text-lg font-medium mb-2">No Transaction History</h3>
      <p className="max-w-md mx-auto mb-4">
        No energy trading transactions found. Place bids and participate in auctions to see your transaction history appear here.
      </p>
      {!user ? (
        <div className="mt-4 text-sm px-4 py-3 bg-primary/10 inline-block rounded-md">
          <p>Sign in to save your transaction history across sessions.</p>
        </div>
      ) : (
        <div className="mt-4 text-sm">
          <p>Use the Auction Trading tab to start trading energy and build your transaction history.</p>
        </div>
      )}
    </div>
  );
};

export default EmptyTransactionState;
