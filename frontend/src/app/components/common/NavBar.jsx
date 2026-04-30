"use client"

import Image from 'next/image'
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {path} from "@/constants/routerPaths";
import {uri} from "@/app/constants/routePaths";
import {auth} from "@/app/helpers/auth";
import {useAuth} from "@/app/providers/AuthContext";
import Avatar from '@/app/components/common/includes/Avatar'

export const BilliftyLogo = () => {
  return (
    <Link href={path.lp} className="billifty-logo-link"><Image
        alt="Billifty Logo"
        width={100}
        height={100}
        priority
        quality={100}
        className="billifty-logo-img"
        src="/images/Billifty-logo-light.png" /></Link>
  );
};

export default function App() {
  const { logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const session = auth();
  const signedIn = Boolean(session);
  const user = session?.user;
  const avatarUrl = user?.image_url || user?.avatar || null;
  const avatarName = user?.name || user?.email || "Billifty";

  const publicLinks = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: uri.pricing },
    { label: "Support", href: "mailto:support@billifty.com" },
  ];

  const accountLinks = [
		{ label: "Dashboard", href: uri.invoices },
    // { label: "New Invoice", href: uri.create_invoice },
		{ label: "Profile", href: uri.profile },
		{ label: "Account Settings", href: uri.accountSettings },
		{ label: "Manage Subscription", href: uri.manage_subscriptions },
  ];

  useEffect(() => {
    if (!isAccountMenuOpen) return;

    const onPointerDown = (event) => {
      if (!accountMenuRef.current?.contains(event.target)) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isAccountMenuOpen]);

  return (
    <nav className="billifty-navbar" aria-label="Main navigation">
      <div className="billifty-navbar-shell">
        <div className="billifty-navbar-brand">
          <BilliftyLogo />
        </div>

        <div className="billifty-navbar-links">
          {publicLinks.map((link) => (
            <Link href={link.href} key={link.label}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="billifty-navbar-actions">
          {signedIn ? (
            <div className="billifty-account-menu" ref={accountMenuRef}>
              <button
                className="billifty-avatar-button"
                type="button"
                aria-label="Open account menu"
                aria-expanded={isAccountMenuOpen}
                onClick={() => setIsAccountMenuOpen((open) => !open)}
              >
                <Avatar
                  src={avatarUrl}
                  name={avatarName}
                  className="h-[44px] w-[44px] min-w-[44px] overflow-hidden rounded-full text-base"
                  classNames={{
                    img: "h-full w-full rounded-full object-cover",
                  }}
                  isBordered
                />
              </button>

              {isAccountMenuOpen ? (
                <div className="billifty-account-dropdown">
                  {user?.email ? (
                    <div className="billifty-account-summary">
                      <span>Signed in as</span>
                      <strong>{user.email}</strong>
                    </div>
                  ) : null}

                  {accountLinks.map((link) => (
                    <Link
                      href={link.href}
                      key={link.label}
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      logout();
                    }}
                  >
                    Log Out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Link href={uri.auth} className="billifty-nav-link">Sign in</Link>
              <Link href={uri.intro} className="billifty-nav-button">Get Started</Link>
            </>
          )}
        </div>

        <button
          className="billifty-mobile-toggle"
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
        </button>
      </div>

      {isMenuOpen ? (
        <div className="billifty-mobile-menu">
          {publicLinks.map((link) => (
            <Link href={link.href} key={link.label} onClick={() => setIsMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          {signedIn ? (
            <>
              <Link href={uri.invoices} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <button type="button" onClick={() => logout()}>Log Out</button>
            </>
          ) : (
            <>
              <Link href={uri.auth} onClick={() => setIsMenuOpen(false)}>Sign in</Link>
              <Link href={uri.intro} onClick={() => setIsMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      ) : null}
    </nav>
  );
}
