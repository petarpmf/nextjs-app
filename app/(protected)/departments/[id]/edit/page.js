import { requirePermission } from "@/lib/session";
import { getDepartmentById } from "@/services/departments";
import { updateDepartmentAction } from "../../actions";
import { getOrCreateCsrfToken } from "@/lib/csrf";

export const metadata = { title: "Edit Department" };

export default async function EditDepartment({ params, searchParams }) {
  await requirePermission("edit:departments");
  const dept = getDepartmentById(params.id);
  if (!dept) throw new Error(); 
  const csrf = getOrCreateCsrfToken();
  return (
    <div className="card" style={{maxWidth:600}}>
      <h1 className="h1">Edit Department</h1>
      {searchParams?.error && <div className="error">{decodeURIComponent(searchParams.error)}</div>}
      <form action={updateDepartmentAction} method="post">
        <input type="hidden" name="csrf" value={csrf} />
        <input type="hidden" name="id" value={dept.id} />
        <div style={{marginBottom:12}}>
          <label>Name</label><br/>
          <input className="input" name="name" defaultValue={dept.name} />
        </div>
        <button className="button" type="submit">Save</button>
        <a className="link" style={{marginLeft:12}} href={`/departments/${dept.id}`}>Cancel</a>
      </form>
    </div>
  );
}
