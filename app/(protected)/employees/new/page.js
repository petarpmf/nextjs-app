import { requirePermission } from "@/lib/session";
import { createEmployeeAction } from "../actions";
import { getOrCreateCsrfToken } from "@/lib/csrf";
import { listDepartments } from "@/services/employees";

export const metadata = { title: "New Employee" };

export default async function NewEmployeePage({ searchParams }) {
  await requirePermission("create:employees");
  const departments = listDepartments();
  const csrf = getOrCreateCsrfToken();
  return (
    <div className="card" style={{maxWidth:600}}>
      <h1 className="h1">Create Employee</h1>
      {searchParams?.error && <div className="error">{decodeURIComponent(searchParams.error)}</div>}
      <form action={createEmployeeAction} method="post">
        <input type="hidden" name="csrf" value={csrf} />
        <div style={{marginBottom:12}}>
          <label>First name</label><br/>
          <input className="input" name="first_name" />
        </div>
        <div style={{marginBottom:12}}>
          <label>Last name</label><br/>
          <input className="input" name="last_name" />
        </div>
        <div style={{marginBottom:12}}>
          <label>Email</label><br/>
          <input className="input" name="email" />
        </div>
        <div style={{marginBottom:12}}>
          <label>Department</label><br/>
          <select className="input" name="department_id" defaultValue="">
            <option value="" disabled>Select department</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <button className="button" type="submit">Create</button>
        <a className="link" style={{marginLeft:12}} href="/employees">Cancel</a>
      </form>
    </div>
  );
}
