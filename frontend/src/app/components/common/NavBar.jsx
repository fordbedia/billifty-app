"use client"

import Image from 'next/image'
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {path} from "@/constants/routerPaths";
import {uri} from "@/app/constants/routePaths";
import {auth} from "@/app/helpers/auth";
import {useAuth} from "@/app/providers/AuthContext";

export const BilliftyLogo = () => {
  return (
    <Link href={path.lp} className="billifty-logo-link"><Image
        alt="Billifty Logo"
        width={92}
        height={35}
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
  const avatarUrl = user?.image_url || user?.avatar || `https://i.pravatar.cc/150?u=${user?.email || "billifty"}`;

  const publicLinks = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: uri.pricing },
    { label: "Support", href: "mailto:support@billifty.com" },
  ];

  const accountLinks = [
    { label: "Profile", href: uri.profile },
    { label: "Dashboard", href: uri.invoices },
    { label: "New Invoice", href: uri.create_invoice },
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
                <span
                  className="billifty-avatar-image"
                  style={{ backgroundImage: `url("${avatarUrl}")` }}
                ></span>
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
