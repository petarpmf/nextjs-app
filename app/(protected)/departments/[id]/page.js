import { requirePermission } from "@/lib/session";
import { getDepartmentById, listEmployeesByDepartment } from "@/services/departments";

export default async function DepartmentDetail({ params }) {
  await requirePermission("view:departments");
  const dept = getDepartmentById(params.id);
  if (!dept) throw new Error();
  const employees = listEmployeesByDepartment(params.id);
  return (
    <div className="card">
      <h1 className="h1">Department: {dept.name}</h1>
      <h3>Employees</h3>
      <ul>
        {employees.map(e => <li key={e.id}><a className="link" href={`/employees/${e.id}`}>{e.last_name}, {e.first_name}</a> — {e.email}</li>)}
        {employees.length === 0 && <li>No employees</li>}
      </ul>
      <p style={{marginTop:16}}><a className="link" href="/departments">← Back to departments</a></p>
    </div>
  );
}
