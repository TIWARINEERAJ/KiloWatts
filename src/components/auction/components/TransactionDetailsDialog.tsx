
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionDetailsTab from "./transaction-details/TransactionDetailsTab";
import BlockchainRecordTab from "./transaction-details/BlockchainRecordTab";
import InvoiceTab from "./transaction-details/InvoiceTab";

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

interface TransactionDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

const TransactionDetailsDialog = ({ isOpen, onOpenChange, transaction }: TransactionDetailsDialogProps) => {
  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Complete information about this energy trading transaction
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Transaction Details</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain Record</TabsTrigger>
            <TabsTrigger value="invoice">Invoice</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <TransactionDetailsTab transaction={transaction} />
          </TabsContent>
          
          <TabsContent value="blockchain">
            <BlockchainRecordTab transaction={transaction} />
          </TabsContent>
          
          <TabsContent value="invoice">
            <InvoiceTab transaction={transaction} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailsDialog;
