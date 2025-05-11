
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Reports = () => {
  // Mock data for charts
  const monthlyActivityData = [
    { name: 'Jan', sent: 400, received: 240 },
    { name: 'Feb', sent: 300, received: 139 },
    { name: 'Mar', sent: 200, received: 980 },
    { name: 'Apr', sent: 278, received: 390 },
    { name: 'May', sent: 189, received: 480 },
    { name: 'Jun', sent: 239, received: 380 },
  ];

  const transactionCategoryData = [
    { name: 'Utilities', value: 400 },
    { name: 'Shopping', value: 300 },
    { name: 'Food', value: 300 },
    { name: 'Entertainment', value: 200 },
    { name: 'Other', value: 100 },
  ];

  const monthlyBalanceData = [
    { name: 'Jan', balance: 1000 },
    { name: 'Feb', balance: 1200 },
    { name: 'Mar', balance: 900 },
    { name: 'Apr', balance: 1500 },
    { name: 'May', balance: 2000 },
    { name: 'Jun', balance: 2400 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <Button className="gradient-bg">Download Report</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Sent" value="$1,945.32" change="+12.5%" positive />
          <StatCard title="Total Received" value="$2,432.10" change="+24.3%" positive />
          <StatCard title="Transactions" value="35" change="+8.1%" positive />
          <StatCard title="Fees Paid" value="$12.40" change="-3.2%" positive={false} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Transaction Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyActivityData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, undefined]} />
                    <Legend />
                    <Bar dataKey="sent" name="Money Sent" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="received" name="Money Received" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Transaction Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={transactionCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {transactionCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm mb-6">
          <CardHeader className="pb-2">
            <CardTitle>Balance History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyBalanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Balance']} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    name="Account Balance"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Transaction Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="spending">
              <TabsList className="mb-4">
                <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
                <TabsTrigger value="income">Income Analysis</TabsTrigger>
                <TabsTrigger value="peer">Peer Comparison</TabsTrigger>
              </TabsList>
              <TabsContent value="spending">
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Your top spending categories this month are Food ($300), Entertainment ($200), and Utilities ($150).
                  </p>
                  <div className="p-4 bg-yellow-50 rounded-md">
                    <p className="text-sm font-medium text-yellow-800">
                      Spending Insight: Your entertainment expenses are 22% higher than last month.
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="income">
                <div className="space-y-4">
                  <p className="text-gray-600">
                    You received $2,432.10 this month, which is 24.3% higher than your average.
                  </p>
                  <div className="p-4 bg-green-50 rounded-md">
                    <p className="text-sm font-medium text-green-800">
                      Income Insight: Your income has been growing steadily for the past 3 months.
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="peer">
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Compared to similar users, you send money 15% more frequently but in smaller amounts.
                  </p>
                  <div className="p-4 bg-blue-50 rounded-md">
                    <p className="text-sm font-medium text-blue-800">
                      Peer Insight: Users like you typically maintain a higher average balance.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

const StatCard = ({ 
  title, 
  value, 
  change, 
  positive 
}: { 
  title: string; 
  value: string; 
  change: string; 
  positive: boolean;
}) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        <p className={`text-sm mt-1 flex items-center ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {positive ? (
            <ArrowUpIcon className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDownIcon className="h-3 w-3 mr-1" />
          )}
          {change}
        </p>
      </CardContent>
    </Card>
  );
};

// Adding missing components
const ArrowUpIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

const ArrowDownIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);

export default Reports;
