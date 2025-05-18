
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, User, Zap } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { EnergyListing } from './types';
import { toast } from 'sonner';

interface FixedPriceTabProps {
  currentListings: EnergyListing[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  isLoading: boolean;
}

const FixedPriceTab = ({ currentListings, currentPage, setCurrentPage, totalPages, isLoading }: FixedPriceTabProps) => {
  // Handle purchase action
  const handlePurchase = (id: string, seller: string) => {
    toast.success(`Energy purchase initiated with ${seller}`, {
      description: "Transaction details will be sent to your account",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (currentListings.length === 0) {
    return (
      <div className="text-center py-10">
        <Zap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No energy listings found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentListings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className={`h-3 w-full ${
                listing.source === 'Solar' ? 'bg-amber-500' : 
                listing.source === 'Wind' ? 'bg-blue-500' : 
                listing.source === 'Hydro' ? 'bg-cyan-500' :
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
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Available</span>
                  <span className="text-sm font-medium">{listing.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="text-sm font-medium">{listing.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="text-sm font-medium">{listing.available}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-1">{listing.rating}</span>
                    <div className="flex">
                      {Array(5).fill(0).map((_, i) => (
                        <Zap 
                          key={i} 
                          className={`h-3 w-3 ${i < Math.floor(listing.rating) ? 'text-amber-500' : 'text-gray-300'}`} 
                          fill={i < Math.floor(listing.rating) ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-between">
              <Button variant="outline">View Details</Button>
              <Button onClick={() => handlePurchase(listing.id, listing.seller)}>
                Purchase
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  // Fixed: Use a direct number instead of a function
                  setCurrentPage(Math.max(currentPage - 1, 1));
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
                  // Fixed: Use a direct number instead of a function
                  setCurrentPage(Math.min(currentPage + 1, totalPages));
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default FixedPriceTab;
