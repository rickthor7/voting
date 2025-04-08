
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Admin, Voter } from '../models/User';
import { DataService } from '../services/DataService';

type AuthContextType = {
  user: Admin | Voter | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isAdmin: false,
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Admin | Voter | null>(null);
  const dataService = DataService.getInstance();

  // Check for existing user on mount
  useEffect(() => {
    const currentUser = dataService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const loggedInUser = dataService.login(email, password);
    
    if (loggedInUser) {
      setUser(loggedInUser);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    dataService.logout();
    setUser(null);
  };

  const isAdmin = user instanceof Admin;
  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
