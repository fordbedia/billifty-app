"use client";

import {AppProvider} from "./providers/AppContext";
import {AuthProvider} from "@/app/providers/AuthContext";
import ReduxProvider from "./providers/ReduxProvider";
import {HeroUIProvider} from "@heroui/react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ToastProvider} from "@heroui/toast";
import {UserProvider} from "@/app/providers/UserContext";

const providers = [
	AppProvider,
	AuthProvider,
]

function AppContextProvider({children}) {
	return providers.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children)
}

const queryClient = new QueryClient()

export default function UiProviders({children}) {
	return (
		<HeroUIProvider>
			<ToastProvider/>
			<ReduxProvider>
				<QueryClientProvider client={queryClient}>
					<UserProvider>
						<AppContextProvider>{children}</AppContextProvider>
					</UserProvider>
				</QueryClientProvider>
			</ReduxProvider>
		</HeroUIProvider>
	);
}
