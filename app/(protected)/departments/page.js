import { requirePermission } from "@/lib/session";
import PermissionGate from "@/components/PermissionGate";
import { deleteDepartmentAction } from "./actions";
import { getOrCreateCsrfToken } from "@/lib/csrf";
import { listDepartmentsWithCounts } from "@/services/departments";

export const metadata = { title: "Departments" };

export default async function DepartmentsPage({ searchParams }) {
  await requirePermission("view:departments");
  const rows = listDepartmentsWithCounts();
  const csrf = getOrCreateCsrfToken();
  return (
    <div className="card">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
        <h1 className="h1">Departments</h1>
        <PermissionGate perm="create:departments">
          <a className="button" href="/departments/new">New Department</a>
        </PermissionGate>
      </div>
      {searchParams?.error && <div className="error">{decodeURIComponent(searchParams.error)}</div>}
      {searchParams?.success && <div className="success">{decodeURIComponent(searchParams.success)}</div>}
      <table className="table">
        <thead><tr>
          <th className="th">Name</th>
          <th className="th">Employees</th>
          <th className="th">Actions</th>
        </tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="row">
              <td className="td">{r.name}</td>
              <td className="td">{r.employee_count}</td>
              <td className="td">
                <a className="link" href={`/departments/${r.id}`}>Details</a>{' '}|{' '}
                <PermissionGate perm="edit:departments"><a className="link" href={`/departments/${r.id}/edit`}>Edit</a></PermissionGate>
                {' '}|{' '}
                <PermissionGate perm="delete:departments">
                  <form action={deleteDepartmentAction} method="post" style={{display:"inline"}}>
                    <input type="hidden" name="csrf" value={csrf} />
                    <input type="hidden" name="id" value={r.id} />
                    <button className="link" style={{background:"transparent", border:"none", padding:0, cursor:"pointer"}}>Delete</button>
                  </form>
                </PermissionGate>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
