
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuctionResult } from "@/utils/doubleAuction";

interface AuctionHistoryProps {
  history: AuctionResult[];
}

const AuctionHistory = ({ history }: AuctionHistoryProps) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auction History</CardTitle>
        <CardDescription>Historical record of all executed auctions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto max-h-64">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left">Time</th>
                <th className="text-left">Seller</th>
                <th className="text-left">Buyer</th>
                <th className="text-right">Price</th>
                <th className="text-right">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {history.map((result, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2">{new Date(result.timestamp).toLocaleString()}</td>
                  <td className="py-2">{result.seller.substring(0, 6)}...</td>
                  <td className="py-2">{result.buyer.substring(0, 6)}...</td>
                  <td className="py-2 text-right">₹{result.clearingPrice.toFixed(2)}</td>
                  <td className="py-2 text-right">{result.quantityTraded} kWh</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuctionHistory;
