
import { Button } from '@/components/ui/button';

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
}

interface TransactionRowProps {
  transaction: Transaction;
  onViewDetails: (transaction: Transaction) => void;
}

const TransactionRow = ({ transaction, onViewDetails }: TransactionRowProps) => {
  return (
    <tr className="border-b hover:bg-muted/50">
      <td className="py-3 text-sm">
        {new Date(transaction.created_at).toLocaleString()}
      </td>
      <td className="py-3 text-sm capitalize">{transaction.transaction_type}</td>
      <td className="py-3 text-sm font-mono">
        {transaction.buyer_address.substring(0, 6)}...{transaction.buyer_address.substring(transaction.buyer_address.length - 4)}
      </td>
      <td className="py-3 text-sm font-mono">
        {transaction.seller_address.substring(0, 6)}...{transaction.seller_address.substring(transaction.seller_address.length - 4)}
      </td>
      <td className="py-3 text-sm text-right">₹{transaction.price.toFixed(2)}</td>
      <td className="py-3 text-sm text-right">{transaction.quantity} kWh</td>
      <td className="py-3 text-sm text-right">₹{transaction.total_value.toFixed(2)}</td>
      <td className="py-3 text-sm text-right">
        <span 
          className={`px-2 py-1 rounded-full text-xs ${
            transaction.status === 'completed' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
          }`}
        >
          {transaction.status}
        </span>
      </td>
      <td className="py-3 text-sm text-right">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => onViewDetails(transaction)}
        >
          View Details
        </Button>
      </td>
    </tr>
  );
};

export default TransactionRow;
