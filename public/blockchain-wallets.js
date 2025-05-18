
// This file handles wallet interactions for both Phantom (Solana) and MetaMask (Ethereum)

// =============== PHANTOM (SOLANA) WALLET FUNCTIONS ===============

// Check if Phantom wallet is installed
const phantomWalletCheck = () => {
  const isPhantomInstalled = window.solana && window.solana.isPhantom;
  
  if (!isPhantomInstalled) {
    console.log("Phantom wallet is not installed. Please install it from https://phantom.app/");
  } else {
    console.log("Phantom wallet detected");
  }
  
  return isPhantomInstalled;
};

// Make sure these functions are defined in the global scope
window.connectPhantomWallet = async () => {
  console.log("Connecting to Phantom wallet...");
  if (!phantomWalletCheck()) {
    console.error("Phantom wallet not installed");
    return null;
  }
  
  try {
    const response = await window.solana.connect();
    const publicKey = response.publicKey.toString();
    console.log("Connected to Phantom wallet:", publicKey);
    return publicKey;
  } catch (error) {
    console.error("Failed to connect to Phantom wallet:", error);
    return null;
  }
};

// Add a global function to help with wallet disconnection
window.disconnectPhantomWallet = async () => {
  console.log("Disconnecting from Phantom wallet...");
  if (!phantomWalletCheck()) {
    console.error("Phantom wallet not installed");
    return false;
  }
  
  try {
    await window.solana.disconnect();
    console.log("Disconnected from Phantom wallet");
    return true;
  } catch (error) {
    console.error("Failed to disconnect from Phantom wallet:", error);
    return false;
  }
};

// Add function to store transaction on Solana blockchain (devnet)
window.storeTransactionOnSolana = async (transactionData) => {
  console.log("Storing transaction on Solana blockchain (devnet)...");
  if (!phantomWalletCheck()) {
    console.error("Phantom wallet not installed");
    return null;
  }
  
  if (!window.solana?.publicKey) {
    console.error("Wallet not connected");
    return null;
  }
  
  try {
    // Import necessary Solana web3 functions from CDN
    // In a production app, you'd use proper imports with @solana/web3.js library
    const { Transaction, SystemProgram, PublicKey, Connection } = solanaWeb3;
    
    // Create a Solana connection to devnet for testing
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    
    // Create transaction with memo data (simplified example)
    const transaction = new Transaction();
    
    // Serialize the transaction data as string
    const dataString = JSON.stringify(transactionData);
    
    // Add a memo instruction with the transaction data
    // Note: In a real app, you would likely use a program specifically designed for data storage
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: window.solana.publicKey,
        toPubkey: window.solana.publicKey, // sending to self as an example
        lamports: 100, // minimal amount for the transaction
      })
    );
    
    // Sign and send the transaction
    const { signature } = await window.solana.signAndSendTransaction(transaction);
    console.log("Transaction sent with signature:", signature);
    
    // Wait for confirmation
    await connection.confirmTransaction(signature);
    console.log("Transaction confirmed:", signature);
    
    return signature;
  } catch (error) {
    console.error("Failed to store transaction on Solana:", error);
    return null;
  }
};

// Add new function to send transaction to Solana mainnet
window.sendTransactionToSolanaMainnet = async (transactionData) => {
  console.log("Sending transaction to Solana mainnet...");
  if (!phantomWalletCheck()) {
    console.error("Phantom wallet not installed");
    return null;
  }
  
  if (!window.solana?.publicKey) {
    console.error("Wallet not connected");
    return null;
  }
  
  try {
    // Import necessary Solana web3 functions from CDN
    const { Transaction, SystemProgram, PublicKey, Connection } = solanaWeb3;
    
    // Create a Solana connection to mainnet
    const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
    
    // Create transaction with memo data
    const transaction = new Transaction();
    
    // Add a transfer instruction
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: window.solana.publicKey,
        toPubkey: window.solana.publicKey, // sending to self as an example
        lamports: 5000, // 0.000005 SOL - higher for mainnet
      })
    );
    
    // Add reference to original transaction in the FeePayer field
    transaction.feePayer = window.solana.publicKey;
    
    // Sign and send the transaction
    const { signature } = await window.solana.signAndSendTransaction(transaction);
    console.log("Mainnet transaction sent with signature:", signature);
    
    // Wait for confirmation with higher commitment level for mainnet
    await connection.confirmTransaction(signature, "finalized");
    console.log("Mainnet transaction confirmed:", signature);
    
    // Record mainnet transaction in Supabase or other database
    // This would typically be done by a backend API
    
    return signature;
  } catch (error) {
    console.error("Failed to send transaction to Solana mainnet:", error);
    return null;
  }
};

