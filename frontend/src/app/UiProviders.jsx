"use client";

import { AppProvider } from "./providers/AppContext";
import {AuthProvider} from "@/app/providers/AuthContext";
import {InvoiceProvider} from "@/app/providers/InvoiceContext";
import {BusinessProfileProvider} from "@/app/providers/BusinessProfileContext";
import ReduxProvider from "./providers/ReduxProvider";
import {HeroUIProvider} from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const providers = [
    AppProvider,
    AuthProvider,
    InvoiceProvider,
		BusinessProfileProvider,
]

function AppContextProvider({ children }) {
    return providers.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children)
}

const queryClient = new QueryClient()

export default function UiProviders({ children }) {
  return (
    <HeroUIProvider>
      <ReduxProvider>
          <QueryClientProvider client={queryClient}>
              <AppContextProvider>{children}</AppContextProvider>
          </QueryClientProvider>
      </ReduxProvider>
    </HeroUIProvider>
  );
}