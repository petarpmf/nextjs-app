import { requirePermission } from "@/lib/session";
import PermissionGate from "@/components/PermissionGate";
import { deleteEquipmentAction } from "./actions";
import { getOrCreateCsrfToken } from "@/lib/csrf";
import { listEquipmentWithCounts } from "@/services/equipment";

export const metadata = { title: "Equipment" };

export default async function EquipmentPage({ searchParams }) {
  await requirePermission("view:equipment");
  const rows = listEquipmentWithCounts();
  const csrf = getOrCreateCsrfToken();
  return (
    <div className="card">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
        <h1 className="h1">Equipment</h1>
        <PermissionGate perm="create:equipment">
          <a className="button" href="/equipment/new">New Equipment</a>
        </PermissionGate>
      </div>
      {searchParams?.error && <div className="error">{decodeURIComponent(searchParams.error)}</div>}
      {searchParams?.success && <div className="success">{decodeURIComponent(searchParams.success)}</div>}
      <table className="table">
        <thead><tr>
          <th className="th">Tag</th>
          <th className="th">Name</th>
          <th className="th">Assigned to</th>
          <th className="th">Actions</th>
        </tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="row">
              <td className="td">{r.tag}</td>
              <td className="td">{r.name}</td>
              <td className="td">{r.assigned_count}</td>
              <td className="td">
                <a className="link" href={`/equipment/${r.id}`}>Details</a>{' '}|{' '}
                <PermissionGate perm="edit:equipment"><a className="link" href={`/equipment/${r.id}/edit`}>Edit</a></PermissionGate>
                {' '}|{' '}
                <PermissionGate perm="delete:equipment">
                  <form action={deleteEquipmentAction} method="post" style={{display:"inline"}}>
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
