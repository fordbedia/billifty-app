import {Card, CardBody, Link} from "@heroui/react";
import {uri} from "@/app/constants/routePaths";

type MenuListProps = {
    title: string,
    link: string
}
export default function DashboardSidebar() {

    const menuList: MenuListProps[] = [{
        title: "Business Profile",
        link: uri.business_profile.lists
    }, {
        title: "Clients",
        link: uri.client.clients
    }]

    return (
        <Card radius="sm">
            <CardBody>
                <h2 className="text-2xl font-extrabold">Menu</h2>
                <ul>
                    {menuList.length > 0 && menuList.map((r, i) => (
                        <li key={i}>
                            <Link
                                className="border-1 rounded-sm py-2 px-4 block hover:bg-gray-100 my-2"
                                href={r.link}>
                                {r.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </CardBody>
        </Card>
    )
}