import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { apolloClient } from '@/lib/apollo';
import { LOGIN } from '@/graphql/mutations';

interface User {
  cargo: string;
  departamento: string;
  nome_completo: string;
  tipo_colaborador: string;
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
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token and user data on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          // Parse saved user data
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          // Invalid saved data, clear everything
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await apolloClient.mutate({
        mutation: LOGIN,
        variables: {
          input: {
            email,
            senha: password
          }
        }
      }) as { data?: { login?: LoginResponse } };

      // Check if result or data is null/undefined
      if (!result || !result.data || !result.data.login) {
        console.error('Login failed: Invalid response from server');
        return false;
      }

      const { token, user: userData } = result.data.login;

      // Map GraphQL response to User interface
      const mappedUser: User = {
          id: Number(userData.id),
          nome: userData.nome_completo,
          email: userData.email,
          tipo: userData.tipo_colaborador,
          nome_completo: '',
          tipo_colaborador: '',
          cargo: '',
          departamento: ''
      };

      // Store token and user data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(mappedUser));

      setIsAuthenticated(true);
      setUser(mappedUser);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setUser, login, logout }}>
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
