
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  currency: string;
  recipient: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList = ({ transactions }: TransactionListProps) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No transactions found</p>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center",
                    transaction.type === 'send' ? 'bg-red-100' : 'bg-green-100'
                  )}>
                    {transaction.type === 'send' ? (
                      <ArrowUpIcon className="h-4 w-4 text-red-600" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {transaction.type === 'send' ? 'Sent to' : 'Received from'} {transaction.recipient}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-medium",
                    transaction.type === 'send' ? 'text-red-600' : 'text-green-600'
                  )}>
                    {transaction.type === 'send' ? '-' : '+'}{formatter.format(transaction.amount)}
                  </p>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    getStatusColor(transaction.status)
                  )}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionList;
