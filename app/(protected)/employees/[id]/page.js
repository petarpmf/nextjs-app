import { requirePermission } from "@/lib/session";
import { getEmployeeDetail, listEquipmentForEmployee } from "@/services/employees";

export default async function EmployeeDetail({ params }) {
  await requirePermission("view:employee:detail");
  const emp = getEmployeeDetail(params.id);
  if (!emp) return <div className="card">Employee not found</div>;
  const equipment = listEquipmentForEmployee(emp.id);
  return (
    <div className="card">
      <h1 className="h1">Employee Details</h1>
      <p><strong>Name:</strong> {emp.first_name} {emp.last_name}</p>
      <p><strong>Email:</strong> {emp.email}</p>
      <p><strong>Department:</strong> {emp.department}</p>
      <h3>Assigned equipment</h3>
      <ul>
        {equipment.map(e => <li key={e.id}>{e.tag} — {e.name}</li>)}
        {equipment.length === 0 && <li>None</li>}
      </ul>
      <p style={{marginTop:16}}>
        <a className="link" href="/employees">← Back to employees</a>
      </p>
    </div>
  );
}
