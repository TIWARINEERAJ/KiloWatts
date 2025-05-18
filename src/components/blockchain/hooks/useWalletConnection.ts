
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useWalletConnection = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);

  // Check wallet connection on component mount and when window.solana changes
  useEffect(() => {
    const checkWalletConnection = () => {
      if (window.solana?.isPhantom && window.solana?.publicKey) {
        setIsWalletConnected(true);
      } else {
        setIsWalletConnected(false);
      }
    };
    
    checkWalletConnection();
    
    // Set up event listeners for wallet connection changes
    if (window.solana) {
      window.solana.on('connect', checkWalletConnection);
      window.solana.on('disconnect', checkWalletConnection);
    }
    
    return () => {
      if (window.solana) {
        window.solana.removeAllListeners('connect');
        window.solana.removeAllListeners('disconnect');
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      // Check if Phantom wallet is installed
      if (!window.solana) {
        toast.error("Phantom wallet not found! Please install it first.");
        window.open("https://phantom.app/", "_blank");
        return;
      }
      
      // Connect to wallet
      const response = await window.solana.connect();
      setIsWalletConnected(true);
      toast.success("Phantom wallet connected!");
      setIsWalletDialogOpen(false);
      
    } catch (error: any) {
      console.error("Error connecting to wallet:", error);
      toast.error(error.message || "Failed to connect wallet");
    }
  };

  return {
    isWalletConnected,
    isWalletDialogOpen,
    setIsWalletDialogOpen,
    connectWallet
  };
};
