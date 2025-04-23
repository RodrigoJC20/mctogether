import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:3000';

interface User {
  _id: string;
  email: string;
  username: string;
  currency: number;
  groupId?: string;
  role?: 'leader' | 'member';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('jwt');
        if (storedToken) {
          setToken(storedToken);
          // Fetch user data
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token might be invalid, clear it
            await AsyncStorage.removeItem('jwt');
            setToken(null);
          }
        }
      } catch (error) {
        console.error('Error loading token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Login attempt with:', { email, password });
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Login failed with response:', errorData);
        throw new Error('Login failed');
      }

      const data = await response.json();
      await AsyncStorage.setItem('jwt', data.token);
      // Clear the cart when user logs in
      await AsyncStorage.setItem('cart', JSON.stringify([]));
      setToken(data.token);
      setUser(data.user);
      router.replace('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      await AsyncStorage.setItem('jwt', data.token);
      setToken(data.token);
      setUser(data.user);
      router.replace('/');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('jwt');
      setToken(null);
      setUser(null);
      router.replace('/auth' as any);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = { user, token, isLoading, login, register, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 