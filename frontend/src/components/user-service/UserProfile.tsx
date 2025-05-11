
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserIcon } from 'lucide-react';

interface UserProfileProps {
  name: string;
  email: string;
  accountId: string;
  memberSince: string;
}

const UserProfile = ({ name, email, accountId, memberSince }: UserProfileProps) => {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Account Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-instapay-light text-instapay-primary text-lg">
              <UserIcon className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">{name}</h3>
            <div className="space-y-1 text-sm">
              <p className="text-gray-500">Email: <span className="text-gray-700">{email}</span></p>
              <p className="text-gray-500">Account ID: <span className="text-gray-700">{accountId}</span></p>
              <p className="text-gray-500">Member Since: <span className="text-gray-700">{memberSince}</span></p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
