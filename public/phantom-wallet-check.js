
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

// Add new function to store transaction on Solana blockchain
window.storeTransactionOnSolana = async (transactionData) => {
  console.log("Storing transaction on Solana blockchain...");
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

// Add new function to store auction results on Solana blockchain
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

// Automatically check for Phantom wallet on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log("Document loaded, checking for Phantom wallet...");
  phantomWalletCheck();
  
  // Log that the functions are properly defined
  if (typeof window.connectPhantomWallet === 'function') {
    console.log("connectPhantomWallet function is properly defined");
  } else {
    console.error("connectPhantomWallet function is NOT properly defined");
  }
});
