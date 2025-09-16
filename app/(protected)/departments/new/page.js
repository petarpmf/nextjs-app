import { requirePermission } from "@/lib/session";
import { createDepartmentAction } from "../actions";
import { getOrCreateCsrfToken } from "@/lib/csrf";

export const metadata = { title: "New Department" };

export default async function NewDepartment({ searchParams }) {
  await requirePermission("create:departments");
  const csrf = getOrCreateCsrfToken();
  return (
    <div className="card" style={{maxWidth:600}}>
      <h1 className="h1">Create Department</h1>
      {searchParams?.error && <div className="error">{decodeURIComponent(searchParams.error)}</div>}
      <form action={createDepartmentAction} method="post">
        <input type="hidden" name="csrf" value={csrf} />
        <div style={{marginBottom:12}}>
          <label>Name</label><br/>
          <input className="input" name="name" />
        </div>
        <button className="button" type="submit">Create</button>
        <a className="link" style={{marginLeft:12}} href="/departments">Cancel</a>
      </form>
    </div>
  );
}
