import {createContext, ReactNode, useContext, useMemo} from 'react';
import {useQuery} from "@tanstack/react-query";
import AdvancedFilter from "@/app/models/AdvancedFilter";
import type {FilterField} from "@/app/components/filters/AdvancedFilterBuilder";

type AdvancedFilterProviderProps = {
    children: ReactNode
}

type AdvancedFilterContextValue = {
    invoiceAdvancedFilterMetadata?: FilterField[];
    isInvoiceAdvancedFilterMetadataPending: boolean;
}

const AdvancedFilterContext = createContext<AdvancedFilterContextValue | null>(null);

export function AdvancedFilterProvider({children}: AdvancedFilterProviderProps) {

    const {
        data: invoiceAdvancedFilterMetadata,
        isPending: isInvoiceAdvancedFilterMetadataPending,
    } = useQuery({
        queryKey: ['advanced-filter'],
        queryFn: async () => (await AdvancedFilter.getInvoiceAdvancedFilterMetadata())?.data,
    })

    const value = useMemo<AdvancedFilterContextValue>(() => ({
        invoiceAdvancedFilterMetadata, isInvoiceAdvancedFilterMetadataPending
    }), [
        invoiceAdvancedFilterMetadata,isInvoiceAdvancedFilterMetadataPending
    ])

    return <AdvancedFilterContext.Provider value={value}>
        {children}
    </AdvancedFilterContext.Provider>;
}

export function useAdvancedFilter() {
    const ctx = useContext(AdvancedFilterContext);
    if (!ctx) throw new Error('useApp must be used inside <AdvancedFilterProvider>');
    return ctx;
}
