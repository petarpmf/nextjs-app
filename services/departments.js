import { db } from "@/lib/db";
import { rid } from "@/lib/ids";

export function listDepartmentsWithCounts() {
  return db.prepare(`
    SELECT d.id, d.name, COUNT(e.id) AS employee_count
    FROM department d
    LEFT JOIN employee e ON e.department_id = d.id
    GROUP BY d.id
    ORDER BY d.name
  `).all();
}

export function getDepartmentById(id) {
  return db.prepare("SELECT * FROM department WHERE id = ?").get(id);
}

export function listEmployeesByDepartment(deptId) {
  return db.prepare(`
    SELECT id, first_name, last_name, email FROM employee
    WHERE department_id = ? ORDER BY last_name, first_name
  `).all(deptId);
}

export function createDepartment(data) {
  const id = rid();
  db.prepare("INSERT INTO department (id, name) VALUES (?, ?)").run(id, data.name);
  return id;
}

export function updateDepartmentById(id, data) {
  db.prepare("UPDATE department SET name = ? WHERE id = ?").run(data.name, id);
}

export function deleteDepartmentById(id) {
  db.prepare("DELETE FROM department WHERE id = ?").run(id);
}
