"use client"

import RootLayout from "@/app/components/common/RootLayout";
import React from "react";

function Inner({children}: { children: React.ReactNode }) {
    return (
        <RootLayout>
            {children}
        </RootLayout>
    )
}

export default function Layout({children}: {children: React.ReactNode}) {
    return <Inner>{children}</Inner>
}
