
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const MarketInfo = () => {
  return (
    <div className="mt-12 p-6 bg-muted/30 rounded-lg border border-border">
      <h2 className="text-xl font-semibold mb-4">Blockchain-Powered Energy Trading</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Secure Transactions</h3>
          <p className="text-muted-foreground mb-4">
            All energy trades on our platform are secured using Solana blockchain technology, 
            ensuring transparent, tamper-proof transactions between producers and consumers.
          </p>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Solana Blockchain
          </Badge>
          <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
            Smart Contracts
          </Badge>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">How It Works</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
              <span>Choose from multiple trading models: fixed price, auction, or time-based</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
              <span>Smart contracts automatically execute trades when conditions are met</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
              <span>All transactions are recorded on the blockchain for complete transparency</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MarketInfo;
