"use client";

import {Card, CardBody, Link, Button} from "@heroui/react";
import {uri} from "@/app/constants/routePaths";
import {usePathname} from "next/navigation";
import {Building2, Sparkles, Users} from "lucide-react";
import {ComponentType} from "react";

type MenuListProps = {
    title: string;
    link: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
}
export default function DashboardSidebar() {
    const pathname = usePathname();

    const menuList: MenuListProps[] = [{
        title: "Business Profile",
        description: "Manage your company details and payment setup.",
        link: uri.business_profile.lists,
        icon: Building2
    }, {
        title: "Clients",
        description: "Keep client contacts organized for fast invoicing.",
        link: uri.client.clients,
        icon: Users
    }]

    return (
        <Card radius="sm" className="sidebar-card">
            <CardBody>
                <div className="sidebar-head">
                    <h2>Workspace Menu</h2>
                    <p>Switch between your setup pages quickly.</p>
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

                <div className="sidebar-promo-card">
                    <div className="promo-header">
                        <Sparkles className="size-4" />
                        <span>AI Invoice Assistant</span>
                    </div>
                    <p>Chat your invoice details and start from an AI-generated draft.</p>
                    <Button as={Link} href={uri.create_invoice} size="sm" className="promo-button" disableRipple>
                        Open Invoice Studio
                    </Button>
                </div>
            </CardBody>
        </Card>
    )
}
