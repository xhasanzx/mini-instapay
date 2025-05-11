
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  CreditCardIcon, 
  SendIcon, 
  UsersIcon, 
  BarChartIcon 
} from 'lucide-react';

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to: string;
  isActive: boolean;
}

const NavItem = ({ icon: Icon, label, to, isActive }: NavItemProps) => (
  <Link 
    to={to}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
      isActive 
        ? "bg-instapay-light text-instapay-primary font-medium" 
        : "text-gray-600 hover:bg-gray-100"
    )}
  >
    <Icon className={cn("h-5 w-5", isActive ? "text-instapay-primary" : "text-gray-500")} />
    <span>{label}</span>
  </Link>
);

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    { icon: CreditCardIcon, label: 'Dashboard', to: '/' },
    { icon: SendIcon, label: 'Transactions', to: '/transactions' },
    { icon: UsersIcon, label: 'Contacts', to: '/contacts' },
    { icon: BarChartIcon, label: 'Reports', to: '/reports' },
  ];

  return (
    <div className="w-64 h-full border-r bg-white flex flex-col">
      <div className="p-4">
        <h1 className="text-xl font-bold gradient-text">InstaPay</h1>
        <p className="text-sm text-gray-500 mt-1">Money Transfer Platform</p>
      </div>
      
      <div className="mt-6 px-3 flex-1 space-y-1">
        {navItems.map((item) => (
          <NavItem 
            key={item.to}
            icon={item.icon}
            label={item.label}
            to={item.to}
            isActive={pathname === item.to}
          />
        ))}
      </div>
      
      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-r from-instapay-primary/10 to-instapay-secondary/10 p-4 rounded-lg">
          <h3 className="font-medium text-instapay-primary">Need Help?</h3>
          <p className="text-sm text-gray-600 mt-1">Contact our support team</p>
          <Button asChild className="mt-2 w-full gradient-bg">
            <Link to="/support">Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Adding the Button component since it wasn't imported
const Button = ({ children, className, asChild }: { 
  children: React.ReactNode; 
  className?: string;
  asChild?: boolean;
}) => {
  const Comp = asChild ? 'div' : 'button';
  return (
    <Comp className={cn("px-4 py-2 rounded-md text-white text-sm font-medium", className)}>
      {children}
    </Comp>
  );
};

export default Sidebar;
