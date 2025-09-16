import { db } from "@/lib/db";
import { rid } from "@/lib/ids";

export function listEmployees() {
  return db.prepare(`
    SELECT e.id, e.first_name, e.last_name, e.email, d.name AS department
    FROM employee e
    JOIN department d ON d.id = e.department_id
    ORDER BY e.last_name, e.first_name
  `).all();
}

export function listDepartments() {
  return db.prepare("SELECT id, name FROM department ORDER BY name").all();
}

export function getEmployeeById(id) {
  return db.prepare("SELECT * FROM employee WHERE id = ?").get(id);
}

export function getEmployeeDetail(id) {
  return db.prepare(`
    SELECT e.id, e.first_name, e.last_name, e.email, d.name AS department, e.department_id
    FROM employee e
    JOIN department d ON d.id = e.department_id
    WHERE e.id = ?
  `).get(id);
}

export function listEquipmentForEmployee(employeeId) {
  return db.prepare(`
    SELECT q.id, q.tag, q.name
    FROM equipment q
    JOIN employee_equipment ee ON ee.equipment_id = q.id
    WHERE ee.employee_id = ?
  `).all(employeeId);
}

export function createEmployee(data) {
  const id = rid();
  db.prepare("INSERT INTO employee (id, first_name, last_name, email, department_id) VALUES (?,?,?,?,?)")
    .run(id, data.first_name, data.last_name, data.email, data.department_id);
  return id;
}

export function updateEmployeeById(id, data) {
  db.prepare("UPDATE employee SET first_name=?, last_name=?, email=?, department_id=? WHERE id=?")
    .run(data.first_name, data.last_name, data.email, data.department_id, id);
}

export function deleteEmployeeById(id) {
  db.prepare("DELETE FROM employee WHERE id = ?").run(id);
}
