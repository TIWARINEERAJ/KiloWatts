
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface WalletDisplayProps {
  walletAddress: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const WalletDisplay = ({
  walletAddress,
  isConnected,
  isConnecting,
  connectWallet,
  disconnectWallet
}: WalletDisplayProps) => {
  return (
    <>
      {isConnected ? (
        <div className="flex items-center space-x-4">
          <div className="bg-muted/50 rounded-md px-3 py-2 text-sm font-mono truncate max-w-[200px]">
            {walletAddress}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={disconnectWallet}
          >
            Disconnect Wallet
          </Button>
        </div>
      ) : (
        <Button 
          onClick={connectWallet} 
          disabled={isConnecting} 
          className="flex items-center"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      )}
    </>
  );
};

export default WalletDisplay;
