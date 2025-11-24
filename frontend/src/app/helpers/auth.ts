export interface AuthUser {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
}

export interface AuthResult {
  user: AuthUser;
  token: string;
}

function safeJSONParse<T>(value: string | null): T | null {
  try {
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

export function auth(): AuthResult | null {
  const user = safeJSONParse<AuthUser>(
    localStorage.getItem("billifty_user")
  );
  const token = localStorage.getItem("billifty_token");

  if (!user || !token) return null;

  return { user, token };
}