import { db } from "@/lib/db";
import { rid } from "@/lib/ids";

export function listEquipmentWithCounts() {
  return db.prepare(`
    SELECT q.id, q.tag, q.name,
      (SELECT COUNT(*) FROM employee_equipment ee WHERE ee.equipment_id = q.id) AS assigned_count
    FROM equipment q
    ORDER BY q.tag
  `).all();
}

export function getEquipmentById(id) {
  return db.prepare("SELECT * FROM equipment WHERE id = ?").get(id);
}

export function listOwnersForEquipment(id) {
  return db.prepare(`
    SELECT e.id, e.first_name, e.last_name FROM employee e
    JOIN employee_equipment ee ON ee.employee_id = e.id
    WHERE ee.equipment_id = ?
  `).all(id);
}

export function createEquipment(data) {
  const id = rid();
  db.prepare("INSERT INTO equipment (id, tag, name, description) VALUES (?,?,?,?)")
    .run(id, data.tag, data.name, data.description || null);
  return id;
}

export function updateEquipmentById(id, data) {
  db.prepare("UPDATE equipment SET tag=?, name=?, description=? WHERE id=?")
    .run(data.tag, data.name, data.description || null, id);
}

export function deleteEquipmentById(id) {
  db.prepare("DELETE FROM equipment WHERE id = ?").run(id);
}
