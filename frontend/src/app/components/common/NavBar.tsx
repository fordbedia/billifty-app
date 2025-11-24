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
import {auth, AuthResult} from "@/app/helpers/auth";

type UseAppTypes = {
  isDarkMode: boolean
}
export const BilliftyLogo = () => {
  const { isDarkMode }: UseAppTypes = useApp();
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
  const [isMenuOpen, setIsMenuOpen] = useState<Boolean>(false);

  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
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
        <NavbarItem className="hidden lg:flex">
          <Link href="#" className="inline-menu-color">Pricing</Link>
        </NavbarItem>
        <NavbarItem>
          {!auth() ? (
          <Button disableRipple as={Link} color="primary" className="main-button" href={path.auth} variant="flat">
            Get Started
          </Button>) :

          (<Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="default"
              name="Jason Hughes"
              size="sm"
              src={auth()?.user?.avatar ?? 'https://i.pravatar.cc/150?u=a042581f4e29026704d'}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
            <DropdownItem key="team_settings">Team Settings</DropdownItem>
            <DropdownItem key="analytics">Analytics</DropdownItem>
            <DropdownItem key="system">System</DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>)}
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

