
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BalanceCardProps {
  balance: number;
  currency?: string;
  lastIncome?: number;
  lastExpense?: number;
}

const BalanceCard = ({ 
  balance, 
  currency = 'USD', 
  lastIncome = 0, 
  lastExpense = 0 
}: BalanceCardProps) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });

  return (
    <Card className="w-full shadow-sm overflow-hidden">
      <div className="h-2 gradient-bg" />
      <CardHeader className="pb-2">
        <CardDescription>Available Balance</CardDescription>
        <CardTitle className="text-3xl font-bold">
          {formatter.format(balance)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mt-2">
          <div className="flex items-center">
            <div className="mr-2 rounded-full bg-green-100 p-1">
              <ArrowUpIcon className="h-3 w-3 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Income</p>
              <p className="text-sm font-medium">{formatter.format(lastIncome)}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="mr-2 rounded-full bg-red-100 p-1">
              <ArrowDownIcon className="h-3 w-3 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Expense</p>
              <p className="text-sm font-medium">{formatter.format(lastExpense)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
