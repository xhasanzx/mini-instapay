
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BellIcon, UserIcon, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full h-16 px-6 border-b flex items-center justify-between bg-white">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold gradient-text">
          InstaPay
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" className="rounded-full">
          <BellIcon className="h-5 w-5 text-gray-600" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-instapay-light text-instapay-primary">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer">My Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="cursor-pointer">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
