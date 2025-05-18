
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Calendar } from 'lucide-react';
import { TimeOfDayListing } from './types';
import { toast } from 'sonner';

interface TimeOfDayTabProps {
  timeOfDayListings: TimeOfDayListing[];
  isLoading: boolean;
}

const TimeOfDayTab = ({ timeOfDayListings, isLoading }: TimeOfDayTabProps) => {
  // Handle scheduled purchase
  const handleScheduledPurchase = (id: string, seller: string) => {
    toast.success(`Scheduled purchase requested from ${seller}`, {
      description: "Energy will be delivered according to the selected time slots",
    });
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
      {timeOfDayListings.map((listing) => (
        <Card key={listing.id} className="overflow-hidden">
          <CardHeader className="p-0">
            <div className={`h-3 w-full ${
              listing.source.includes('Solar') ? 'bg-amber-500' : 
              listing.source.includes('Wind') ? 'bg-blue-500' : 
              'bg-gradient-to-r from-amber-500 to-blue-500'
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
                <span className="text-sm text-muted-foreground">
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Peak</Badge>
                </span>
                <div className="text-right">
                  <span className="text-sm font-medium">{listing.peak_price}</span>
                  <p className="text-xs text-muted-foreground">{listing.peak_hours}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Off-Peak</Badge>
                </span>
                <div className="text-right">
                  <span className="text-sm font-medium">{listing.off_peak_price}</span>
                  <p className="text-xs text-muted-foreground">{listing.off_peak_hours}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Standard</Badge>
                </span>
                <span className="text-sm font-medium">{listing.standard_price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Available From</span>
                <span className="text-sm font-medium flex items-center">
                  <Calendar className="h-3 w-3 mr-1 text-blue-500" />
                  {listing.available_from}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 flex justify-between">
            <Button variant="outline">View Schedule</Button>
            <Button onClick={() => handleScheduledPurchase(listing.id, listing.seller)}>
              Schedule Purchase
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TimeOfDayTab;
