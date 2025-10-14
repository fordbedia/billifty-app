'use client';
import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

type AppProviderProps = {
  children: ReactNode
}

type Theme = "light" | "dark" | "system";

export interface User {
  id: string;
  name: string;
  email?: string;
}

interface AppContextValue {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children } : AppProviderProps) {
  const [theme, setTheme] = useState<Theme>('light');
  const [user, setUser]   = useState<User | null>(null);

  const value = useMemo<AppContextValue>(() => ({ theme, setTheme, user, setUser }), [theme, user]);
  return <AppContext.Provider value={value}>
    {children}
  </AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
