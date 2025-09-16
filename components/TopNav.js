import { logout } from "@/app/actions/auth";
import PermissionGate from "@/components/PermissionGate";
import Link from "next/link";

export default async function TopNav() {
  return (
    <div className="container nav">
      <div style={{display:"flex", gap:"8px"}}>
        <PermissionGate perm="view:dashboard">
          <Link className="badge" href="/">Dashboard</Link>
        </PermissionGate>
        <PermissionGate perm="view:employees">
          <Link className="badge" href="/employees">Employees</Link>
        </PermissionGate>
        <PermissionGate perm="view:departments">
          <Link className="badge" href="/departments">Departments</Link>
        </PermissionGate>
        <PermissionGate perm="view:equipment">
          <Link className="badge" href="/equipment">Equipment</Link>
        </PermissionGate>
      </div>
      <form action={logout} method="post">
        <button className="button" type="submit">Sign out</button>
      </form>
    </div>
  );
}
