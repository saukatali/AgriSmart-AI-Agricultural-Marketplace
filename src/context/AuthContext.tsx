import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; message: string }>;
  register: (data: any) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (data: any) => Promise<{ success: boolean; message: string }>;
  switchRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('agrismart_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            localStorage.removeItem('agrismart_token');
            setToken(null);
            setUser(null);
          }
        } catch {
          localStorage.removeItem('agrismart_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (identifier: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(identifier, pass);
      if (res.success && res.token && res.user) {
        localStorage.setItem('agrismart_token', res.token);
        setToken(res.token);
        setUser(res.user);
        setIsLoading(false);
        return { success: true, message: res.message };
      }
      setIsLoading(false);
      return { success: false, message: res.message || 'Login failed' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, message: err.message || 'Network error' };
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      if (res.success && res.token && res.user) {
        localStorage.setItem('agrismart_token', res.token);
        setToken(res.token);
        setUser(res.user);
        setIsLoading(false);
        return { success: true, message: res.message };
      }
      setIsLoading(false);
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, message: err.message || 'Network error' };
    }
  };

  const logout = () => {
    api.logout().catch(() => {});
    localStorage.removeItem('agrismart_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: any) => {
    try {
      const res = await api.updateProfile(data);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  // Quick switcher for demo and testing roles
  const switchRole = async (role: UserRole) => {
    if (role === 'farmer') {
      await login('rajesh.farmer@agrismart.com', 'Farmer@123');
    } else if (role === 'customer') {
      await login('priya.customer@agrismart.com', 'Customer@123');
    } else if (role === 'admin') {
      await login('admin@agrismart.com', 'Admin@123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
