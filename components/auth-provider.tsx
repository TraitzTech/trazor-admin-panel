'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setAuthToken, apiFetch } from '@/lib/api';
import { toast } from 'sonner';

type User = {
  name: string;
  email: string;
};

type AuthContextType = {
  isAdmin: boolean;
  loading: boolean;
  user: User | null;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  loading: true,
  user: null,
  logout: async () => {},
  login: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token) {
      setAuthToken(token);
      setIsAdmin(true);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } else {
      setIsAdmin(false);
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiFetch('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setAuthToken(data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    setIsAdmin(true);
    toast.success('Login successful!', {
      description: `Welcome back, ${data.user?.name || 'Admin'}`
    });
    router.push('/dashboard');
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken('');
    setIsAdmin(false);
    setUser(null);
    toast.success('Logout successful!');
    router.push('/login');
  };

  return (
      <AuthContext.Provider value={{ isAdmin, loading, user, login, logout }}>
        {children}
      </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
