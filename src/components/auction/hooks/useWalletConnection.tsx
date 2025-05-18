
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useWalletConnection = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Update wallet connection status when window.solana changes
  useEffect(() => {
    const checkWalletConnection = () => {
      if (window.solana?.isPhantom && window.solana?.publicKey) {
        const address = window.solana.publicKey.toString();
        setWalletAddress(address);
        setIsConnected(true);
      } else {
        setWalletAddress(null);
        setIsConnected(false);
      }
    };
    
    // Check on load
    checkWalletConnection();
    
    // Set up listeners for Phantom wallet connection changes
    if (window.solana) {
      window.solana.on('connect', () => {
        checkWalletConnection();
      });
      
      window.solana.on('disconnect', () => {
        setWalletAddress(null);
        setIsConnected(false);
      });
    }
    
    return () => {
      // Clean up listeners
      if (window.solana) {
        window.solana.removeAllListeners('connect');
        window.solana.removeAllListeners('disconnect');
      }
    };
  }, []);

  return {
    walletAddress,
    isConnected
  };
};
