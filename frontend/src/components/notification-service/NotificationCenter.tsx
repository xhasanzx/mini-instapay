
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BellIcon, UserIcon, CreditCardIcon, InfoIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
}

const NotificationCenter = ({ notifications, onMarkAsRead }: NotificationCenterProps) => {
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <InfoIcon className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CreditCardIcon className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <BellIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <BellIcon className="h-5 w-5 text-red-500" />;
      default:
        return <InfoIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationBg = (type: Notification['type'], read: boolean) => {
    if (read) return 'bg-white';
    
    switch (type) {
      case 'info':
        return 'bg-blue-50';
      case 'success':
        return 'bg-green-50';
      case 'warning':
        return 'bg-yellow-50';
      case 'error':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <BellIcon className="h-5 w-5 text-instapay-primary" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No notifications</p>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={cn(
                  "p-3 rounded-md border relative cursor-pointer transition-colors",
                  getNotificationBg(notification.type, notification.read),
                  !notification.read && "hover:bg-opacity-80"
                )}
                onClick={() => onMarkAsRead && onMarkAsRead(notification.id)}
              >
                <div className="flex space-x-3">
                  <div className="mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                </div>
                {!notification.read && (
                  <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-instapay-primary" />
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
