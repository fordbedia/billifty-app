"use client";

import { AppProvider } from "./providers/AppContext";
import {AuthProvider} from "@/app/providers/AuthContext";
import ReduxProvider from "./providers/ReduxProvider";
import {HeroUIProvider} from "@heroui/react";

const providers = [
    AppProvider,
    AuthProvider
]

function AppContextProvider({ children }) {
    return providers.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children)
}

export default function UiProviders({ children }) {
  return (
    <HeroUIProvider>
      <ReduxProvider>
        <AppContextProvider>{children}</AppContextProvider>
      </ReduxProvider>
    </HeroUIProvider>
  );
}