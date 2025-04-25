
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('platefulUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login for now - would connect to backend in production
      // This simulates a network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes only - would verify credentials with backend
      if (email === 'admin@plateful.com' && password === 'admin123') {
        const adminUser: User = {
          id: '1',
          email,
          name: 'Admin User',
          isAdmin: true
        };
        setUser(adminUser);
        localStorage.setItem('platefulUser', JSON.stringify(adminUser));
      } else {
        const regularUser: User = {
          id: '2',
          email,
          name: email.split('@')[0],
          isAdmin: false
        };
        setUser(regularUser);
        localStorage.setItem('platefulUser', JSON.stringify(regularUser));
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Mock signup - would connect to backend in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        isAdmin: false
      };
      
      setUser(newUser);
      localStorage.setItem('platefulUser', JSON.stringify(newUser));
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error('Could not create account');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('platefulUser');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
