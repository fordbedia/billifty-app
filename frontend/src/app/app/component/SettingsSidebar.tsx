"use client";

import {Card, CardBody, Link} from "@heroui/react";
import {uri} from "@/app/constants/routePaths";
import {usePathname} from "next/navigation";
import {Building2, LayoutDashboard, User, Users} from "lucide-react";
import {ComponentType} from "react";

type MenuListProps = {
    title: string;
    link: string;
    icon: ComponentType<{ className?: string }>;
}
export default function SettingsSidebar() {
    const pathname = usePathname();

    const menuList: MenuListProps[] = [{
        title: "My Profile",
        link: uri.profile,
        icon: User
    }, {
        title: "Dashboard",
        link: uri.invoices,
        icon: LayoutDashboard
    }, {
        title: "Business Profile",
        link: uri.business_profile.lists,
        icon: Building2
    }, {
        title: "Clients",
        link: uri.client.clients,
        icon: Users
    }]

    return (
        <Card radius="sm" className="sidebar-card">
            <CardBody>
                <div className="sidebar-head">
                    <h2>Menu</h2>
                    <p>Navigate your account workspace.</p>
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
