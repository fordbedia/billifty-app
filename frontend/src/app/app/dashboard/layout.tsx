"use client"

import RootLayout from "@/app/components/common/RootLayout";
import {DashboardProvider} from "@/app/providers/DashboardContext";
import React from "react";

function Inner({children}: { children: React.ReactNode }) {
    return (
        <RootLayout>
            {children}
        </RootLayout>
    )
}

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <DashboardProvider>
            <Inner>{children}</Inner>
        </DashboardProvider>
    )
}
