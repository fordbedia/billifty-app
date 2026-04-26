import React from "react";
import RootLayout from "@/app/components/common/RootLayout";
import {UserProvider} from "@/app/providers/UserContext";

function Inner({children}: {children: React.ReactNode}) {
    return (
        <RootLayout>
            {children}
        </RootLayout>
    )
}

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <UserProvider>
            <Inner>{children}</Inner>
        </UserProvider>
    )
}
