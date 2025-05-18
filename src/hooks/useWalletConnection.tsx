
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useWalletConnection = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    // Check if wallet is already connected
    if (window.solana?.isPhantom && window.solana?.publicKey) {
      setWalletAddress(window.solana.publicKey.toString());
      setIsConnected(true);
    }
    
    // Fetch user wallet from profile if available
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('wallet_address')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

      if (profile && profile.wallet_address) {
        setWalletAddress(profile.wallet_address);
        setIsConnected(true);
      }
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
    }
  };

  const connectWalletDirect = async () => {
    if (!window.solana) {
      toast.error("Phantom wallet not found! Please install it first.");
      window.open("https://phantom.app/", "_blank");
      return null;
    }
    
    try {
      const response = await window.solana.connect();
      const publicKey = response.publicKey.toString();
      return publicKey;
    } catch (error) {
      console.error("Failed to connect to Phantom wallet directly:", error);
      return null;
    }
  };

  const connectWallet = async () => {
    try {
      if (!user) {
        toast.error("Please sign in to connect your wallet.");
        return;
      }

      setIsConnecting(true);
      
      let publicKey = null;
      
      // First try using the helper function
      if (typeof window.connectPhantomWallet === 'function') {
        publicKey = await window.connectPhantomWallet();
      } else {
        // Fallback to direct connection
        publicKey = await connectWalletDirect();
      }
      
      if (publicKey) {
        setWalletAddress(publicKey);
        setIsConnected(true);
        toast.success("Wallet connected successfully!");
        
        // Update user profile with wallet address
        await updateUserWallet(publicKey);
      } else {
        toast.error("Failed to connect wallet");
      }
    } catch (error: any) {
      console.error("Error connecting to wallet:", error);
      toast.error(error.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      let success = false;
      
      if (typeof window.disconnectPhantomWallet === 'function') {
        success = await window.disconnectPhantomWallet();
      } else if (window.solana) {
        await window.solana.disconnect();
        success = true;
      } else {
        toast.error("Phantom wallet not found!");
        return;
      }
      
      if (success) {
        setWalletAddress(null);
        setIsConnected(false);
        toast.success("Wallet disconnected successfully!");
        
        // Update user profile to remove wallet address
        await updateUserWallet(null);
      }
    } catch (error: any) {
      console.error("Error disconnecting wallet:", error);
      toast.error(error.message || "Failed to disconnect wallet");
    }
  };

  const updateUserWallet = async (walletAddress: string | null) => {
    if (!user) return;
    
    try {
      // Check if user profile exists first
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
        
      if (fetchError && !fetchError.message.includes('JSON object requested')) {
        console.error("Error checking for existing profile:", fetchError);
        throw fetchError;
      }
        
      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('user_profiles')
          .update({
            wallet_address: walletAddress,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
          
        if (error) {
          console.error("Error updating profile:", error);
          throw error;
        }
          
      } else {
        // Create new profile
        const { error } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            username: user.email?.split('@')[0] || 'user',
            wallet_address: walletAddress,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user_role: 'consumer'
          });
          
        if (error) {
          console.error("Error creating profile:", error);
          throw error;
        }
      }
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      toast.error("Failed to update wallet information: " + error.message);
    }
  };

  return {
    walletAddress,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet
  };
};
