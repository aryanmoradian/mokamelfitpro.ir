import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, PlanResult } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => void;
  deleteAccount: () => Promise<void>;
  savePlan: (plan: PlanResult) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    const user = await authService.login(email, pass);
    setUser(user);
  };

  const register = async (email: string, pass: string, name: string) => {
    const user = await authService.register(email, pass, name);
    setUser(user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const deleteAccount = async () => {
    if (user) {
        await authService.deleteAccount(user.id);
        setUser(null);
    }
  };

  const savePlan = async (plan: PlanResult) => {
    if (!user) return;
    const updatedUser = await authService.saveResultToHistory(user.id, plan);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, deleteAccount, savePlan }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};