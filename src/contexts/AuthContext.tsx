import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthSession } from '../lib/auth';

interface AuthContextType {
  session: AuthSession | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const currentSession = await authService.getSession();
      setSession(currentSession);
      setIsLoading(false);
    };

    loadSession();
  }, []);

  const login = async (email: string, password: string) => {
    const newSession = await authService.login(email, password);
    setSession(newSession);
  };

  const logout = async () => {
    await authService.logout();
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, isLoading, login, logout }}>
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
