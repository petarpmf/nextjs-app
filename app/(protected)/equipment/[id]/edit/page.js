import { requirePermission } from "@/lib/session";
import { getEquipmentById } from "@/services/equipment";
import { updateEquipmentAction } from "../../actions";
import { getOrCreateCsrfToken } from "@/lib/csrf";

export const metadata = { title: "Edit Equipment" };

export default async function EditEquipment({ params, searchParams }) {
  await requirePermission("edit:equipment");
  const eq = getEquipmentById(params.id);
  if (!eq) return <div className="card">Equipment not found</div>;
  const csrf = getOrCreateCsrfToken();
  return (
    <div className="card" style={{maxWidth:600}}>
      <h1 className="h1">Edit Equipment</h1>
      {searchParams?.error && <div className="error">{decodeURIComponent(searchParams.error)}</div>}
      <form action={updateEquipmentAction} method="post">
        <input type="hidden" name="csrf" value={csrf} />
        <input type="hidden" name="id" value={eq.id} />
        <div style={{marginBottom:12}}>
          <label>Tag</label><br/>
          <input className="input" name="tag" defaultValue={eq.tag} />
        </div>
        <div style={{marginBottom:12}}>
          <label>Name</label><br/>
          <input className="input" name="name" defaultValue={eq.name} />
        </div>
        <div style={{marginBottom:12}}>
          <label>Description</label><br/>
          <textarea className="input" name="description" rows="3" defaultValue={eq.description || ""} />
        </div>
        <button className="button" type="submit">Save</button>
        <a className="link" style={{marginLeft:12}} href={`/equipment/${eq.id}`}>Cancel</a>
      </form>
    </div>
  );
}
