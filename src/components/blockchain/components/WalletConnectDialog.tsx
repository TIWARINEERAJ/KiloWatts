
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface WalletConnectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  connectWallet: () => Promise<void>;
}

const WalletConnectDialog = ({ isOpen, onOpenChange, connectWallet }: WalletConnectDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Wallet Required</DialogTitle>
          <DialogDescription>
            You need to connect your Phantom wallet before sending transactions to the blockchain.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 flex flex-col items-center space-y-4">
          <div className="rounded-full bg-muted/50 p-4">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          
          <div className="text-center">
            <p className="mb-2">Connect your Phantom wallet to continue</p>
            <p className="text-sm text-muted-foreground">
              This will allow you to sign and send transactions to the Solana blockchain.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={connectWallet}
            className="flex items-center"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect Phantom Wallet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectDialog;
