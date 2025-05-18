
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuctionResult } from "@/utils/doubleAuction";

interface AuctionResultsProps {
  results: AuctionResult[];
}

const AuctionResults = ({ results }: AuctionResultsProps) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Auction Results</CardTitle>
        <CardDescription>Results from the most recent auction execution</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left">Seller</th>
                <th className="text-left">Buyer</th>
                <th className="text-right">Price</th>
                <th className="text-right">Quantity</th>
                <th className="text-right">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2">{result.seller.substring(0, 6)}...</td>
                  <td className="py-2">{result.buyer.substring(0, 6)}...</td>
                  <td className="py-2 text-right">₹{result.clearingPrice.toFixed(2)}</td>
                  <td className="py-2 text-right">{result.quantityTraded} kWh</td>
                  <td className="py-2 text-right">₹{(result.clearingPrice * result.quantityTraded).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm">All auction results are securely recorded on the Solana blockchain for transparency and verification.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuctionResults;
