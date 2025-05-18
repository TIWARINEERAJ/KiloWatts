
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Calendar, CreditCard, Download, FileText, Search, User, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Types for our data
type Transaction = {
  id: string;
  date: string;
  time: string;
  type: string;
  counterparty: string;
  amount: string;
  rate: string;
  total: string;
  status: string;
  blockchain_tx: string;
  location?: string;
}

type BillingRecord = {
  id: string;
  period: string;
  issued: string;
  due_date: string;
  consumption: string;
  production: string;
  net_amount: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Fetch functions for Supabase
const fetchTransactions = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*');

  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
  
  // Generate additional fields for each transaction
  const locations = ["Delhi", "Mumbai", "Chennai", "Kolkata", "Bangalore", "Hyderabad"];
  const enhancedData = data.map((tx: any) => ({
    ...tx,
    location: locations[Math.floor(Math.random() * locations.length)]
  }));

  // Add more sample transactions if fewer than 30
  if (enhancedData.length < 30) {
    const sampleTypes = ["purchase", "sale"];
    const sampleStatuses = ["completed", "processing", "pending"];
    const sampleCounterparties = [
      "Delhi Solar Co-op", "Mumbai Green Energy", "Bangalore Power Ltd",
      "Chennai Renewables", "Hyderabad Energy", "Kolkata Power Grid",
      "Pune Solar Plant", "Surat Wind Farm", "Jaipur Community Solar"
    ];
    
    const currentCount = enhancedData.length;
    
    for (let i = 0; i < 30 - currentCount; i++) {
      const type = sampleTypes[Math.floor(Math.random() * sampleTypes.length)];
      const amount = Math.floor(Math.random() * 100) + 10; // 10-110 kWh
      const rate = (Math.random() * 5 + 8).toFixed(2); // 8-13 INR
      const total = `₹${(parseFloat(rate) * amount).toFixed(2)}`;
      const status = sampleStatuses[Math.floor(Math.random() * sampleStatuses.length)];
      const counterparty = sampleCounterparties[Math.floor(Math.random() * sampleCounterparties.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      
      // Generate dates in the last 30 days
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      const formattedDate = date.toLocaleDateString();
      const formattedTime = date.toLocaleTimeString();

      enhancedData.push({
        id: `TX-${currentCount + i + 1}`,
        date: formattedDate,
        time: formattedTime,
        type,
        counterparty,
        amount: `${amount} kWh`,
        rate: `₹${rate}/kWh`,
        total,
        status,
        blockchain_tx: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        location
      });
    }
  }

  return enhancedData as Transaction[];
};

const fetchBillingRecords = async () => {
  const { data, error } = await supabase
    .from('billing')
    .select('*');

  if (error) {
    console.error('Error fetching billing records:', error);
    throw error;
  }
  
  // If fewer than 12 records, generate additional billing records (one for each month of the year)
  if (data.length < 12) {
    const currentCount = data.length;
    const months = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    
    for (let i = 0; i < 12 - currentCount; i++) {
      const monthIndex = i % 12;
      const currentYear = new Date().getFullYear();
      
      // Generate bill dates (issue date is 5th of the month, due date is 20th)
      const issueDate = `05/${monthIndex + 1}/${currentYear}`;
      const dueDate = `20/${monthIndex + 1}/${currentYear}`;
      
      // Random consumption between 200-500 kWh
      const consumption = `${Math.floor(Math.random() * 300) + 200} kWh`;
      
      // Random production between 0-300 kWh
      const production = `${Math.floor(Math.random() * 300)} kWh`;
      
      // Calculate net amount based on consumption and production
      const consumptionValue = parseInt(consumption.replace(' kWh', ''));
      const productionValue = parseInt(production.replace(' kWh', ''));
      const rate = 10; // ₹10 per kWh
      const netAmount = `₹${(consumptionValue - productionValue) * rate}`;
      
      // Status - paid for past months, unpaid for current/future
      const today = new Date();
      const billMonth = monthIndex + 1;
      const billIsPast = billMonth < today.getMonth() + 1;
      const status = billIsPast ? "paid" : "unpaid";
      
      // Create timestamps for created_at and updated_at
      const currentDate = new Date();
      const billDate = new Date(currentYear, monthIndex, 5);
      const created_at = billDate.toISOString();
      const updated_at = currentDate.toISOString();
      
      data.push({
        id: `BILL-${currentYear}-${(monthIndex + 1).toString().padStart(2, '0')}`,
        period: `${months[monthIndex]} ${currentYear}`,
        issued: issueDate,
        due_date: dueDate,
        consumption,
        production,
        net_amount: netAmount,
        status,
        created_at,
        updated_at
      });
    }
  }

  return data as BillingRecord[];
};

const TransactionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedBill, setSelectedBill] = useState<BillingRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isBillDetailsOpen, setIsBillDetailsOpen] = useState<boolean>(false);
  
  // Use React Query to fetch data
  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  const { data: billingHistory = [], isLoading: isLoadingBilling } = useQuery({
    queryKey: ['billing'],
    queryFn: fetchBillingRecords,
  });
  
  // Filter transactions based on search and tab
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      transaction.counterparty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'purchases' && transaction.type === 'purchase') ||
      (activeTab === 'sales' && transaction.type === 'sale');
    
    return matchesSearch && matchesTab;
  });
  
  // Get current transactions for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  
  // Calculate transaction statistics
  const totalPurchased = transactions
    .filter(t => t.type === 'purchase')
    .reduce((sum, t) => sum + parseInt(t.amount.replace(' kWh', '')), 0);
  
  const totalSold = transactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + parseInt(t.amount.replace(' kWh', '')), 0);
  
  const totalSpent = transactions
    .filter(t => t.type === 'purchase')
    .reduce((sum, t) => sum + parseInt(t.total.replace('₹', '')), 0);
  
  const totalEarned = transactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + parseInt(t.total.replace('₹', '')), 0);

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsOpen(true);
  };

  const handleViewBill = (bill: BillingRecord) => {
    setSelectedBill(bill);
    setIsBillDetailsOpen(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Energy Transactions</h1>
            <p className="text-muted-foreground">
              View and manage your energy purchases, sales, and billing.
            </p>
          </div>
          <Button className="mt-4 md:mt-0" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Energy Purchased</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPurchased} kWh</div>
              <p className="text-xs text-muted-foreground mt-1">in last 30 days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Energy Sold</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSold} kWh</div>
              <p className="text-xs text-muted-foreground mt-1">in last 30 days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Amount Spent</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">in last 30 days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Amount Earned</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalEarned.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">in last 30 days</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="transactions" className="mb-8">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 my-6">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search transactions..." 
                className="pl-9 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <TabsList>
                <TabsTrigger value="all" onClick={() => setActiveTab('all')} className={activeTab === 'all' ? 'bg-primary text-white' : ''}>
                  All
                </TabsTrigger>
                <TabsTrigger value="purchases" onClick={() => setActiveTab('purchases')} className={activeTab === 'purchases' ? 'bg-primary text-white' : ''}>
                  Purchases
                </TabsTrigger>
                <TabsTrigger value="sales" onClick={() => setActiveTab('sales')} className={activeTab === 'sales' ? 'bg-primary text-white' : ''}>
                  Sales
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          <TabsContent value="transactions" className="mt-0">
            <Card>
              <CardContent className="p-0">
                {isLoadingTransactions ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Counterparty</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentTransactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-medium">{tx.id}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{tx.date}</span>
                              <span className="text-xs text-muted-foreground">{tx.time}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={tx.type === 'purchase' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                              {tx.type === 'purchase' ? 'Purchase' : 'Sale'}
                            </Badge>
                          </TableCell>
                          <TableCell>{tx.counterparty}</TableCell>
                          <TableCell>{tx.amount}</TableCell>
                          <TableCell>{tx.rate}</TableCell>
                          <TableCell className="font-medium">{tx.total}</TableCell>
                          <TableCell>
                            <Badge className={
                              tx.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              tx.status === 'processing' ? 'bg-amber-100 text-amber-800' : 
                              'bg-red-100 text-red-800'
                            }>
                              {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewTransaction(tx)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                
                {!isLoadingTransactions && currentTransactions.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                  </div>
                )}
              </CardContent>
              
              {!isLoadingTransactions && filteredTransactions.length > 0 && (
                <div className="py-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(prev => Math.max(prev - 1, 1));
                          }} 
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                            isActive={page === currentPage}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(prev => Math.min(prev + 1, totalPages));
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </Card>
            
            <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
              <h3 className="text-sm font-semibold mb-2">About Blockchain Transactions</h3>
              <p className="text-sm text-muted-foreground">
                All energy trades are secured on the Solana blockchain, providing transparent and tamper-proof 
                records of every transaction. Click "View" on any transaction to see its blockchain details.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="billing" className="mt-0">
            <Card>
              <CardContent className="p-0">
                {isLoadingBilling ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>Billing Period</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Consumption</TableHead>
                        <TableHead>Production</TableHead>
                        <TableHead>Net Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {billingHistory.map((bill) => (
                        <TableRow key={bill.id}>
                          <TableCell className="font-medium">{bill.id}</TableCell>
                          <TableCell>{bill.period}</TableCell>
                          <TableCell>{bill.issued}</TableCell>
                          <TableCell>{bill.due_date}</TableCell>
                          <TableCell>{bill.consumption}</TableCell>
                          <TableCell>{bill.production}</TableCell>
                          <TableCell className="font-medium">{bill.net_amount}</TableCell>
                          <TableCell>
                            <Badge className={bill.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                              {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {bill.status === 'unpaid' ? (
                              <Button size="sm" onClick={() => handleViewBill(bill)}>Pay Now</Button>
                            ) : (
                              <Button variant="outline" size="sm" onClick={() => handleViewBill(bill)}>View</Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                
                {!isLoadingBilling && billingHistory.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No billing records found</h3>
                    <p className="text-muted-foreground">Your billing history will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
              <h3 className="text-sm font-semibold mb-2">About Integrated Billing</h3>
              <p className="text-sm text-muted-foreground">
                The P2P energy trading platform integrates with existing billing systems to provide 
                a consolidated view of your energy consumption, production, and financial transactions.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Transaction Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
              <DialogDescription>
                Complete information about this energy trading transaction
              </DialogDescription>
            </DialogHeader>
            
            {selectedTransaction && (
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Transaction Details</TabsTrigger>
                  <TabsTrigger value="blockchain">Blockchain Record</TabsTrigger>
                  <TabsTrigger value="invoice">Invoice</TabsTrigger>
                </TabsList>
                
                {/* Transaction Details Tab */}
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Transaction ID</p>
                      <p>{selectedTransaction.id}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
                      <p>{selectedTransaction.date} {selectedTransaction.time}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Location</p>
                      <p>{selectedTransaction.location || "Delhi"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge className={
                        selectedTransaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        selectedTransaction.status === 'processing' ? 'bg-amber-100 text-amber-800' : 
                        'bg-red-100 text-red-800'
                      }>
                        {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Transaction Type</p>
                      <Badge variant="outline" className="capitalize">{selectedTransaction.type}</Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Counterparty</p>
                      <p>{selectedTransaction.counterparty}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Amount</p>
                      <p>{selectedTransaction.amount}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Rate</p>
                      <p>{selectedTransaction.rate}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                      <p className="font-semibold">{selectedTransaction.total}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Fees</p>
                      <p>₹{(parseInt(selectedTransaction.total.replace('₹', '')) * 0.02).toFixed(2)} (2%)</p>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Blockchain Record Tab */}
                <TabsContent value="blockchain" className="space-y-6">
                  <div className="p-4 border rounded-md bg-muted/30">
                    <h4 className="font-medium mb-4">Blockchain Transaction</h4>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Transaction Hash</p>
                        <p className="font-mono text-sm break-all">{selectedTransaction.blockchain_tx}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Block Number</p>
                          <p className="font-mono">{Math.floor(Math.random() * 10000000) + 20000000}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Block Time</p>
                          <p>{selectedTransaction.date} {selectedTransaction.time}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Status</p>
                          <Badge className="bg-green-100 text-green-800">Success</Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Confirmations</p>
                          <p>{Math.floor(Math.random() * 1000) + 50}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium mb-4">Smart Contract Details</h4>
                    <div className="grid gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Contract Address</p>
                        <p className="font-mono text-sm break-all">
                          0x{Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Function</p>
                          <p className="font-mono">transferEnergy()</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Network</p>
                          <p>Solana Mainnet</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Transaction Data</p>
                        <div className="bg-muted/50 p-3 rounded-md">
                          <p className="font-mono text-xs break-all">
                            {`{
  "buyer": "${selectedTransaction.type === 'purchase' ? 'You' : selectedTransaction.counterparty}",
  "seller": "${selectedTransaction.type === 'sale' ? 'You' : selectedTransaction.counterparty}",
  "amount": "${selectedTransaction.amount.replace(' kWh', '')}",
  "price": "${selectedTransaction.rate.replace('₹', '').replace('/kWh', '')}",
  "timestamp": "${Date.parse(`${selectedTransaction.date} ${selectedTransaction.time}`) / 1000}",
  "status": "${selectedTransaction.status}"
}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Button variant="link" className="text-primary">
                      View on Solana Explorer
                    </Button>
                  </div>
                </TabsContent>
                
                {/* Invoice Tab */}
                <TabsContent value="invoice" className="space-y-6">
                  <div className="border rounded-lg p-6 bg-white dark:bg-muted/10">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-xl font-bold">Energy Trading Invoice</h3>
                        <p className="text-muted-foreground">
                          SolarSwap P2P Energy Trading Platform
                        </p>
                      </div>
                      <div className="text-right">
                        <h4 className="font-semibold">Invoice #{selectedTransaction.id}</h4>
                        <p>Date: {selectedTransaction.date}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="border-r pr-6">
                        <h4 className="text-sm font-semibold mb-1">From</h4>
                        {selectedTransaction.type === 'purchase' ? (
                          <div>
                            <p>{selectedTransaction.counterparty}</p>
                            <p className="text-sm text-muted-foreground">{selectedTransaction.location || "Delhi"}, India</p>
                          </div>
                        ) : (
                          <div>
                            <p>Your Account</p>
                            <p className="text-sm text-muted-foreground">User ID: {Math.random().toString(36).substring(2, 10)}</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">To</h4>
                        {selectedTransaction.type === 'sale' ? (
                          <div>
                            <p>{selectedTransaction.counterparty}</p>
                            <p className="text-sm text-muted-foreground">{selectedTransaction.location || "Delhi"}, India</p>
                          </div>
                        ) : (
                          <div>
                            <p>Your Account</p>
                            <p className="text-sm text-muted-foreground">User ID: {Math.random().toString(36).substring(2, 10)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <table className="w-full mb-8">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Description</th>
                          <th className="text-right py-2">Quantity</th>
                          <th className="text-right py-2">Rate</th>
                          <th className="text-right py-2">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3">{selectedTransaction.type === 'purchase' ? 'Energy Purchase' : 'Energy Sale'}</td>
                          <td className="py-3 text-right">{selectedTransaction.amount}</td>
                          <td className="py-3 text-right">{selectedTransaction.rate}</td>
                          <td className="py-3 text-right">{selectedTransaction.total}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">Platform Fee (2%)</td>
                          <td className="py-3 text-right">-</td>
                          <td className="py-3 text-right">-</td>
                          <td className="py-3 text-right">₹{(parseInt(selectedTransaction.total.replace('₹', '')) * 0.02).toFixed(2)}</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={3} className="py-3 text-right font-bold">Total</td>
                          <td className="py-3 text-right font-bold">
                            {selectedTransaction.total}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                    
                    <div className="space-y-2 mb-8">
                      <div className="flex justify-between">
                        <span className="text-sm">Transaction ID:</span>
                        <span className="text-sm">{selectedTransaction.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Blockchain TX:</span>
                        <span className="text-sm font-mono">{selectedTransaction.blockchain_tx.substring(0, 16)}...</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Status:</span>
                        <Badge className={
                          selectedTransaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          selectedTransaction.status === 'processing' ? 'bg-amber-100 text-amber-800' : 
                          'bg-red-100 text-red-800'
                        }>
                          {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        Thank you for using SolarSwap P2P Energy Trading Platform.
                        This invoice serves as proof of transaction on our platform.
                      </p>
                      <Button>
                        <FileText className="mr-2 h-4 w-4" />
                        Download Invoice PDF
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Bill Details Dialog */}
        <Dialog open={isBillDetailsOpen} onOpenChange={setIsBillDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Billing Details</DialogTitle>
              <DialogDescription>
                Complete information about your monthly energy bill
              </DialogDescription>
            </DialogHeader>
            
            {selectedBill && (
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Bill Details</TabsTrigger>
                  <TabsTrigger value="payment">Payment</TabsTrigger>
                  <TabsTrigger value="history">Usage History</TabsTrigger>
                </TabsList>
                
                {/* Bill Details Tab */}
                <TabsContent value="details" className="space-y-4">
                  <div className="border rounded-lg p-6 bg-white dark:bg-muted/10">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-bold">Monthly Energy Statement</h3>
                        <p className="text-muted-foreground">
                          Billing Period: {selectedBill.period}
                        </p>
                      </div>
                      <div className="text-right">
                        <h4 className="font-semibold">Bill #{selectedBill.id}</h4>
                        <p className="text-sm">Issued: {selectedBill.issued}</p>
                        <p className="text-sm">Due: {selectedBill.due_date}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Customer Information</h4>
                        <p>John Doe</p>
                        <p className="text-sm text-muted-foreground">Account #: AC-{Math.floor(Math.random() * 100000)}</p>
                        <p className="text-sm text-muted-foreground">Meter ID: MT-{Math.floor(Math.random() * 100000)}</p>
                        <p className="text-sm text-muted-foreground">123 Energy Street, Delhi</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Bill Summary</h4>
                        <div className="flex justify-between text-sm">
                          <span>Previous Balance:</span>
                          <span>₹0.00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Payments:</span>
                          <span>-₹0.00</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="font-semibold">Current Charges:</span>
                          <span className="font-semibold">{selectedBill.net_amount}</span>
                        </div>
                        <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                          <span>Total Amount Due:</span>
                          <span>{selectedBill.net_amount}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold mb-2">Usage Details</h4>
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Description</th>
                            <th className="text-right py-2">Amount</th>
                            <th className="text-right py-2">Rate</th>
                            <th className="text-right py-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2">Energy Consumption</td>
                            <td className="py-2 text-right">{selectedBill.consumption}</td>
                            <td className="py-2 text-right">₹10.00/kWh</td>
                            <td className="py-2 text-right">
                              ₹{parseInt(selectedBill.consumption.replace(' kWh', '')) * 10}
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">Energy Production (Credit)</td>
                            <td className="py-2 text-right">-{selectedBill.production}</td>
                            <td className="py-2 text-right">₹10.00/kWh</td>
                            <td className="py-2 text-right">
                              -₹{parseInt(selectedBill.production.replace(' kWh', '')) * 10}
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">Transmission Charges</td>
                            <td className="py-2 text-right">-</td>
                            <td className="py-2 text-right">-</td>
                            <td className="py-2 text-right">₹100.00</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">Fixed Charges</td>
                            <td className="py-2 text-right">-</td>
                            <td className="py-2 text-right">-</td>
                            <td className="py-2 text-right">₹50.00</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">Green Energy Incentive</td>
                            <td className="py-2 text-right">-</td>
                            <td className="py-2 text-right">-</td>
                            <td className="py-2 text-right">-₹75.00</td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={3} className="py-2 text-right font-bold">Total Bill Amount</td>
                            <td className="py-2 text-right font-bold">{selectedBill.net_amount}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    
                    <div className="mt-6 text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        Thank you for being a part of our renewable energy community.
                      </p>
                      <Button>
                        <FileText className="mr-2 h-4 w-4" />
                        Download Statement PDF
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Payment Tab */}
                <TabsContent value="payment">
                  <div className="space-y-6">
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">Bill Summary</h3>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Bill Number</p>
                          <p>{selectedBill.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Billing Period</p>
                          <p>{selectedBill.period}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Due Date</p>
                          <p>{selectedBill.due_date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Amount Due</p>
                          <p className="font-semibold">{selectedBill.net_amount}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center bg-muted/30 p-3 rounded-md">
                        <div>
                          <p className="font-medium">Status</p>
                          <Badge className={selectedBill.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                            {selectedBill.status.charAt(0).toUpperCase() + selectedBill.status.slice(1)}
                          </Badge>
                        </div>
                        {selectedBill.status === 'unpaid' && (
                          <Button>Pay Now</Button>
                        )}
                        {selectedBill.status === 'paid' && (
                          <Badge variant="outline" className="bg-green-50">Payment Received</Badge>
                        )}
                      </div>
                    </div>
                    
                    {selectedBill.status === 'unpaid' && (
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium mb-4">Payment Methods</h3>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <Button variant="outline" className="flex flex-col h-20 gap-1">
                            <CreditCard className="h-5 w-5" />
                            <span>Credit Card</span>
                          </Button>
                          <Button variant="outline" className="flex flex-col h-20 gap-1">
                            <Wallet className="h-5 w-5" />
                            <span>UPI</span>
                          </Button>
                          <Button variant="outline" className="flex flex-col h-20 gap-1">
                            <FileText className="h-5 w-5" />
                            <span>Net Banking</span>
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Choose your preferred payment method to complete the transaction.
                        </p>
                      </div>
                    )}
                    
                    {selectedBill.status === 'paid' && (
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium mb-2">Payment Details</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Payment Date</p>
                            <p>{new Date(Date.parse(selectedBill.issued) + 3*24*60*60*1000).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Payment Method</p>
                            <p>Credit Card (ending 4567)</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Transaction ID</p>
                            <p>TXN-{Math.floor(Math.random() * 1000000)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Amount Paid</p>
                            <p className="font-semibold">{selectedBill.net_amount}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t">
                          <Button variant="outline">
                            <FileText className="mr-2 h-4 w-4" />
                            Download Receipt
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                {/* Usage History Tab */}
                <TabsContent value="history">
                  <div className="border rounded-md p-4 space-y-4">
                    <h3 className="font-medium mb-2">Monthly Usage Comparison</h3>
                    <div className="h-64 bg-muted/30 rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground">Energy usage chart would appear here</p>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold mb-2">6-Month Usage History</h4>
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Month</th>
                            <th className="text-right py-2">Consumption (kWh)</th>
                            <th className="text-right py-2">Production (kWh)</th>
                            <th className="text-right py-2">Net (kWh)</th>
                            <th className="text-right py-2">Bill Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from({ length: 6 }).map((_, i) => {
                            // Generate sample data for the past 6 months
                            const currentMonth = new Date().getMonth();
                            const monthIndex = (currentMonth - i + 12) % 12;
                            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                            const year = new Date().getFullYear() - (monthIndex > currentMonth ? 1 : 0);
                            
                            const consumption = Math.floor(Math.random() * 300) + 200;
                            const production = Math.floor(Math.random() * 300);
                            const net = consumption - production;
                            const billAmount = (net * 10) + 150; // 10 per kWh plus fixed charges
                            
                            return (
                              <tr key={i} className="border-b">
                                <td className="py-2">{`${months[monthIndex]} ${year}`}</td>
                                <td className="py-2 text-right">{consumption}</td>
                                <td className="py-2 text-right">{production}</td>
                                <td className="py-2 text-right">{net}</td>
                                <td className="py-2 text-right">₹{billAmount}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t flex justify-between">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Energy Saving Tips</h4>
                        <p className="text-sm text-muted-foreground">
                          View our recommendations for reducing your energy consumption.
                        </p>
                      </div>
                      <Button variant="outline">View Tips</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default TransactionsPage;
