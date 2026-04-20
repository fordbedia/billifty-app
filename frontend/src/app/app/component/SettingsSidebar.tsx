"use client";

import {Card, CardBody, Link} from "@heroui/react";
import {uri} from "@/app/constants/routePaths";
import {usePathname} from "next/navigation";
import {Building2, LayoutDashboard, Shield, User, Users} from "lucide-react";
import {ComponentType} from "react";

type MenuListProps = {
    title: string;
    link: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
}
export default function SettingsSidebar() {
    const pathname = usePathname();

    const menuList: MenuListProps[] = [{
        title: "My Profile",
        link: uri.profile,
        description: "Update your personal details and profile photo.",
        icon: User
    }, {
        title: "Account Settings",
        link: "/app/account-settings",
        description: "Manage security and sensitive account actions.",
        icon: Shield
    }, {
        title: "Dashboard",
        link: uri.invoices,
        description: "Review and manage your invoice activity.",
        icon: LayoutDashboard
    }, {
        title: "Business Profile",
        link: uri.business_profile.lists,
        description: "Manage company details and payment setup.",
        icon: Building2
    }, {
        title: "Clients",
        link: uri.client.clients,
        description: "Keep client contacts organized for billing.",
        icon: Users
    }]

    return (
        <Card radius="sm" className="sidebar-card">
            <CardBody>
                <div className="sidebar-head">
                    <h2>Account Menu</h2>
                    <p>Switch between your account and billing workspace.</p>
                </div>
                <ul className="sidebar-links">
                    {menuList.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.link;

                        return (
                            <li key={item.title}>
                                <Link
                                    className={`sidebar-link ${isActive ? "is-active" : ""}`}
                                    href={item.link}
                                >
                                    <span className="sidebar-link-icon">
                                        <Icon className="size-4" />
                                    </span>
                                    <span>
                                        <strong>{item.title}</strong>
                                        <small>{item.description}</small>
                                    </span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </CardBody>
        </Card>
    )
}
