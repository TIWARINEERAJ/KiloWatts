
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface WalletStatusProps {
  selectedBlockchain: "solana" | "ethereum";
  isWalletConnected: boolean;
}

const WalletStatus = ({ selectedBlockchain, isWalletConnected }: WalletStatusProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1 flex items-center">
        {selectedBlockchain === "solana" ? (
          <img 
            src="https://solana.com/src/img/branding/solanaLogoMark.png" 
            alt="Solana Logo"
            className="h-5 w-5 mr-2" 
          />
        ) : (
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
            alt="Metamask Logo"
            className="h-5 w-5 mr-2" 
          />
        )}
        <div>
          <p className="text-sm font-medium">Wallet Status</p>
          <p className="text-sm text-muted-foreground">
            {selectedBlockchain === "solana" ? "Phantom" : "Metamask"} Wallet
          </p>
        </div>
      </div>
      {isWalletConnected ? (
        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          Connected
        </Badge>
      ) : (
        <div className="flex space-x-2 items-center">
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            Disconnected
          </Badge>
          <Button 
            size="sm" 
            onClick={() => toast.info(`Please connect your ${selectedBlockchain === "solana" ? "Phantom" : "Metamask"} wallet in the Wallet Connection tab`)}
          >
            Connect
          </Button>
        </div>
      )}
    </div>
  );
};

export default WalletStatus;
