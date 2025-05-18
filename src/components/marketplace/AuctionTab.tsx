
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Clock } from 'lucide-react';
import { AuctionListing } from './types';
import { toast } from 'sonner';

interface AuctionTabProps {
  auctionListings: AuctionListing[];
  isLoading: boolean;
}

const AuctionTab = ({ auctionListings, isLoading }: AuctionTabProps) => {
  const [bidAmount, setBidAmount] = useState<Record<string, string>>({});

  // Handle bid submission
  const handleBid = (id: string, seller: string) => {
    if (!bidAmount[id] || parseFloat(bidAmount[id]) <= 0) {
      toast.error("Please enter a valid bid amount");
      return;
    }
    
    toast.success(`Bid of ₹${bidAmount[id]}/kWh placed for ${seller}`, {
      description: "You will be notified if your bid is successful",
    });
    
    // Reset bid amount
    setBidAmount(prev => ({...prev, [id]: ''}));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {auctionListings.map((listing) => (
        <Card key={listing.id} className="overflow-hidden">
          <CardHeader className="p-0">
            <div className={`h-3 w-full ${
              listing.source === 'Solar' ? 'bg-amber-500' : 
              listing.source === 'Wind' ? 'bg-blue-500' : 
              'bg-green-500'
            }`} />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold">{listing.seller}</h3>
                  {listing.green_certified && (
                    <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                      <Check className="h-3 w-3 mr-1" /> Green
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {listing.source} • {listing.distance} away
                </p>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Available</span>
                <span className="text-sm font-medium">{listing.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Starting Price</span>
                <span className="text-sm font-medium">{listing.starting_price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Current Bid</span>
                <span className="text-sm font-medium font-bold text-primary">
                  {listing.current_bid}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Bids</span>
                <span className="text-sm font-medium">{listing.bids}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ends in</span>
                <span className="text-sm font-medium flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-amber-500" />
                  {listing.ends_in}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-4">
              <Input 
                type="number" 
                placeholder="Your bid (₹/kWh)" 
                value={bidAmount[listing.id] || ''}
                onChange={(e) => setBidAmount({...bidAmount, [listing.id]: e.target.value})}
                min={parseFloat(listing.current_bid.replace('₹', '').replace('/kWh', ''))}
                step="0.05"
                className="flex-1"
              />
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 flex justify-between">
            <Button variant="outline">View Details</Button>
            <Button onClick={() => handleBid(listing.id, listing.seller)}>
              Place Bid
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default AuctionTab;
