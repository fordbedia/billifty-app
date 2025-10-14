"use client";

import { AppProvider } from "./providers/AppContext";
import ReduxProvider from "./providers/ReduxProvider";
import {HeroUIProvider} from "@heroui/react";

export default function UiProviders({ children }) {
  return (
    <HeroUIProvider>
      <ReduxProvider>
        <AppProvider>{children}</AppProvider>
      </ReduxProvider>
    </HeroUIProvider>
  );
}