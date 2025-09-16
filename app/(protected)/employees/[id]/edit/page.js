import { requirePermission } from "@/lib/session";
import { getEmployeeById, listDepartments } from "@/services/employees";
import { updateEmployeeAction } from "../../actions";
import { getOrCreateCsrfToken } from "@/lib/csrf";

export const metadata = { title: "Edit Employee" };

export default async function EditEmployee({ params, searchParams }) {
  await requirePermission("edit:employees");
  const emp = getEmployeeById(params.id);
  if (!emp) return <div className="card">Employee not found</div>;
  const departments = listDepartments();
  const csrf = getOrCreateCsrfToken();
  return (
    <div className="card" style={{maxWidth:600}}>
      <h1 className="h1">Edit Employee</h1>
      {searchParams?.error && <div className="error">{decodeURIComponent(searchParams.error)}</div>}
      <form action={updateEmployeeAction} method="post">
        <input type="hidden" name="csrf" value={csrf} />
        <input type="hidden" name="id" value={emp.id} />
        <div style={{marginBottom:12}}>
          <label>First name</label><br/>
          <input className="input" name="first_name" defaultValue={emp.first_name} />
        </div>
        <div style={{marginBottom:12}}>
          <label>Last name</label><br/>
          <input className="input" name="last_name" defaultValue={emp.last_name} />
        </div>
        <div style={{marginBottom:12}}>
          <label>Email</label><br/>
          <input className="input" name="email" defaultValue={emp.email} />
        </div>
        <div style={{marginBottom:12}}>
          <label>Department</label><br/>
          <select className="input" name="department_id" defaultValue={emp.department_id}>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <button className="button" type="submit">Save</button>
        <a className="link" style={{marginLeft:12}} href={`/employees/${emp.id}`}>Cancel</a>
      </form>
    </div>
  );
}
