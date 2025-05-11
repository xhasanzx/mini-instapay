
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated on component mount
    const authStatus = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('user');
    
    if (authStatus === 'true' && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // This is a mock implementation
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = { name: email.split('@')[0], email };
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // This is a mock implementation
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = { name, email };
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      toast({
        title: 'Registration successful',
        description: 'Your account has been created!',
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: 'There was an error creating your account. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    
    setUser(null);
    setIsAuthenticated(false);
    
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
    
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
