import { db } from "@/lib/db";

export function getUserByEmail(email) {
  return db.prepare("SELECT * FROM user WHERE email = ?").get(email);
}
export function getUserById(id) {
  return db.prepare("SELECT * FROM user WHERE id = ?").get(id);
}

export function getUserPermissions(userId) {
  const viaRoles = db.prepare(`
    SELECT p.key FROM permission p
    JOIN role_permission rp ON rp.permission_id = p.id
    JOIN user_role ur ON ur.role_id = rp.role_id
    WHERE ur.user_id = ?
  `).all(userId);
  const direct = db.prepare(`
    SELECT p.key FROM permission p
    JOIN user_permission up ON up.permission_id = p.id
    WHERE up.user_id = ?
  `).all(userId);
  const keys = new Set([...(viaRoles?.map(r=>r.key)||[]), ...(direct?.map(r=>r.key)||[])]);
  return Array.from(keys);
}

export function userHasPermission(userId, key) {
  const row = db.prepare(`
    SELECT 1 FROM permission p
    LEFT JOIN role_permission rp ON rp.permission_id = p.id
    LEFT JOIN user_permission up ON up.permission_id = p.id
    LEFT JOIN user_role ur ON ur.role_id = rp.role_id
    WHERE p.key = ? AND (up.user_id = ? OR ur.user_id = ?)
    LIMIT 1
  `).get(key, userId, userId);
  return !!row;
}
