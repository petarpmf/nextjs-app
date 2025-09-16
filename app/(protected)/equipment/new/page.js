import { requirePermission } from "@/lib/session";
import { createEquipmentAction } from "../actions";
import { getOrCreateCsrfToken } from "@/lib/csrf";

export const metadata = { title: "New Equipment" };

export default async function NewEquipment({ searchParams }) {
  await requirePermission("create:equipment");
  const csrf = getOrCreateCsrfToken();
  return (
    <div className="card" style={{maxWidth:600}}>
      <h1 className="h1">Create Equipment</h1>
      {searchParams?.error && <div className="error">{decodeURIComponent(searchParams.error)}</div>}
      <form action={createEquipmentAction} method="post">
        <input type="hidden" name="csrf" value={csrf} />
        <div style={{marginBottom:12}}>
          <label>Tag</label><br/>
          <input className="input" name="tag" />
        </div>
        <div style={{marginBottom:12}}>
          <label>Name</label><br/>
          <input className="input" name="name" />
        </div>
        <div style={{marginBottom:12}}>
          <label>Description</label><br/>
          <textarea className="input" name="description" rows="3" />
        </div>
        <button className="button" type="submit">Create</button>
        <a className="link" style={{marginLeft:12}} href="/equipment">Cancel</a>
      </form>
    </div>
  );
}
