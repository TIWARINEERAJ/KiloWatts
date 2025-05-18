
import { ExternalLink, Send, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Transaction {
  tx: string;
  timestamp: number;
  blockchain: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onViewBlockchain: (tx: Transaction) => void;
  getBlockchainExplorerUrl: (tx: string, blockchain: string) => string;
}

const TransactionList = ({ 
  transactions, 
  onViewBlockchain, 
  getBlockchainExplorerUrl 
}: TransactionListProps) => {
  if (transactions.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto rounded-full bg-muted/50 p-3 w-12 h-12 flex items-center justify-center mb-3">
          <Database className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-1">No transactions yet</h3>
        <p className="text-muted-foreground">
          Record a transaction on the blockchain to see it here
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="text-xs uppercase bg-muted">
          <tr>
            <th className="px-4 py-2 text-left">Blockchain</th>
            <th className="px-4 py-2 text-left">Transaction ID</th>
            <th className="px-4 py-2 text-left">Timestamp</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-3">
                <div className="flex items-center space-x-2">
                  <img 
                    src={tx.blockchain === "solana" 
                      ? "https://phantom.app/favicon.ico" 
                      : "https://metamask.io/images/favicon-32x32.png"} 
                    alt={tx.blockchain} 
                    className="h-4 w-4" 
                  />
                  <span className="capitalize">{tx.blockchain}</span>
                </div>
              </td>
              <td className="px-4 py-3 font-mono text-sm">
                {tx.tx.substring(0, 16)}...
              </td>
              <td className="px-4 py-3 text-sm">
                {new Date(tx.timestamp).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm text-right">
                <div className="flex justify-end items-center space-x-2">
                  <a 
                    href={getBlockchainExplorerUrl(tx.tx, tx.blockchain)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-500 hover:text-blue-700"
                  >
                    View <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                  
                  {tx.blockchain === "solana" && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex items-center"
                      onClick={() => onViewBlockchain(tx)}
                    >
                      <Send className="mr-1 h-3 w-3" /> Send to Blockchain
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
