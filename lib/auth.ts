import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const AUTH_STORAGE_KEY = "evermade-auth-demo";
export const AUTH_COOKIE = "evermade-auth";

export function isLoggedInClient(): boolean {
  if (typeof window === "undefined") return false;
  const hasCookie = document.cookie
    .split(";")
    .some((c) => c.trim().startsWith(`${AUTH_COOKIE}=true`));
  const hasStorage = window.localStorage.getItem(AUTH_STORAGE_KEY) === "true";
  return hasCookie || hasStorage;
}

export function loginClient(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
  // Cookie lisible par le middleware (30 jours)
  document.cookie = `${AUTH_COOKIE}=true; path=/; max-age=2592000; SameSite=Lax`;
}

export function logoutClient(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.localStorage.removeItem("evermade-user-profile");
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; path=/`;
}

export function setUserProfile(name?: string, email?: string): void {
  if (typeof window === "undefined") return;
  const existing = getUserProfile();
  window.localStorage.setItem(
    "evermade-user-profile",
    JSON.stringify({ name: name ?? existing.name, email: email ?? existing.email })
  );
}

export function getUserProfile(): { name?: string; email?: string } {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem("evermade-user-profile");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
