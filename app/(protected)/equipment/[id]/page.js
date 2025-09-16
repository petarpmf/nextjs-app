import { requirePermission } from "@/lib/session";
import { getEquipmentById, listOwnersForEquipment } from "@/services/equipment";

export default async function EquipmentDetail({ params }) {
  await requirePermission("view:equipment");
  const eq = getEquipmentById(params.id);
  if (!eq) return <div className="card">Equipment not found</div>;
  const owners = listOwnersForEquipment(params.id);
  return (
    <div className="card">
      <h1 className="h1">Equipment: {eq.tag} — {eq.name}</h1>
      <p>{eq.description || ""}</p>
      <h3>Assigned to</h3>
      <ul>
        {owners.map(o => <li key={o.id}><a className="link" href={`/employees/${o.id}`}>{o.last_name}, {o.first_name}</a></li>)}
        {owners.length === 0 && <li>Nobody</li>}
      </ul>
      <p style={{marginTop:16}}><a className="link" href="/equipment">← Back to equipment</a></p>
    </div>
  );
}
