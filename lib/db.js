import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const dbFile = path.join(process.cwd(), "data.sqlite");
const firstRun = !fs.existsSync(dbFile);

export const db = new Database(dbFile);
db.pragma("journal_mode = WAL");

if (firstRun) {
  db.exec(`
  CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    hashed_password TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS session (
    id TEXT PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS role (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT
  );
  CREATE TABLE IF NOT EXISTS permission (
    id TEXT PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    description TEXT
  );
  CREATE TABLE IF NOT EXISTS user_role (
    user_id TEXT NOT NULL,
    role_id TEXT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS role_permission (
    role_id TEXT NOT NULL,
    permission_id TEXT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permission(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS user_permission (
    user_id TEXT NOT NULL,
    permission_id TEXT NOT NULL,
    PRIMARY KEY (user_id, permission_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permission(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS department (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
  );
  CREATE TABLE IF NOT EXISTS employee (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department_id TEXT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE RESTRICT
  );
  CREATE TABLE IF NOT EXISTS equipment (
    id TEXT PRIMARY KEY,
    tag TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT
  );
  CREATE TABLE IF NOT EXISTS employee_equipment (
    employee_id TEXT NOT NULL,
    equipment_id TEXT NOT NULL,
    assigned_at INTEGER NOT NULL,
    PRIMARY KEY (employee_id, equipment_id),
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE
  );
  `);
}
