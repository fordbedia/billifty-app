"use client"

import {createContext, useContext, useEffect, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import User from "@/app/models/User";
import {useRouter} from "next/navigation";
import {uri} from "@/app/constants/routePaths";
import {storeAuth} from "@/app/helpers/auth";

const UserContext = createContext(null)

export function UserProvider({ children }) {
	const router = useRouter()
	const userInitialState = {
		fname: '',
		lname: '',
		name: '',
		email: '',
		email_verified_at: '',
		password: '',
		provider: '',
		provider_id: '',
		avatar: '',
	}
	const [user, setUser] = useState(userInitialState)
	const [errors, setErrors] = useState(null)
	const handleChange = (attr, value) => setUser((prev) => ({...prev, [attr]: value}))


	const {mutate: saveUser, error: userSaveError} = useMutation({
		mutationFn: async () => {
			return (await User.register(user))?.data
		},
		onSuccess: (d) => {
			storeAuth(d)
			router.replace(uri.invoices)
			router.refresh()
		}
	})

	useEffect(() => {
		if (userSaveError) {
			const e = Object.entries(userSaveError?.response?.data?.errors).map(([v, k]) => k[0])
			setErrors(e)
		}
	}, [userSaveError]);

	const value = {
		user,
		handleChange,
		saveUser,
		errors,
	}

	return <UserContext value={value}>
		{children}
	</UserContext>
}

export const useUser = () => {
	const ctx = useContext(UserContext)
	if (!ctx) {
		throw new Exception('Cannot load UserContext')
	}
	return ctx
}