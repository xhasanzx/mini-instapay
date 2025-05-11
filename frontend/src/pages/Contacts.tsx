
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendIcon, UserIcon, PlusIcon, SearchIcon } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  recent: boolean;
  avatar?: string;
}

const Contacts = () => {
  // Mock contacts data
  const contacts: Contact[] = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', recent: true },
    { id: '2', name: 'Sarah Smith', email: 'sarah.smith@example.com', recent: true },
    { id: '3', name: 'Mike Johnson', email: 'mike.johnson@example.com', recent: false },
    { id: '4', name: 'Emma Williams', email: 'emma.williams@example.com', recent: false },
    { id: '5', name: 'David Brown', email: 'david.brown@example.com', recent: true },
    { id: '6', name: 'Jennifer Davis', email: 'jennifer.davis@example.com', recent: false },
  ];

  const recentContacts = contacts.filter(contact => contact.recent);
  const allContacts = [...contacts].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Contacts</h1>
          <Button className="gradient-bg">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search contacts..." className="pl-10" />
          </div>
        </div>

        {recentContacts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-3">Recent Contacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentContacts.map(contact => (
                <ContactCard key={contact.id} contact={contact} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-medium mb-3">All Contacts</h2>
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <div className="divide-y">
                {allContacts.map(contact => (
                  <ContactRow key={contact.id} contact={contact} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

const ContactCard = ({ contact }: { contact: Contact }) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-instapay-light text-instapay-primary">
              {contact.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{contact.name}</h3>
            <p className="text-sm text-gray-500 truncate">{contact.email}</p>
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            <UserIcon className="h-4 w-4 mr-1" />
            Profile
          </Button>
          <Button size="sm" className="flex-1 gradient-bg">
            <SendIcon className="h-4 w-4 mr-1" />
            Pay
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ContactRow = ({ contact }: { contact: Contact }) => {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-instapay-light text-instapay-primary">
            {contact.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{contact.name}</h3>
          <p className="text-sm text-gray-500">{contact.email}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button variant="ghost" size="sm">
          <UserIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-instapay-primary">
          <SendIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Contacts;
