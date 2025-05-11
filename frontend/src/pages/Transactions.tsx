
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import TransactionList, { Transaction } from '@/components/transaction-service/TransactionList';
import TransactionSummary from '@/components/reporting-service/TransactionSummary';

const Transactions = () => {
  // Mock transaction data
  const allTransactions: Transaction[] = [
    {
      id: '1',
      type: 'send',
      amount: 125.50,
      currency: 'USD',
      recipient: 'John Doe',
      date: '2 hours ago',
      status: 'completed',
    },
    {
      id: '2',
      type: 'receive',
      amount: 450.00,
      currency: 'USD',
      recipient: 'Sarah Smith',
      date: 'Yesterday',
      status: 'completed',
    },
    {
      id: '3',
      type: 'send',
      amount: 50.00,
      currency: 'USD',
      recipient: 'Mike Johnson',
      date: '3 days ago',
      status: 'completed',
    },
    {
      id: '4',
      type: 'send',
      amount: 75.25,
      currency: 'USD',
      recipient: 'Emma Williams',
      date: '4 days ago',
      status: 'completed',
    },
    {
      id: '5',
      type: 'receive',
      amount: 200.00,
      currency: 'USD',
      recipient: 'David Brown',
      date: 'Last week',
      status: 'completed',
    },
    {
      id: '6',
      type: 'send',
      amount: 35.00,
      currency: 'USD',
      recipient: 'Robert Miller',
      date: 'Last week',
      status: 'failed',
    },
    {
      id: '7',
      type: 'receive',
      amount: 120.75,
      currency: 'USD',
      recipient: 'Jennifer Davis',
      date: '2 weeks ago',
      status: 'completed',
    },
  ];

  const sentTransactions = allTransactions.filter(tx => tx.type === 'send');
  const receivedTransactions = allTransactions.filter(tx => tx.type === 'receive');

  // Mock chart data
  const weeklyData = [
    { name: 'Mon', sent: 50, received: 120 },
    { name: 'Tue', sent: 75, received: 0 },
    { name: 'Wed', sent: 125, received: 200 },
    { name: 'Thu', sent: 35, received: 0 },
    { name: 'Fri', sent: 0, received: 450 },
    { name: 'Sat', sent: 0, received: 0 },
    { name: 'Sun', sent: 0, received: 0 },
  ];

  const monthlyData = [
    { name: 'Week 1', sent: 150, received: 320 },
    { name: 'Week 2', sent: 200, received: 450 },
    { name: 'Week 3', sent: 100, received: 200 },
    { name: 'Week 4', sent: 175, received: 100 },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Transactions</h1>
          <Button className="gradient-bg">Export History</Button>
        </div>

        <div className="mb-8">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Transaction Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="weekly">
                <TabsList className="mb-4">
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
                <TabsContent value="weekly">
                  <TransactionSummary data={weeklyData} period="Weekly" />
                </TabsContent>
                <TabsContent value="monthly">
                  <TransactionSummary data={monthlyData} period="Monthly" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="received">Received</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <TransactionList transactions={allTransactions} />
            </TabsContent>
            <TabsContent value="sent">
              <TransactionList transactions={sentTransactions} />
            </TabsContent>
            <TabsContent value="received">
              <TransactionList transactions={receivedTransactions} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Transactions;
