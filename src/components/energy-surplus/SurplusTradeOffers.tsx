
import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { EnergyData, TradeOffer, updateTradeOffer } from "@/services/energyDataService";
import { useAuth } from "@/contexts/AuthContext";

interface SurplusTradeOffersProps {
  energyData?: EnergyData;
}

const SurplusTradeOffers = ({ energyData }: SurplusTradeOffersProps) => {
  const { user } = useAuth();
  const [selectedOffer, setSelectedOffer] = useState<TradeOffer | null>(null);
  const [dialogAction, setDialogAction] = useState<"withdraw" | "view" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWithdrawOffer = async () => {
    if (!selectedOffer) return;
    
    setIsSubmitting(true);
    
    try {
      await updateTradeOffer(selectedOffer.id, "WITHDRAWN");
      toast.success("Offer successfully withdrawn");
      setDialogAction(null);
      setSelectedOffer(null);
    } catch (error) {
      console.error("Error withdrawing offer:", error);
      toast.error("Failed to withdraw offer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString();
  };

  const formatTime = (isoDate: string) => {
    return new Date(isoDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'CLOSED':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Completed</Badge>;
      case 'WITHDRAWN':
        return <Badge variant="outline" className="border-gray-500 text-gray-500">Withdrawn</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!energyData) {
    return null;
  }

  const { tradeOffers = [] } = energyData;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Your Trade Offers</CardTitle>
          <CardDescription>
            Manage your energy surplus trade offers and track their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tradeOffers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time Window</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tradeOffers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell>{formatDate(offer.date)}</TableCell>
                    <TableCell>{offer.timeWindow}</TableCell>
                    <TableCell>{offer.surplusAmount.toFixed(2)} kWh</TableCell>
                    <TableCell>₹{offer.pricePerUnit.toFixed(2)}/kWh</TableCell>
                    <TableCell>{getStatusBadge(offer.status)}</TableCell>
                    <TableCell>
                      {formatDate(offer.createdAt)} {formatTime(offer.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedOffer(offer);
                            setDialogAction("view");
                          }}
                        >
                          View
                        </Button>
                        {offer.status === 'OPEN' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-destructive text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              setSelectedOffer(offer);
                              setDialogAction("withdraw");
                            }}
                          >
                            Withdraw
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">You haven't created any trade offers yet.</p>
              <p className="mt-2">Go to the Forecast tab to create your first energy trade offer.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trade Offer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Offers</CardTitle>
            <CardDescription>Currently available for trade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {tradeOffers.filter(offer => offer.status === 'OPEN').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed Trades</CardTitle>
            <CardDescription>Successfully executed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">
              {tradeOffers.filter(offer => offer.status === 'CLOSED').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Energy Traded</CardTitle>
            <CardDescription>Lifetime contribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              {tradeOffers
                .filter(offer => offer.status === 'CLOSED')
                .reduce((sum, offer) => sum + offer.surplusAmount, 0)
                .toFixed(2)
              } kWh
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trading Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Energy Trading Information</CardTitle>
          <CardDescription>Guidelines and information about energy trading</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important Trading Rules</AlertTitle>
              <AlertDescription>
                All energy trades are subject to verification by the DISCOM. Offers may be rejected if they don't meet grid stability requirements.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Benefits of Trading Surplus</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Generate income from excess energy</li>
                  <li>Support local energy independence</li>
                  <li>Reduce strain on the main grid</li>
                  <li>Lower community-wide carbon footprint</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Current Market Rates</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Peak hours: ₹4.50 - ₹5.00 per kWh</li>
                  <li>Standard hours: ₹3.75 - ₹4.25 per kWh</li>
                  <li>Off-peak hours: ₹2.50 - ₹3.25 per kWh</li>
                  <li>Green premium: +₹0.50 per kWh</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Offer Dialog */}
      <Dialog open={dialogAction === "view" && !!selectedOffer} onOpenChange={(open) => !open && setDialogAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trade Offer Details</DialogTitle>
            <DialogDescription>
              Detailed information about your energy trade offer
            </DialogDescription>
          </DialogHeader>
          
          {selectedOffer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Offer ID</p>
                  <p className="font-medium">{selectedOffer.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p>{getStatusBadge(selectedOffer.status)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(selectedOffer.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time Window</p>
                  <p className="font-medium">{selectedOffer.timeWindow}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">{selectedOffer.surplusAmount.toFixed(2)} kWh</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">₹{selectedOffer.pricePerUnit.toFixed(2)}/kWh</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{formatDate(selectedOffer.createdAt)} {formatTime(selectedOffer.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="font-medium">₹{(selectedOffer.surplusAmount * selectedOffer.pricePerUnit).toFixed(2)}</p>
                </div>
              </div>
              
              {selectedOffer.status === 'OPEN' && (
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full border-destructive text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      setDialogAction("withdraw");
                    }}
                  >
                    Withdraw Offer
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Withdraw Confirmation Dialog */}
      <Dialog open={dialogAction === "withdraw" && !!selectedOffer} onOpenChange={(open) => !open && setDialogAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Trade Offer</DialogTitle>
            <DialogDescription>
              Are you sure you want to withdraw this energy trade offer?
            </DialogDescription>
          </DialogHeader>
          
          {selectedOffer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(selectedOffer.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time Window</p>
                  <p className="font-medium">{selectedOffer.timeWindow}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">{selectedOffer.surplusAmount.toFixed(2)} kWh</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">₹{selectedOffer.pricePerUnit.toFixed(2)}/kWh</p>
                </div>
              </div>
              
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Withdrawing this offer will remove it from the marketplace. This action cannot be undone.
                </AlertDescription>
              </Alert>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setDialogAction(null)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleWithdrawOffer}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Withdrawing..." : "Withdraw Offer"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SurplusTradeOffers;
