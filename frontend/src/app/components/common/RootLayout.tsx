import Header from "@/app/components/common/Header";
import {type ReactNode} from "react";
import {Divider} from "@heroui/divider";
import Footer from "@/app/components/common/Footer";
import ProtectedLayout from "@/app/services/components/ProtectedLayout";
import EmailVerificationBanner from "@/app/components/common/EmailVerificationBanner";

type RootLayoutProps = {
    children?: ReactNode,
}

export default function RootLayout({ children } : RootLayoutProps) {
    return (
        <>
            <ProtectedLayout>
                <EmailVerificationBanner />
                <Header />
                <main className="app-shell">
                    {children}
                </main>
                <Divider className="divider-color" />
                <Footer />
            </ProtectedLayout>
        </>
    )
}
