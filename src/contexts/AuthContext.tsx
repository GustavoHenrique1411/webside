import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { apiService } from '@/lib/api';

interface User {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token by making a request to get user profile
      apiService.getProfile().then((userData: User) => {
        setUser(userData);
        setIsAuthenticated(true);
      }).catch(() => {
        // Token is invalid, remove it
        localStorage.removeItem('token');
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login({ email, senha: password }) as LoginResponse;
      const { token, user: userData } = response;

      // Store token in localStorage
      localStorage.setItem('token', token);

      setIsAuthenticated(true);
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
