
export interface Bid {
  buyerId?: string;
  sellerId?: string;
  price: number;
  quantity: number;
  exists: boolean;
}

export interface AuctionResult {
  buyer: string;
  seller: string;
  quantityTraded: number;
  clearingPrice: number;
  timestamp: number;
  // Enhanced fields for transaction details
  blockchainTx?: string;
  blockchainNetwork?: string;  // 'solana' or 'ethereum'
  location?: string;
  feesPaid?: number;
  settlementTime?: number;
  transactionId?: string;
  status?: string;
  blockHeight?: number;
  confirmations?: number;
  gasFee?: number;
  energyType?: string;  // 'solar', 'wind', etc.
}

export interface BidsByUser {
  buyBids: Bid[];
  sellBids: Bid[];
}
