import { requirePermission } from "@/lib/session";
import PermissionGate from "@/components/PermissionGate";
import { deleteEmployeeAction } from "./actions";
import { getOrCreateCsrfToken } from "@/lib/csrf";
import { listEmployees } from "@/services/employees";

export const metadata = { title: "Employees" };

export default async function EmployeesPage({ searchParams }) {
  await requirePermission("view:employees");
  const rows = listEmployees();
  const csrf = getOrCreateCsrfToken();
  return (
    <div className="card">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
        <h1 className="h1">Employees</h1>
        <PermissionGate perm="create:employees">
          <a className="button" href="/employees/new">New Employee</a>
        </PermissionGate>
      </div>
      {searchParams?.error && <div className="error">{decodeURIComponent(searchParams.error)}</div>}
      {searchParams?.success && <div className="success">{decodeURIComponent(searchParams.success)}</div>}
      <table className="table">
        <thead>
          <tr>
            <th className="th">First name</th>
            <th className="th">Last name</th>
            <th className="th">Email</th>
            <th className="th">Department</th>
            <th className="th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="row">
              <td className="td">{r.first_name}</td>
              <td className="td">{r.last_name}</td>
              <td className="td">{r.email}</td>
              <td className="td">{r.department}</td>
              <td className="td">
                <a className="link" href={`/employees/${r.id}`}>Details</a>{' '}|{' '}
                <PermissionGate perm="edit:employees"><a className="link" href={`/employees/${r.id}/edit`}>Edit</a></PermissionGate>
                {' '}|{' '}
                <PermissionGate perm="delete:employees">
                  <form action={deleteEmployeeAction} method="post" style={{display:"inline"}}>
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
