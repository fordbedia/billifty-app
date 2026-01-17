"use client";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  image_url?: string | null;
}

export interface AuthResult {
  user: AuthUser;
  token: string;
}

/**
 * Safe helper: checks window existence before JSON parsing.
 */
function safeJSONParse<T>(value: string | null): T | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

/**
 * Safe: returns token or null — no SSR `window` access.
 */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("billifty_token");
}

/**
 * SAFE: fully guards ALL localStorage access.
 * Will never crash during SSR, build, or Turbopack bundling.
 */
export function auth(): AuthResult | null {
  if (typeof window === "undefined") {
    // On the server, just return null — no localStorage available
    return null;
  }

  const rawUser = window.localStorage.getItem("billifty_user");
  const token = window.localStorage.getItem("billifty_token");

  const user = safeJSONParse<AuthUser>(rawUser);

  if (!user || !token) return null;

  return { user, token };
}

/**
 * SAFE removal of localStorage values.
 * Also protects against SSR.
 */
export function removeAuth(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem("billifty_user");
  window.localStorage.removeItem("billifty_token");
}

export function storeAuth(d: any): void {
  if (typeof window === "undefined") return;

  if (!d && typeof d.user === 'undefined' && typeof d.token === 'undefined') return;

  const user = JSON.stringify(d.user)
  window.localStorage.setItem("billifty_user", user)
  window.localStorage.setItem("billifty_token", d.token)
}