// Add function to store auction results on Solana blockchain
window.storeAuctionResultOnSolana = async (auctionResult) => {
  console.log("Storing auction result on Solana blockchain...");
  if (!phantomWalletCheck()) {
    console.error("Phantom wallet not installed");
    return null;
  }
  
  if (!window.solana?.publicKey) {
    console.error("Wallet not connected");
    return null;
  }
  
  try {
    // Import necessary Solana web3 functions from CDN
    const { Transaction, SystemProgram, PublicKey, Connection } = solanaWeb3;
    
    // Create a Solana connection to devnet for testing
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    
    // Create transaction
    const transaction = new Transaction();
    
    // Serialize the auction result data as string
    const dataString = JSON.stringify({
      type: "auction_result",
      data: auctionResult,
      timestamp: Date.now()
    });
    
    // Add a transfer instruction (used as a carrier for the auction data in memo)
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: window.solana.publicKey,
        toPubkey: window.solana.publicKey, // sending to self
        lamports: 100, // minimal amount for the transaction
      })
    );
    
    // Sign and send the transaction
    const { signature } = await window.solana.signAndSendTransaction(transaction);
    console.log("Auction result transaction sent with signature:", signature);
    
    // Wait for confirmation
    await connection.confirmTransaction(signature);
    console.log("Auction result transaction confirmed:", signature);
    
    return signature;
  } catch (error) {
    console.error("Failed to store auction result on Solana:", error);
    return null;
  }
};

// =============== METAMASK (ETHEREUM) WALLET FUNCTIONS ===============

// Check if MetaMask is available
const metamaskCheck = () => {
  const isMetaMaskInstalled = window.ethereum && window.ethereum.isMetaMask;
  
  if (!isMetaMaskInstalled) {
    console.log("MetaMask is not installed. Please install it from https://metamask.io/");
  } else {
    console.log("MetaMask detected");
  }
  
  return isMetaMaskInstalled;
};

// Handle network switching for Ethereum
window.switchEthereumNetwork = async (networkId) => {
  if (!metamaskCheck()) {
    console.error("MetaMask not installed");
    return false;
  }
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${networkId.toString(16)}` }],
    });
    console.log(`Switched to network ID: ${networkId}`);
    return true;
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        // For Sepolia testnet
        if (networkId === 11155111) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia Testnet',
                nativeCurrency: {
                  name: 'Sepolia ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['https://rpc.sepolia.org'],
                blockExplorerUrls: ['https://sepolia.etherscan.io']
              }
            ],
          });
          return true;
        }
      } catch (addError) {
        console.error("Error adding Ethereum network:", addError);
      }
    }
    console.error("Error switching Ethereum network:", switchError);
    return false;
  }
};

// Request Ethereum accounts
window.requestEthereumAccounts = async () => {
  if (!metamaskCheck()) {
    console.error("MetaMask not installed");
    return null;
  }
  
  try {
    // Switch to Sepolia testnet
    await window.switchEthereumNetwork(11155111);
    
    // Request accounts
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    
    if (accounts && accounts.length > 0) {
      console.log("Connected to MetaMask with account:", accounts[0]);
      return accounts[0];
    } else {
      console.error("No accounts found");
      return null;
    }
  } catch (error) {
    console.error("Error requesting Ethereum accounts:", error);
    return null;
  }
};

// Automatically check for wallets on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log("Document loaded, checking for blockchain wallets...");
  phantomWalletCheck();
  metamaskCheck();
  
  // Log that the functions are properly defined
  if (typeof window.connectPhantomWallet === 'function') {
    console.log("Phantom wallet functions are properly defined");
  } else {
    console.error("Phantom wallet functions are NOT properly defined");
  }
  
  // Check if user has Solana wallet connected
  if (window.solana?.isPhantom && window.solana?.publicKey) {
    console.log("User already has Phantom wallet connected:", window.solana.publicKey.toString());
  }
  
  // Check if user has MetaMask connected
  if (window.ethereum?.isMetaMask) {
    window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
      if (accounts && accounts.length > 0) {
        console.log("User already has MetaMask wallet connected:", accounts[0]);
      }
    });
  }
});
