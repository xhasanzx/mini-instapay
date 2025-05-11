
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

interface TransactionData {
  name: string;
  sent: number;
  received: number;
}

interface TransactionSummaryProps {
  data: TransactionData[];
  period: string;
}

const TransactionSummary = ({ data, period }: TransactionSummaryProps) => {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Transaction Summary ({period})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, undefined]}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="sent" name="Sent" fill="#8884d8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="received" name="Received" fill="#82ca9d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionSummary;
