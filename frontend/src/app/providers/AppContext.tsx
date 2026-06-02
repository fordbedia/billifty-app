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
import {useQuery, useQueryClient} from "@tanstack/react-query";
import User from "@/app/models/User";
import {auth} from "@/app/helpers/auth";
import {usePathname, useParams} from "next/navigation";
import {uri} from "@/app/constants/routePaths";
import Invoice from "@/app/models/Invoices";

type AppProviderProps = {
    children: ReactNode
}

type Theme = "light" | "dark" | "system";

export interface UserInterface {
    id: string;
    name: string;
    email?: string;
}

interface AppContextValue {
    theme: Theme;
    setTheme: Dispatch<SetStateAction<Theme>>;
    user: UserInterface | null;
    setUser: Dispatch<SetStateAction<UserInterface | null>>;
    isDarkMode: boolean;
    selectedTab: string;
    setSelectedTab: Dispatch<SetStateAction<string>>;
    userData: Record<string, any>;
    isUserDataLoading: boolean
    isErrorUserData: boolean
    planCapabilities: Record<string, any>
    invoiceInfo: Record<string, any>
}

export type PlanCapabilities = {
    allowed: Record<string, boolean>;
    flags: Record<string, boolean | string>;
    limits: Record<string, number>;
    not_allowed: Record<string, boolean>;
    plan: Record<string, number | string>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({children}: AppProviderProps) {
    const [theme, setTheme] = useState<Theme>('light');
    const [user, setUser] = useState<UserInterface | null>(null);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<string>('signin')
    const session = auth()
    const pathname = usePathname()
    const params = useParams()
    const queryClient = useQueryClient()
    // SignUp
    const [password, setPassword] = useState("");
    const [submitted, setSubmitted] = useState(null);
    const [errors, setErrors] = useState({});

    const {
        data: userData,
        isLoading: isUserDataLoading,
        isError: isErrorUserData,
        refetch: refetchUserData,
    } = useQuery({
        queryKey: ['me'],
        queryFn: async () => (await User.me())?.data,
        retry: true,
        enabled: !!session || pathname === uri.business_profile.lists || pathname === uri.onboarding,
        staleTime: 0,
        refetchOnMount: 'always',
    })

    const {data: invoiceInfo} = useQuery({
        queryKey: ['invoice-info', params?.id],
        queryFn: async () => (await Invoice.find(params?.id))?.data,
        retry: true,
        enabled: !!params?.id,
        staleTime: 0,
    })

    useEffect(() => {
        if (pathname !== uri.onboarding || !session) return;

        queryClient.invalidateQueries({queryKey: ['me']});
        void refetchUserData();
    }, [pathname, session, queryClient, refetchUserData]);

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

    const planCapabilities = useMemo(() => userData?.plan_capabilities ?? {}, [userData])

    const value = useMemo<AppContextValue>(() => ({
        theme,
        setTheme,
        user,
        setUser,
        isDarkMode,
        selectedTab,
        setSelectedTab,
        userData, isUserDataLoading, isErrorUserData, planCapabilities, invoiceInfo
    }), [theme, user, isDarkMode, selectedTab, userData, isUserDataLoading, isErrorUserData, planCapabilities, invoiceInfo]);
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>;
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
    return ctx;
}
