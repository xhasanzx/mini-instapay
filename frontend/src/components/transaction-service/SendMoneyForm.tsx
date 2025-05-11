
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SendIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SendMoneyFormProps {
  onSend?: (amount: number, recipient: string) => void;
}

const SendMoneyForm = ({ onSend }: SendMoneyFormProps) => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !recipient) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (onSend) {
        onSend(parseFloat(amount), recipient);
      }
      
      toast({
        title: "Money sent successfully",
        description: `$${amount} has been sent to ${recipient}`,
      });
      
      setAmount('');
      setRecipient('');
      setLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <SendIcon className="h-5 w-5 text-instapay-primary" />
          Send Money
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              placeholder="Email or username"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 text-sm">$</span>
              </div>
              <Input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                className="pl-7"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full gradient-bg"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Send Money'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SendMoneyForm;
