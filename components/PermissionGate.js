import { getSessionUserOrNull } from "@/lib/session";
import { getUserPermissions } from "@/lib/rbac";

export default async function PermissionGate({ perm, children }) {
  const user = await getSessionUserOrNull();
  if (!user) return null;
  const perms = getUserPermissions(user.id);
  if (!perms.includes(perm)) return null;
  return <>{children}</>;
}
