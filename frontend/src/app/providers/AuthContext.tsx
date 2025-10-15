import React, {
    createContext, Dispatch,
    ReactNode, SetStateAction,
    useContext,
    useState
} from 'react'
import {ValidationErrors} from "@react-types/shared";

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
    setShowValidation: Dispatch<SetStateAction<boolean>>
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
    const [password, setPassword] = useState<string>("");
    const [submitted, setSubmitted] = useState<object | null>(null);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [showValidation, setShowValidation] = useState<boolean>(false);

    const value = {
        password,
        setPassword,
        submitted,
        setSubmitted,
        errors,
        setErrors,
        showValidation,
        setShowValidation
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