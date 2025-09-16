import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserPermissions } from "@/lib/rbac";

export async function getSessionUserOrNull() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) return null;
  const { session, user } = await lucia.validateSession(sessionId);
  if (!session) return null;
  return user;
}

export async function requireUser() {
  const user = await getSessionUserOrNull();
  if (!user) redirect("/login");
  return user;
}

export async function requirePermission(key) {
  const user = await requireUser();
  const perms = getUserPermissions(user.id);
  if (!perms.includes(key)) redirect("/login?forbidden=1");
  return user;
}
