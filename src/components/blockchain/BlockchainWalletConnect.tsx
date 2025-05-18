
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet } from "lucide-react";

// Wallet connection props
interface BlockchainWalletConnectProps {
  onWalletUpdate?: (walletInfo: {
    isPhantomConnected: boolean;
    isMetamaskConnected: boolean;
    phantomWalletAddress: string | null;
    metamaskWalletAddress: string | null;
  }) => void;
}

const BlockchainWalletConnect = ({ onWalletUpdate }: BlockchainWalletConnectProps) => {
  // Wallet states
  const [phantomWalletAddress, setPhantomWalletAddress] = useState<string | null>(null);
  const [metamaskWalletAddress, setMetamaskWalletAddress] = useState<string | null>(null);
  const [isPhantomConnected, setIsPhantomConnected] = useState(false);
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Script loading state
  const [phantomScriptLoaded, setPhantomScriptLoaded] = useState(false);
  const [metamaskAvailable, setMetamaskAvailable] = useState(false);
  
  const { user } = useAuth();

  // Check if the Phantom wallet script is loaded
  useEffect(() => {
    const checkScriptLoaded = () => {
      if (typeof window.connectPhantomWallet === 'function') {
        console.log("Phantom wallet script loaded successfully");
        setPhantomScriptLoaded(true);
      } else {
        console.log("Phantom wallet script not loaded yet, retrying...");
        setTimeout(checkScriptLoaded, 500);
      }
    };
    
    // Check for Metamask availability
    if (window.ethereum) {
      console.log("Metamask is available");
      setMetamaskAvailable(true);
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          setMetamaskWalletAddress(null);
          setIsMetamaskConnected(false);
        } else {
          // User switched accounts
          setMetamaskWalletAddress(accounts[0]);
          setIsMetamaskConnected(true);
        }
        
        notifyWalletUpdate();
      });
    }
    
    checkScriptLoaded();
    
    return () => {
      // Clean up listeners
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  // Create memoized fetch function to prevent recreation on every render
  const fetchUserProfile = useCallback(async () => {
    if (!user) return;
    console.log("Fetching user profile for ID:", user.id);

    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

      console.log("User profile fetched:", profile);
      if (profile && profile.wallet_address) {
        setPhantomWalletAddress(profile.wallet_address);
        setIsPhantomConnected(true);
        
        notifyWalletUpdate();
      }
    } catch (error: any) {
      console.error("Unexpected error fetching user profile:", error);
      toast.error("Failed to fetch user profile: " + error.message);
    }
  }, [user]);

  // Use effect with stable dependencies
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [fetchUserProfile, user]);
  
  // Notify parent component about wallet update
  const notifyWalletUpdate = useCallback(() => {
    if (onWalletUpdate) {
      onWalletUpdate({
        isPhantomConnected,
        isMetamaskConnected,
        phantomWalletAddress,
        metamaskWalletAddress
      });
    }
  }, [isPhantomConnected, isMetamaskConnected, phantomWalletAddress, metamaskWalletAddress, onWalletUpdate]);

  // Direct wallet connection function that doesn't rely on window.connectPhantomWallet
  const connectPhantomDirect = async () => {
    if (!window.solana) {
      toast.error("Phantom wallet not found! Please install it first.");
      window.open("https://phantom.app/", "_blank");
      return null;
    }
    
    try {
      const response = await window.solana.connect();
      const publicKey = response.publicKey.toString();
      console.log("Connected to Phantom wallet directly:", publicKey);
      return publicKey;
    } catch (error) {
      console.error("Failed to connect to Phantom wallet directly:", error);
      return null;
    }
  };

  // Connect to Phantom wallet
  const connectPhantomWallet = async () => {
    try {
      if (!user) {
        toast.error("Please sign in to connect your wallet.");
        return;
      }

      setIsConnecting(true);
      
      let publicKey = null;
      
      // First try using the helper function
      if (typeof window.connectPhantomWallet === 'function') {
        console.log("Using helper function to connect wallet");
        publicKey = await window.connectPhantomWallet();
      } else {
        // Fallback to direct connection
        console.log("Helper function not found, connecting directly");
        publicKey = await connectPhantomDirect();
      }
      
      if (publicKey) {
        setPhantomWalletAddress(publicKey);
        setIsPhantomConnected(true);
        toast.success("Phantom wallet connected successfully!");
        
        // Update user profile with wallet address
        await updateUserWallet(publicKey, "solana");
        
        // Notify parent component
        notifyWalletUpdate();
      } else {
        toast.error("Failed to connect Phantom wallet");
      }
    } catch (error: any) {
      console.error("Error connecting to Phantom wallet:", error);
      toast.error(error.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  // Connect to Metamask wallet
  const connectMetamaskWallet = async () => {
    try {
      if (!user) {
        toast.error("Please sign in to connect your wallet.");
        return;
      }
      
      if (!window.ethereum) {
        toast.error("Metamask not found! Please install it first.");
        window.open("https://metamask.io/", "_blank");
        return;
      }
      
      setIsConnecting(true);
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        setMetamaskWalletAddress(address);
        setIsMetamaskConnected(true);
        toast.success("Metamask wallet connected successfully!");
        
        // Update user profile with wallet address (update a different field or handle differently)
        await updateUserWallet(address, "ethereum");
        
        // Notify parent component
        notifyWalletUpdate();
      } else {
        toast.error("Failed to connect Metamask wallet");
      }
    } catch (error: any) {
      console.error("Error connecting to Metamask:", error);
      toast.error(error.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect Phantom wallet
  const disconnectPhantomWallet = async () => {
    try {
      let success = false;
      
      // First try using the helper function
      if (typeof window.disconnectPhantomWallet === 'function') {
        success = await window.disconnectPhantomWallet();
      } else if (window.solana) {
        // Fallback to direct disconnection
        await window.solana.disconnect();
        success = true;
      } else {
        toast.error("Phantom wallet not found!");
        return;
      }
      
      if (success) {
        setPhantomWalletAddress(null);
        setIsPhantomConnected(false);
        toast.success("Phantom wallet disconnected successfully!");
        
        // Update user profile to remove wallet address
        await updateUserWallet(null, "solana");
        
        // Notify parent component
        notifyWalletUpdate();
      }
    } catch (error: any) {
      console.error("Error disconnecting wallet:", error);
      toast.error(error.message || "Failed to disconnect wallet");
    }
  };
  
  // Disconnect Metamask wallet
  const disconnectMetamaskWallet = async () => {
    // Metamask doesn't provide a disconnect method, so we just clear the state
    setMetamaskWalletAddress(null);
    setIsMetamaskConnected(false);
    toast.success("Metamask wallet disconnected from application");
    
    // Update user profile to remove wallet address
    await updateUserWallet(null, "ethereum");
    
    // Notify parent component
    notifyWalletUpdate();
  };
  
  // Updated function to handle profile creation/update properly
  const updateUserWallet = async (walletAddress: string | null, walletType: string) => {
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
        
      const updateData: any = {
        updated_at: new Date().toISOString()
      };
      
      // Set the appropriate wallet address field
      if (walletType === "solana") {
        updateData.wallet_address = walletAddress;
      } else if (walletType === "ethereum") {
        updateData.ethereum_address = walletAddress;
      }
        
      if (existingProfile) {
        console.log(`Updating existing profile with ${walletType} wallet:`, walletAddress);
        // Update existing profile
        const { error } = await supabase
          .from('user_profiles')
          .update(updateData)
          .eq('id', user.id);
          
        if (error) {
          console.error("Error updating profile:", error);
          throw error;
        }
          
      } else {
        console.log(`Creating new profile with ${walletType} wallet:`, walletAddress);
        // Create new profile with appropriate wallet field
        const newProfile: any = {
          id: user.id,
          username: user.email?.split('@')[0] || 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_role: 'consumer'
        };
        
        // Set the appropriate wallet address field
        if (walletType === "solana") {
          newProfile.wallet_address = walletAddress;
        } else if (walletType === "ethereum") {
          newProfile.ethereum_address = walletAddress;
        }
        
        const { error } = await supabase
          .from('user_profiles')
          .insert(newProfile);
          
        if (error) {
          console.error("Error creating profile:", error);
          throw error;
        }
      }
      
      console.log(`User profile updated with ${walletType} wallet address:`, walletAddress);
      
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      toast.error("Failed to update wallet information: " + error.message);
    }
  };
  
  // Display script load status message for debugging purposes
  if (!phantomScriptLoaded) {
    return (
      <div className="p-6 border rounded-lg shadow-sm bg-card">
        <p>Loading Phantom wallet integration...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Phantom Wallet Card */}
      <Card className={`${isPhantomConnected ? 'border-primary/50' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="https://phantom.app/favicon.ico" alt="Phantom" className="h-6 w-6" />
              <CardTitle>Phantom Wallet</CardTitle>
            </div>
            <Badge variant="outline">Solana</Badge>
          </div>
          <CardDescription>Connect your Solana wallet to manage energy transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {isPhantomConnected ? (
            <div className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-md">
                <p className="mb-2 text-sm text-muted-foreground">Connected wallet:</p>
                <p className="font-mono text-sm break-all bg-background p-2 rounded border">{phantomWalletAddress}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Connected
                </Badge>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-4 space-y-4">
              <div className="rounded-full bg-muted/80 p-6">
                <Wallet className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-center">Phantom wallet not connected</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {isPhantomConnected ? (
            <Button 
              className="w-full" 
              variant="destructive" 
              onClick={disconnectPhantomWallet}
            >
              Disconnect Phantom
            </Button>
          ) : (
            <Button 
              className="w-full" 
              onClick={connectPhantomWallet}
              disabled={isConnecting}
            >
              Connect Phantom
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Metamask Wallet Card */}
      <Card className={`${isMetamaskConnected ? 'border-primary/50' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="https://metamask.io/images/favicon-32x32.png" alt="Metamask" className="h-6 w-6" />
              <CardTitle>Metamask Wallet</CardTitle>
            </div>
            <Badge variant="outline">Ethereum</Badge>
          </div>
          <CardDescription>Connect your Ethereum wallet to manage energy transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {isMetamaskConnected ? (
            <div className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-md">
                <p className="mb-2 text-sm text-muted-foreground">Connected wallet:</p>
                <p className="font-mono text-sm break-all bg-background p-2 rounded border">{metamaskWalletAddress}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Connected
                </Badge>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-4 space-y-4">
              <div className="rounded-full bg-muted/80 p-6">
                <Wallet className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-center">Metamask wallet not connected</p>
              {!metamaskAvailable && (
                <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                  Not Installed
                </Badge>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          {isMetamaskConnected ? (
            <Button 
              className="w-full" 
              variant="destructive" 
              onClick={disconnectMetamaskWallet}
            >
              Disconnect Metamask
            </Button>
          ) : (
            <Button 
              className="w-full" 
              onClick={connectMetamaskWallet}
              disabled={isConnecting || !metamaskAvailable}
            >
              {metamaskAvailable ? 'Connect Metamask' : 'Install Metamask'}
            </Button>
          )}
        </CardFooter>
      </Card>

      <div className="md:col-span-2 p-4 border rounded-lg bg-muted/30 text-sm mt-2">
        <h3 className="font-medium mb-2">About Blockchain Wallets</h3>
        <p className="mb-2">Connecting your blockchain wallet allows you to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Record energy transactions on the blockchain</li>
          <li>Verify your identity for P2P trading</li>
          <li>Participate in the decentralized energy market</li>
          <li>Access your transaction history across devices</li>
        </ul>
        <p className="mt-2 text-muted-foreground">Your wallet address is never shared with third parties and remains under your control.</p>
      </div>
    </div>
  );
};

// Remove the duplicate interface declaration here and use the one from vite-env.d.ts

export default BlockchainWalletConnect;
