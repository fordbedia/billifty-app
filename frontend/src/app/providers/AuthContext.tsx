import React, {
    createContext, Dispatch,
    ReactNode, SetStateAction,
    useContext,
    useState
} from 'react'
import {ValidationErrors} from "@react-types/shared";
import {useMutation, UseMutateFunction} from "@tanstack/react-query";
import User from "@/app/models/User";
import {removeAuth} from "@/app/helpers/auth";
import {useRouter} from "next/navigation";
import {storeAuth} from "@/app/helpers/auth";
import {uri} from "@/app/constants/routePaths";

type AuthProviderProps = {
    children: ReactNode
}

interface AuthContextValue {
    password: string;
    setPassword: Dispatch<SetStateAction<string>>;
    submitted: object | null;
    setSubmitted: Dispatch<SetStateAction<object | null>>;
    errors: ValidationErrors;
    setErrors: Dispatch<SetStateAction<ValidationErrors>>;
    showValidation: boolean;
    setShowValidation: Dispatch<SetStateAction<boolean>>;
    logout: UseMutateFunction<LogoutResponse, unknown, void, unknown>;
}

interface LogoutResponse {
  message: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
    const router = useRouter()
    const [password, setPassword] = useState<string>("");
    const [submitted, setSubmitted] = useState<object | null>(null);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [showValidation, setShowValidation] = useState<boolean>(false);
    const initialState = {
        email: '',
        password: ''
    }
    const [user, setUser] = useState(initialState)

    const handleChange = (attr, value) => setUser((prev) => ({...prev, [attr]: value}))

    const {mutate: logout} = useMutation<LogoutResponse>({
        mutationFn: async () => {
            return (await User.logout())?.data
        },
        onSuccess: () => {
            removeAuth();
            window.location.reload()
        }
    })

    const {mutate: login} = useMutation({
		mutationFn: async () => (await User.login(user))?.data,
        onSuccess: (d) => {
            storeAuth(d)
			router.replace(uri.invoices)
			router.refresh()
        }
	})

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

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error("useAuth must be used inside an <AuthProvider>");
    }
    return ctx;
}