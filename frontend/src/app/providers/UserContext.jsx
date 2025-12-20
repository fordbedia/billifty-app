"use client"

import {createContext, Suspense, useContext, useEffect, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import User from "@/app/models/User";
import {useRouter} from "next/navigation";
import {uri} from "@/app/constants/routePaths";
import {storeAuth} from "@/app/helpers/auth";
import {useSearchParams} from "next/navigation";

const UserContext = createContext(null)

export function UserProviderInner({ children }) {
	const router = useRouter()
	const searchParams = useSearchParams()
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
			const next = searchParams.get("next") ?? null

			return (await User.register(user, next))?.data
		},
		onSuccess: (d) => {
			console.log('dd', d)
			const {nextUrl, ...rest} = d
			console.log('rest', rest)
			storeAuth(rest)
			if (nextUrl) {
				router.push(nextUrl)
			} else {
				router.push(uri.invoices)
			}
		}
	})

	useEffect(() => {
		if (!userSaveError) return

		const rawErrors = userSaveError?.response?.data?.errors

		if (rawErrors && typeof rawErrors === "object") {
			const e = Object.values(rawErrors).map((messages) => messages?.[0]).filter(Boolean)
			setErrors(e)
			return
		}

		// fallback for non-validation errors
		const message =
			userSaveError?.response?.data?.message ||
			userSaveError?.message ||
			"Something went wrong."

		setErrors([message])
	}, [userSaveError])

	const value = {
		user,
		handleChange,
		saveUser,
		errors,
	}

	return <UserContext.Provider value={value}>
		{children}
	</UserContext.Provider>
}

export function UserProvider({children}) {
	return <Suspense fallback={null}>
		<UserProviderInner>{children}</UserProviderInner>
	</Suspense>
}

export const useUser = () => {
	const ctx = useContext(UserContext)
	if (!ctx) {
		throw new Error('Cannot load UserContext')
	}
	return ctx
}