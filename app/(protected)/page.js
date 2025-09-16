import PermissionGate from "@/components/PermissionGate";
import Link from "next/link";
export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
   console.log("process.env.NEXT_PUBLIC_API_URL");
  console.log(process.env.NEXT_PUBLIC_API_URL);
  console.log(process.env.SECRET_KEY);
  return (
    <div className="grid">
      <PermissionGate perm="view:employees">
        <Link className="card link" href="/employees">
          <h2 className="h1">Employees →</h2>
          <p>List of all employees</p>
        </Link>
      </PermissionGate>
      <PermissionGate perm="view:departments">
        <Link className="card link" href="/departments">
          <h2 className="h1">Departments →</h2>
          <p>Teams and members</p>
        </Link>
      </PermissionGate>
      <PermissionGate perm="view:equipment">
        <Link className="card link" href="/equipment">
          <h2 className="h1">Equipment →</h2>
          <p>Inventory & assignments</p>
        </Link>
      </PermissionGate>
    </div>
  );
}
