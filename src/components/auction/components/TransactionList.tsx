
import TransactionRow from './TransactionRow';
import { 
  Table, 
  TableHeader, 
  TableHead, 
  TableBody, 
  TableRow 
} from '@/components/ui/table';

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

interface TransactionListProps {
  transactions: Transaction[];
  onViewDetails: (transaction: Transaction) => void;
}

const TransactionList = ({ transactions, onViewDetails }: TransactionListProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Buyer</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TransactionRow 
              key={transaction.id} 
              transaction={transaction} 
              onViewDetails={onViewDetails} 
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionList;
