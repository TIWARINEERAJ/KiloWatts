import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { buyExamples, sellExamples } from "@/utils/auctionExamples";
import BidForm from "./BidForm";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bid } from "@/utils/auction/types";

interface BiddingFormProps {
  isConnected: boolean;
  placeBuyBid: (quantity: number, price: number) => void;
  placeSellBid: (quantity: number, price: number) => void;
  cancelAllBids: () => void;
  userBids: { buyBids: Bid[], sellBids: Bid[] };
  cancelSpecificBid: (isBuyBid: boolean, price: number, quantity: number) => void;
}

const BiddingForm = ({
  isConnected,
  placeBuyBid,
  placeSellBid,
  cancelAllBids,
  userBids,
  cancelSpecificBid,
}: BiddingFormProps) => {
  const [activeTab, setActiveTab] = useState<string>("buy");
  
  const handleCancelAllBids = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Cancel all bids clicked");
    cancelAllBids();
  };
  
  const handleCancelSpecificBid = (isBuyBid: boolean, price: number, quantity: number) => {
    console.log(`Cancel ${isBuyBid ? 'buy' : 'sell'} bid clicked: price=${price}, quantity=${quantity}`);
    cancelSpecificBid(isBuyBid, price, quantity);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place Bids</CardTitle>
        <CardDescription>Buy or sell energy on the marketplace</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="buy" className="w-1/2">Buy Energy</TabsTrigger>
            <TabsTrigger value="sell" className="w-1/2">Sell Energy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buy">
            <BidForm 
              type="buy"
              isConnected={isConnected}
              examples={buyExamples}
              onSubmit={placeBuyBid}
            />
            
            {userBids.buyBids.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Your Buy Bids</h4>
                <div className="max-h-48 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Quantity (kWh)</TableHead>
                        <TableHead>Price (₹)</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userBids.buyBids.map((bid, index) => (
                        <TableRow key={`buy-${index}`}>
                          <TableCell>{bid.quantity.toFixed(2)}</TableCell>
                          <TableCell>{bid.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleCancelSpecificBid(true, bid.price, bid.quantity)}
                            >
                              Cancel
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sell">
            <BidForm 
              type="sell"
              isConnected={isConnected}
              examples={sellExamples}
              onSubmit={placeSellBid}
            />
            
            {userBids.sellBids.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Your Sell Bids</h4>
                <div className="max-h-48 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Quantity (kWh)</TableHead>
                        <TableHead>Price (₹)</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userBids.sellBids.map((bid, index) => (
                        <TableRow key={`sell-${index}`}>
                          <TableCell>{bid.quantity.toFixed(2)}</TableCell>
                          <TableCell>{bid.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleCancelSpecificBid(false, bid.price, bid.quantity)}
                            >
                              Cancel
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 pt-4 border-t">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleCancelAllBids}
            disabled={!isConnected}
            type="button"
          >
            Cancel All My Bids
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BiddingForm;
