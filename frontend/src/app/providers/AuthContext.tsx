import React, {
    createContext, Dispatch,
    ReactNode, SetStateAction, Suspense,
    useContext, useEffect,
    useState
} from 'react'
import {ValidationErrors} from "@react-types/shared";
import {useMutation, UseMutateFunction} from "@tanstack/react-query";
import User from "@/app/models/User";
import {removeAuth} from "@/app/helpers/auth";
import {useRouter} from "next/navigation";
import {storeAuth} from "@/app/helpers/auth";
import {uri} from "@/app/constants/routePaths";
import type { AxiosError } from "axios";
import {useSearchParams} from "next/navigation";

type AuthProviderProps = {
    children: ReactNode
}
type ErrorSetter = (value: string | null) => void;

type Handler = (attr: any, value: any) => void;

interface AuthContextValue {
    password: string;
    setPassword: Dispatch<SetStateAction<string>>;
    submitted: object | null;
    setSubmitted: Dispatch<SetStateAction<object | null>>;
    errors: string | null;
    setErrors: ErrorSetter;
    showValidation: boolean;
    setShowValidation: Dispatch<SetStateAction<boolean>>;
    logout: UseMutateFunction<LogoutResponse, unknown, void, unknown>;
    handleChange: Handler;
    login: UseMutateFunction<AuthResult, AxiosError<ErrorProps, any>, void, unknown>;
    user: LoginProps
}

interface LogoutResponse {
  message: string;
}

type AuthResult = {
    user: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
        password: string;
      };
    token: string;
    url: string | null;
}

type ErrorProps = {
  message?: string;
};

type LoginProps = {
    email: string
    password: string
}

const AuthContext = createContext<AuthContextValue | null>(null);

function AuthInnerProvider({ children }: AuthProviderProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [password, setPassword] = useState<string>("");
    const [submitted, setSubmitted] = useState<object | null>(null);
    const [errors, setErrors] = useState<string | null>(null);
    const [showValidation, setShowValidation] = useState<boolean>(false);
    const initialState = {
        email: '',
        password: ''
    }
    const [user, setUser] = useState<LoginProps>(initialState)

    const handleChange = (attr: any, value: any) => setUser((prev) => ({...prev, [attr]: value}))

    const {mutate: logout} = useMutation<LogoutResponse>({
        mutationFn: async () => {
            return (await User.logout())?.data
        },
        onSuccess: () => {
            removeAuth();
            window.location.reload()
        }
    })

    const {mutate: login, error: loginError} = useMutation<AuthResult, AxiosError<ErrorProps>>({
		mutationFn: async () => {
            const next: string | null = searchParams.get("next") ?? null
            return (await User.login(user, next))?.data
        },
        onSuccess: (d) => {
            const {url, ...rest} = d
            storeAuth(rest)
            if (url) {
                router.push(url)
            }
        }
	})

    useEffect(() => {
        if (loginError) {
            const e = loginError?.response?.data?.message ?? null
            setErrors(e)
        }
    }, [loginError]);

    const value = {
        login,
        handleChange,
        user,
        password,
        setPassword,
        submitted,
        setSubmitted,
        errors,
        setErrors,
        showValidation,
        setShowValidation,
        logout
    }

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}

export function AuthProvider({ children }: AuthProviderProps)
{
    return <Suspense fallback={null}>
        <AuthInnerProvider>{children}</AuthInnerProvider>
    </Suspense>
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error("useAuth must be used inside an <AuthProvider>");
    }
    return ctx;
}