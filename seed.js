import { db } from "./lib/db.js";
import bcrypt from "bcrypt";
import { rid } from "./lib/ids.js";

function upsertPermission(key, description = null) {
  const existing = db.prepare("SELECT id FROM permission WHERE key = ?").get(key);
  if (existing) return existing.id;
  const id = rid();
  db.prepare("INSERT INTO permission (id, key, description) VALUES (?,?,?)").run(id, key, description || key);
  return id;
}
function upsertRole(name, description = null) {
  const existing = db.prepare("SELECT id FROM role WHERE name = ?").get(name);
  if (existing) return existing.id;
  const id = rid();
  db.prepare("INSERT INTO role (id, name, description) VALUES (?,?,?)").run(id, name, description);
  return id;
}
function attachRolePermission(roleId, permId) {
  db.prepare("INSERT OR IGNORE INTO role_permission (role_id, permission_id) VALUES (?,?)").run(roleId, permId);
}
function upsertUser(email, name, password, roleIds = []) {
  let user = db.prepare("SELECT * FROM user WHERE email = ?").get(email);
  if (!user) {
    const id = rid();
    const hash = bcrypt.hashSync(password, 10);
    db.prepare("INSERT INTO user (id, email, name, hashed_password) VALUES (?,?,?,?)").run(id, email, name, hash);
    user = { id, email, name };
  }
  for (const rid_ of roleIds) {
    db.prepare("INSERT OR IGNORE INTO user_role (user_id, role_id) VALUES (?,?)").run(user.id, rid_);
  }
  return user.id;
}

// Permissions & roles
const permKeys = [
  "view:dashboard",
  "view:employees",
  "view:departments",
  "view:equipment",
  "view:employee:detail",
  "create:departments",
  "create:employees",
  "create:equipment",
  "delete:departments",
  "delete:employees",
  "delete:equipment",
  "edit:departments",
  "edit:employees",
  "edit:equipment"
];
const permIds = Object.fromEntries(permKeys.map(k => [k, upsertPermission(k, k)]));
const admin = upsertRole("admin", "Full access");
const viewer = upsertRole("viewer", "Read-only access");
for (const k of permKeys) attachRolePermission(admin, permIds[k]);
for (const k of permKeys) attachRolePermission(viewer, permIds[k]);

// Users
upsertUser("admin@example.com", "Admin", "admin123", [admin]);
upsertUser("viewer@example.com", "Viewer", "viewer123", [viewer]);

// Domain
function upsertDepartment(name) {
  const row = db.prepare("SELECT id FROM department WHERE name = ?").get(name);
  if (row) return row.id;
  const id = rid();
  db.prepare("INSERT INTO department (id, name) VALUES (?,?)").run(id, name);
  return id;
}
function createEmployee(first, last, email, departmentId) {
  const id = rid();
  db.prepare("INSERT INTO employee (id, first_name, last_name, email, department_id) VALUES (?,?,?,?,?)")
    .run(id, first, last, email, departmentId);
  return id;
}
function createEquipment(tag, name, description = null) {
  const id = rid();
  db.prepare("INSERT INTO equipment (id, tag, name, description) VALUES (?,?,?,?)").run(id, tag, name, description);
  return id;
}
function linkEquipmentToEmployee(employeeId, equipmentId) {
  db.prepare("INSERT OR IGNORE INTO employee_equipment (employee_id, equipment_id, assigned_at) VALUES (?,?,?)")
    .run(employeeId, equipmentId, Date.now());
}

const it = upsertDepartment("IT");
const hr = upsertDepartment("HR");
const e1 = createEmployee("Ana", "Ilieva", "ana@corp.mk", it);
const e2 = createEmployee("Marko", "Trajkov", "marko@corp.mk", hr);
const q1 = createEquipment("LAP-001", "Laptop Dell 5510");
const q2 = createEquipment("PHN-101", "iPhone 14");
linkEquipmentToEmployee(e1, q1);
linkEquipmentToEmployee(e2, q2);

console.log("Seed complete. Admin: admin@example.com / admin123  Viewer: viewer@example.com / viewer123");
