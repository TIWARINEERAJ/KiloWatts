
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { SettlementResult } from "./types";

interface ResultsDisplayProps {
  result: SettlementResult | null;
  isProsumer: boolean;
  calculatorType: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  result, 
  isProsumer, 
  calculatorType 
}) => {
  if (!result) return null;

  return (
    <div className="space-y-6">
      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle>Bill for {isProsumer ? "Prosumer" : "Consumer"} by Discom</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Energy Charges:</TableCell>
                <TableCell className="text-right">₹{result.discomBill.energyCharges.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Demand Charges:</TableCell>
                <TableCell className="text-right">₹{result.discomBill.demandCharges.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Total:</TableCell>
                <TableCell className="text-right font-bold">₹{result.discomBill.total.toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle>Bill for transaction on P2P Platform</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              {isProsumer ? (
                <TableRow>
                  <TableCell className="font-medium">Receivable from energy sold on P2P:</TableCell>
                  <TableCell className="text-right">₹{result.p2pBill.energyPayableOrReceivable.toLocaleString()}</TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell className="font-medium">Payable for energy bought on P2P:</TableCell>
                  <TableCell className="text-right">₹{result.p2pBill.energyPayableOrReceivable.toLocaleString()}</TableCell>
                </TableRow>
              )}
              
              {isProsumer && calculatorType === "prosumerOverInjection" && (
                <TableRow>
                  <TableCell className="font-medium">Receivable from over injection:</TableCell>
                  <TableCell className="text-right">₹{Math.abs(result.p2pBill.imbalanceCharges).toLocaleString()}</TableCell>
                </TableRow>
              )}
              
              {isProsumer && calculatorType === "prosumerUnderInjection" && (
                <TableRow>
                  <TableCell className="font-medium">Under Injection Charges:</TableCell>
                  <TableCell className="text-right">₹{result.p2pBill.imbalanceCharges.toLocaleString()}</TableCell>
                </TableRow>
              )}
              
              {!isProsumer && calculatorType === "consumerOverdrawal" && (
                <TableRow>
                  <TableCell className="font-medium">Overdrawal Cost:</TableCell>
                  <TableCell className="text-right">₹{result.p2pBill.imbalanceCharges.toLocaleString()}</TableCell>
                </TableRow>
              )}
              
              {!isProsumer && calculatorType === "consumerUnderdrawal" && (
                <TableRow>
                  <TableCell className="font-medium">Under drawal charge:</TableCell>
                  <TableCell className="text-right">₹{result.p2pBill.imbalanceCharges.toLocaleString()}</TableCell>
                </TableRow>
              )}
              
              <TableRow>
                <TableCell className="font-medium">Wheeling charges:</TableCell>
                <TableCell className="text-right">₹{result.p2pBill.wheelingCharges.toLocaleString()}</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell className="font-medium">Service Provider Transaction Charges:</TableCell>
                <TableCell className="text-right">₹{result.p2pBill.transactionCharges.toLocaleString()}</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell className="font-medium">Total payable to Discom:</TableCell>
                <TableCell className="text-right">₹{result.p2pBill.totalPayableToDiscom.toLocaleString()}</TableCell>
              </TableRow>
              
              {isProsumer ? (
                <TableRow>
                  <TableCell className="font-medium">Total Receivable:</TableCell>
                  <TableCell className="text-right">₹{result.p2pBill.totalPayableOrReceivableForP2P.toLocaleString()}</TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell className="font-medium">Total Payable towards P2P energy:</TableCell>
                  <TableCell className="text-right">₹{result.p2pBill.totalPayableOrReceivableForP2P.toLocaleString()}</TableCell>
                </TableRow>
              )}
              
              <TableRow>
                <TableCell className="font-medium">Transaction Charges Payable:</TableCell>
                <TableCell className="text-right">₹{result.p2pBill.transactionChargesPayable.toLocaleString()}</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell className="font-medium font-bold">Net amount payable:</TableCell>
                <TableCell className="text-right font-bold text-lg">₹{result.p2pBill.netAmountPayable.toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
