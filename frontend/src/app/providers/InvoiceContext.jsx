"use client";

import React, {
    createContext, Dispatch,
    ReactNode, SetStateAction,
    useContext,
    useState
} from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import BusinessProfile from "@/app/models/BusinessProfile";

const InvoiceContext = createContext(null)

export function InvoiceProvider({ children }) {
    const {
        data: businessProfileData
    } = useQuery({
        queryKey: ['business-profiles'],
        queryFn: async () => await BusinessProfile.all()
    })
    const value = {
        businessProfileData,
    }

    return <InvoiceContext.Provider value={value}>
        {children}
    </InvoiceContext.Provider>
}

export const useInvoice = () => {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error("useInvoice must be used within InvoiceProvider");
  return ctx;
};