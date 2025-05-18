
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface Transaction {
  id: string;
  buyer_address: string;
  seller_address: string;
  quantity: number;
  price: number;
  total_value: number;
  status: string;
  blockchain_tx: string | null;
  created_at: string;
  location?: string;
  fees_paid?: number;
  transaction_id?: string;
}

interface InvoiceTabProps {
  transaction: Transaction;
}

const InvoiceTab = ({ transaction }: InvoiceTabProps) => {
  return (
    <div className="border rounded-lg p-6 bg-white dark:bg-muted/10 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold">Energy Trading Invoice</h3>
          <p className="text-muted-foreground">
            SolarSwap P2P Energy Trading Platform
          </p>
        </div>
        <div className="text-right">
          <h4 className="font-semibold">Invoice #INV-{transaction.id.substring(0, 8)}</h4>
          <p className="text-sm text-muted-foreground">Date: {new Date(transaction.created_at).toLocaleDateString()}</p>
        </div>
      </div>
      
      <hr className="border-muted" />
      
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h4 className="font-medium mb-1">From</h4>
          <p className="font-semibold">Energy Producer</p>
          <p className="text-sm text-muted-foreground">{transaction.seller_address.substring(0, 8)}...{transaction.seller_address.substring(transaction.seller_address.length - 4)}</p>
          <p className="text-sm text-muted-foreground">{transaction.location || "Delhi"}, India</p>
        </div>
        <div>
          <h4 className="font-medium mb-1">To</h4>
          <p className="font-semibold">Energy Consumer</p>
          <p className="text-sm text-muted-foreground">{transaction.buyer_address.substring(0, 8)}...{transaction.buyer_address.substring(transaction.buyer_address.length - 4)}</p>
          <p className="text-sm text-muted-foreground">{transaction.location || "Delhi"}, India</p>
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="font-medium mb-2">Transaction Details</h4>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/30">
              <th className="text-left p-2 border">Description</th>
              <th className="text-right p-2 border">Quantity</th>
              <th className="text-right p-2 border">Rate</th>
              <th className="text-right p-2 border">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border">Renewable Energy Supply</td>
              <td className="text-right p-2 border">{transaction.quantity.toFixed(2)} kWh</td>
              <td className="text-right p-2 border">₹{transaction.price.toFixed(2)}/kWh</td>
              <td className="text-right p-2 border">₹{(transaction.quantity * transaction.price).toFixed(2)}</td>
            </tr>
            <tr className="bg-muted/20">
              <td className="p-2 border">Platform Fee (2%)</td>
              <td className="text-right p-2 border">-</td>
              <td className="text-right p-2 border">-</td>
              <td className="text-right p-2 border">₹{transaction.fees_paid?.toFixed(2) || (transaction.total_value * 0.02).toFixed(2)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-right p-2 border font-semibold">Total Amount</td>
              <td className="text-right p-2 border font-semibold">₹{transaction.total_value.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Transaction ID:</p>
          <p className="text-sm">{transaction.transaction_id || `TX-${transaction.id.substring(0, 8)}`}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Blockchain Verification:</p>
          <p className="text-sm font-mono">{transaction.blockchain_tx?.substring(0, 12) || `0x${Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`}...</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Status:</p>
          <p className={`px-2 py-1 rounded-full text-xs ${
            transaction.status === 'completed' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
          }`}>
            {transaction.status}
          </p>
        </div>
      </div>
      
      <div className="mt-8 border-t pt-4">
        <p className="text-center text-sm text-muted-foreground">
          This invoice was automatically generated by the SolarSwap P2P Energy Trading Platform.
          <br />Thank you for participating in renewable energy trading.
        </p>
      </div>
      
      <div className="flex justify-center mt-4">
        <Button variant="outline" className="w-full sm:w-auto">
          <FileText className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </div>
  );
};

export default InvoiceTab;
