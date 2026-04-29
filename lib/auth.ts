// Lightweight localStorage profile helpers used by a few client components.
// Auth is handled by NextAuth — see lib/nextauth.ts

export function getUserProfile(): { name?: string; email?: string } {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem("evermade-user-profile");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setUserProfile(name?: string, email?: string): void {
  if (typeof window === "undefined") return;
  const existing = getUserProfile();
  window.localStorage.setItem(
    "evermade-user-profile",
    JSON.stringify({ name: name ?? existing.name, email: email ?? existing.email })
  );
}
