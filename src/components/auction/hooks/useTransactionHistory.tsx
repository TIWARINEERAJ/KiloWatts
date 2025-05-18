
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Transaction {
  id: string;
  buyer_address: string;
  seller_address: string;
  quantity: number;
  price: number;
  total_value: number;
  transaction_type: string;
  status: string;
  blockchain_tx: string | null;
  created_at: string;
  location?: string;
  fees_paid?: number;
  settlement_time?: number;
  transaction_id?: string;
}

interface UseTransactionHistoryProps {
  refreshTrigger?: number;
  limit?: number;
}

export const useTransactionHistory = ({ refreshTrigger = 0, limit = 100 }: UseTransactionHistoryProps = {}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching transactions, user:", user?.id || "not authenticated", "limit:", limit);
        
        // Start with a query that will fetch transactions
        let query = supabase
          .from('auction_transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);
          
        // If user is authenticated, filter by user_id
        if (user?.id) {
          query = query.eq('user_id', user.id);
        }
        
        const { data, error } = await query;
          
        if (error) {
          console.error('Error fetching transaction history:', error);
          toast.error('Failed to load transaction history');
          return;
        }
        
        console.log("Fetched transactions:", data?.length || 0);
        
        // Generate additional mock data for each transaction
        const formattedTransactions = data?.map(item => {
          const locations = ["Delhi", "Mumbai", "Chennai", "Kolkata", "Bangalore", "Hyderabad"];
          const randomLocation = locations[Math.floor(Math.random() * locations.length)];
          const settlementTime = Math.floor(Math.random() * 300) + 10; // 10-310 seconds
          const feesPaid = item.total_value * 0.02; // 2% transaction fee
          
          return {
            id: item.id,
            buyer_address: item.buyer_address,
            seller_address: item.seller_address,
            quantity: item.quantity,
            price: item.price,
            total_value: item.total_value,
            transaction_type: item.transaction_type,
            status: item.status,
            blockchain_tx: item.blockchain_tx,
            created_at: item.created_at,
            // Enhanced transaction details
            location: randomLocation,
            fees_paid: feesPaid,
            settlement_time: settlementTime,
            transaction_id: `TX-${item.id.substring(0, 8)}`
          };
        }) || [];
        
        setTransactions(formattedTransactions);
      } catch (err) {
        console.error('Exception fetching transaction history:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, [user, refreshTrigger, limit]);
  
  return { transactions, isLoading };
};
