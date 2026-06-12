import React from "react";
import RootLayout from "@/app/components/common/RootLayout";

function Inner({children}: {children: React.ReactNode}) {
    return (
        <RootLayout>
            {children}
        </RootLayout>
    )
}

export default function Layout({children}: {children: React.ReactNode}) {
    return <Inner>{children}</Inner>
}
