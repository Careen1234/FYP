import { createContext, useContext, useState, ReactNode } from 'react';
import { AuthState, User } from '../types';
import { mockProviders, mockUsers } from '../data/mockData';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, userType: 'user' | 'provider') => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User>, userType: 'user' | 'provider') => Promise<boolean>;
}

const defaultAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

const AuthContext = createContext<AuthContextType>({
  ...defaultAuthState,
  login: async () => false,
  logout: () => {},
  register: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);

  const login = async (email: string, password: string, userType: 'user' | 'provider'): Promise<boolean> => {
    setAuthState({ ...authState, isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Mock authentication
      if (userType === 'user') {
        const user = mockUsers.find(u => u.email === email);
        if (user) {
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        }
      } else {
        const provider = mockProviders.find(p => p.email === email);
        if (provider) {
          setAuthState({
            user: provider,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        }
      }
      
      setAuthState({ ...authState, isLoading: false });
      return false;
    } catch (error) {
      setAuthState({ ...authState, isLoading: false });
      return false;
    }
  };

  const logout = () => {
    setAuthState(defaultAuthState);
  };

  const register = async (userData: Partial<User>, userType: 'user' | 'provider'): Promise<boolean> => {
    setAuthState({ ...authState, isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // In a real app, we would save the user to the database
      const newUser: User = {
        id: `user${Date.now()}`,
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        type: userType,
      };
      
      setAuthState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return true;
    } catch (error) {
      setAuthState({ ...authState, isLoading: false });
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};