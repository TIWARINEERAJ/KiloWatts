
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import BlockchainSelector from "./BlockchainSelector";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface NetworkSelectorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  network: "devnet" | "mainnet";
  setNetwork: (network: "devnet" | "mainnet") => void;
  sendTransaction: () => Promise<void>;
  isProcessing: boolean;
}

const NetworkSelectorDialog = ({
  isOpen,
  onOpenChange,
  network,
  setNetwork,
  sendTransaction,
  isProcessing
}: NetworkSelectorDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Blockchain Network</DialogTitle>
          <DialogDescription>
            Choose which Solana network you want to send this transaction to.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <BlockchainSelector
            selectedBlockchain="solana"
            onBlockchainSelect={() => {}}
            network={network}
            setNetwork={setNetwork}
          />
          
          {network === "mainnet" && (
            <Alert variant="warning">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Mainnet Transaction Warning</AlertTitle>
              <AlertDescription>
                You are about to send a transaction to the Solana Mainnet.
                This will use real SOL and cannot be undone.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={sendTransaction} disabled={isProcessing}>
            {isProcessing ? 
              "Processing..." : 
              network === "mainnet" ? 
                "Send to Mainnet" : 
                "Send to Devnet"
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NetworkSelectorDialog;
