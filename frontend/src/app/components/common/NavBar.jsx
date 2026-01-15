"use client"

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button, DropdownTrigger, Avatar, Dropdown, DropdownMenu, DropdownItem,
} from "@heroui/react";
import Image from 'next/image'
import React, { useState } from "react";
import { useApp } from '@/app/providers/AppContext';
import {path} from "@/constants/routerPaths";
import {uri} from "@/app/constants/routePaths";
import {auth, AuthResult} from "@/app/helpers/auth";
import {useAuth} from "@/app/providers/AuthContext";

export const BilliftyLogo = () => {
  const { isDarkMode } = useApp();
  const logo = isDarkMode ? "/images/Billifty-logo.png" : '/images/Billifty-logo-light.png';
  return (
    <Link href={path.lp}><Image
        alt="Billifty Logo"
        width={144}
        height={51}
        priority
        quality={100}
        src={logo} /></Link>
  );
};

export default function App() {
  const {
    logout
  } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { user = null } = auth() ?? {};

  const menuItems = [
		{
			label: "Profile",
			key: "profile",
			href: uri.profile
		}, {
			label: "Dashboard",
			key: "dashboard",
			href: uri.invoices
		},{
			label: "System",
			key: "system",
			href: uri.pricing
		}, {
			label: "Manage Subscription",
			key: "manage_subscription",
			href: uri.manage_subscriptions
		}, {
			label: "My Settings",
			key: "my_settings",
			href: uri.pricing
		}, {
			label: "Help & Feedback",
			key: "help_and_feedback",
			href: uri.pricing
		}, {
			label: "Log Out",
			key: "log_out",
			onPress: () => logout()
		}
  ];

  // @ts-ignore
  return (
    <Navbar maxWidth={'xl'} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <BilliftyLogo />
        </NavbarBrand>
      </NavbarContent>

      {/*<NavbarContent className="hidden sm:flex gap-4" justify="center">*/}
      {/*  <NavbarItem>*/}
      {/*    <Link color="foreground" href="#">*/}
      {/*      Features*/}
      {/*    </Link>*/}
      {/*  </NavbarItem>*/}
      {/*  <NavbarItem isActive>*/}
      {/*    <Link aria-current="page" href="#">*/}
      {/*      Customers*/}
      {/*    </Link>*/}
      {/*  </NavbarItem>*/}
      {/*  <NavbarItem>*/}
      {/*    <Link color="foreground" href="#">*/}
      {/*      Integrations*/}
      {/*    </Link>*/}
      {/*  </NavbarItem>*/}
      {/*</NavbarContent>*/}
      <NavbarContent justify="end">
				{!auth() ? (
					<NavbarItem className="hidden lg:flex">
						<Link href={uri.pricing} className="inline-menu-color">Pricing</Link>
					</NavbarItem>
				) : (
					<NavbarItem className="hidden lg:flex">
						<Link href={uri.invoices} color="primary" className="inline-menu-color font-semibold ">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
							</svg>
							Dashboard
						</Link>
					</NavbarItem>
				)}
        <NavbarItem>
          {!auth() ? (
          <Button disableRipple as={Link} color="primary" className="main-button" href={uri.intro} variant="flat">
            Get Started
          </Button>) :
          (<Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="primary"
              name="Jason Hughes"
              size="sm"
              src={auth()?.user?.image_url ?? 'https://i.pravatar.cc/150?u=a042581f4e29026704d'}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{user.email ?? ''}</p>
            </DropdownItem>
						{menuItems && menuItems.length > 0 && menuItems.map((i) => (
							<>
							{typeof i.onPress === 'function' ? (
									<DropdownItem key={i.key} onPress={() => i.onPress()}>{i.label}</DropdownItem>
								) : (
									<DropdownItem key={i.key} href={i.href}>{i.label}</DropdownItem>
								)}
							</>
						))}

            {/*<DropdownItem key="team_settings">Manage Subscription</DropdownItem>*/}
            {/*<DropdownItem key="analytics">Analytics</DropdownItem>*/}
            {/*<DropdownItem key="system">System</DropdownItem>*/}
            {/*<DropdownItem key="configurations">Configurations</DropdownItem>*/}
            {/*<DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>*/}
            {/*<DropdownItem onPress={logout} key="logout" color="danger">*/}
            {/*  Log Out*/}
            {/*</DropdownItem>*/}
          </DropdownMenu>
        </Dropdown>)}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

