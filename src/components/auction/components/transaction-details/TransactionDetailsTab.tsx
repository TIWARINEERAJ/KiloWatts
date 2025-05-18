
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: string;
  buyer_address: string;
  seller_address: string;
  quantity: number;
  price: number;
  total_value: number;
  transaction_type: string;
  status: string;
  blockchain_tx: string | null;
  created_at: string;
  location?: string;
  fees_paid?: number;
  settlement_time?: number;
  transaction_id?: string;
}

interface TransactionDetailsTabProps {
  transaction: Transaction;
}

const TransactionDetailsTab = ({ transaction }: TransactionDetailsTabProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Transaction ID</p>
          <p>{transaction.transaction_id || transaction.id.substring(0, 8)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
          <p>{new Date(transaction.created_at).toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <Badge className={
            transaction.status === 'completed' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
          }>
            {transaction.status}
          </Badge>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Transaction Type</p>
          <Badge variant="outline" className="capitalize">{transaction.transaction_type}</Badge>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Quantity</p>
          <p>{transaction.quantity.toFixed(2)} kWh</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Price</p>
          <p>₹{transaction.price.toFixed(2)} per kWh</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Total Value</p>
          <p className="font-semibold">₹{transaction.total_value.toFixed(2)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Fees Paid</p>
          <p>₹{transaction.fees_paid?.toFixed(2) || (transaction.total_value * 0.02).toFixed(2)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Location</p>
          <p>{transaction.location || "Not specified"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Settlement Time</p>
          <p>{transaction.settlement_time || "120"} seconds</p>
        </div>
      </div>
      
      <div className="border-t pt-4 mt-4">
        <h4 className="font-medium mb-2">Transaction Participants</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Buyer Address</p>
            <p className="font-mono text-sm break-all">{transaction.buyer_address}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Seller Address</p>
            <p className="font-mono text-sm break-all">{transaction.seller_address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsTab;
