"use client";

import { AppProvider } from "./providers/AppContext";
import {AuthProvider} from "@/app/providers/AuthContext";
import ReduxProvider from "./providers/ReduxProvider";
import {HeroUIProvider} from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@heroui/toast";

const providers = [
	AppProvider,
	AuthProvider,
]

function AppContextProvider({ children }) {
    return providers.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children)
}

const queryClient = new QueryClient()

export default function UiProviders({ children }) {
  return (
    <HeroUIProvider>
			<ToastProvider />
      <ReduxProvider>
          <QueryClientProvider client={queryClient}>
              <AppContextProvider>{children}</AppContextProvider>
          </QueryClientProvider>
      </ReduxProvider>
    </HeroUIProvider>
  );
}