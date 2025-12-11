import Header from "@/app/components/common/Header";
import {type ReactNode} from "react";
import {Divider} from "@heroui/divider";
import Footer from "@/app/components/common/Footer";
import ProtectedLayout from "@/app/services/components/ProtectedLayout";

type RootLayoutProps = {
    children?: ReactNode,
}

export default function RootLayout({ children } : RootLayoutProps) {
    return (
        <>
            <ProtectedLayout>
                <Header />
                <Divider className="divider-color fixed" />
                {children}
                <Divider className="divider-color" />
                <Footer />
            </ProtectedLayout>
        </>
    )
}