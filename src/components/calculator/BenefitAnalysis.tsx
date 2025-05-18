
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { ChartDataItem, SettlementResult } from "./types";
import { costBreakdownData, benefitComparisonData } from "./constants";

interface BenefitAnalysisProps {
  result: SettlementResult;
}

const BenefitAnalysis: React.FC<BenefitAnalysisProps> = ({ result }) => {
  return (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">Benefit Analysis</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer
              config={{
                discomBill: { color: "#fb7185" }, // rose-400
                p2pEnergyCost: { color: "#3b82f6" }, // blue-500
                wheelingCharges: { color: "#f97316" }, // orange-500
                transactionCharges: { color: "#8b5cf6" }, // violet-500
                netPayable: { color: "#4ade80" }, // green-400
              }}
            >
              <BarChart data={costBreakdownData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="amount" name="Amount (Rs.)" fill="#fb7185" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Cost without P2P Trading:</TableCell>
                  <TableCell className="text-right">₹{(result.p2pBill.netAmountPayable + 10000).toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Cost with P2P Trading:</TableCell>
                  <TableCell className="text-right">₹{result.p2pBill.netAmountPayable.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-green-600">Net Benefit:</TableCell>
                  <TableCell className="text-right text-green-600 font-bold">₹{(10000).toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="h-60 mt-6">
              <ChartContainer
                config={{
                  withoutP2P: { color: "#fb7185" }, // rose-400
                  withP2P: { color: "#3b82f6" }, // blue-500
                  benefit: { color: "#4ade80" }, // green-400
                }}
              >
                <BarChart data={benefitComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar 
                    dataKey="amount" 
                    name="Amount (Rs.)" 
                    fill="#fb7185" 
                    strokeWidth={1}
                    stroke="#000"
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default BenefitAnalysis;
