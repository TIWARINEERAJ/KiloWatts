
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BlockchainInfoCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">What are Smart Contracts?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Smart contracts are self-executing contracts with the terms directly written into code, enabling trustless transactions on blockchains without third parties.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Blockchain Networks</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>This platform supports both Solana (fast, low-cost) and Ethereum (established ecosystem) for energy trading with different gas cost and speed trade-offs.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Energy Trading Benefits</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Blockchain-based energy trading provides transparency, reduced costs, automated settlements, and immutable records of all energy transactions.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockchainInfoCards;
