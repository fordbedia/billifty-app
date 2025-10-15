'use client';
import React, {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
  useEffect
} from 'react';
import {types} from "sass";
import Boolean = types.Boolean;

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
  isDarkMode: boolean;
  selectedTab: string;
  setSelectedTab: Dispatch<SetStateAction<string>>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children } : AppProviderProps) {
  const [theme, setTheme] = useState<Theme>('light');
  const [user, setUser]   = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('signin')
  // SignUp
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    // initial
    // @ts-ignore
    setIsDarkMode(mq.matches);

    // we don't use the event; we re-read mq.matches
    // @ts-ignore
    const onChange = () => setIsDarkMode(mq.matches);

    // modern API
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }

    // legacy API (Safari)
    if (typeof (mq as any).addListener === "function") {
      (mq as any).addListener(onChange);
      return () => (mq as any).removeListener(onChange);
    }
  }, []);

  const value = useMemo<AppContextValue>(() => ({
    theme,
    setTheme,
    user,
    setUser,
    isDarkMode,
    selectedTab,
    setSelectedTab
  }), [theme, user, selectedTab]);
  return <AppContext.Provider value={value}>
    {children}
  </AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
