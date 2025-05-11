
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import BalanceCard from '@/components/transaction-service/BalanceCard';
import TransactionList, { Transaction } from '@/components/transaction-service/TransactionList';
import SendMoneyForm from '@/components/transaction-service/SendMoneyForm';
import NotificationCenter, { Notification } from '@/components/notification-service/NotificationCenter';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { toast } = useToast();
  const [balance, setBalance] = useState(2500.75);
  const [transactions, setTransactions] = useState<Transaction[]>([
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
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Money Received',
      message: 'You have received $450.00 from Sarah Smith',
      time: 'Yesterday',
      read: false,
    },
    {
      id: '2',
      type: 'info',
      title: 'New Feature',
      message: 'Check out our new reporting dashboard with improved analytics',
      time: '2 days ago',
      read: true,
    },
  ]);

  const handleSendMoney = (amount: number, recipient: string) => {
    // Create new transaction
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'send',
      amount,
      currency: 'USD',
      recipient,
      date: 'Just now',
      status: 'completed',
    };

    // Update state
    setTransactions([newTransaction, ...transactions]);
    setBalance(prev => prev - amount);

    // Create notification for the receiver (simulated)
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: 'info',
      title: 'Money Sent',
      message: `You have sent $${amount} to ${recipient}`,
      time: 'Just now',
      read: false,
    };
    
    setNotifications([newNotification, ...notifications]);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    
    toast({
      title: "Notification marked as read",
      description: "You can view all notifications in your profile",
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <BalanceCard 
              balance={balance}
              lastIncome={450}
              lastExpense={175.50}
            />
          </div>
          <div>
            <SendMoneyForm onSend={handleSendMoney} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <TransactionList transactions={transactions} />
          </div>
          <div>
            <NotificationCenter 
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
