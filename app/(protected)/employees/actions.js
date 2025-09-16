"use server";

import { requirePermission } from "@/lib/session";
import { assertCsrf } from "@/lib/csrf";
import { redirect } from "next/navigation";
import { createEmployee, updateEmployeeById, deleteEmployeeById } from "@/services/employees";

function get(field, formData) { return String(formData.get(field) || "").trim(); }

export async function createEmployeeAction(formData) {
  await requirePermission("create:employees");
  assertCsrf(formData);
  const first_name = get("first_name", formData);
  const last_name = get("last_name", formData);
  const email = get("email", formData);
  const department_id = get("department_id", formData);
  if (!first_name) return redirect("/employees/new?error=First+name+is+required");
  if (!last_name) return redirect("/employees/new?error=Last+name+is+required");
  if (!/.+@.+\..+/.test(email)) return redirect("/employees/new?error=Invalid+email");
  if (!department_id) return redirect("/employees/new?error=Department+required");
  try {
    const id = createEmployee({ first_name, last_name, email, department_id });
    redirect(`/employees/${id}`);
  } catch (e) {
    redirect(`/employees/new?error=${encodeURIComponent(e.message)}`);
  }
}

export async function updateEmployeeAction(formData) {
  await requirePermission("edit:employees");
  assertCsrf(formData);
  const id = get("id", formData);
  const first_name = get("first_name", formData);
  const last_name = get("last_name", formData);
  const email = get("email", formData);
  const department_id = get("department_id", formData);
  if (!id) return redirect("/employees?error=Missing+id");
  if (!first_name) return redirect(`/employees/${id}/edit?error=First+name+is+required`);
  if (!last_name) return redirect(`/employees/${id}/edit?error=Last+name+is+required`);
  if (!/.+@.+\..+/.test(email)) return redirect(`/employees/${id}/edit?error=Invalid+email`);
  if (!department_id) return redirect(`/employees/${id}/edit?error=Department+required`);
  try {
    updateEmployeeById(id, { first_name, last_name, email, department_id });
    redirect(`/employees/${id}`);
  } catch (e) {
    redirect(`/employees/${id}/edit?error=${encodeURIComponent(e.message)}`);
  }
}

export async function deleteEmployeeAction(formData) {
  await requirePermission("delete:employees");
  assertCsrf(formData);
  const id = get("id", formData);
  if (!id) return redirect("/employees?error=Missing+id");
  try {
    deleteEmployeeById(id);
    redirect("/employees?success=Deleted");
  } catch (e) {
    redirect(`/employees?error=${encodeURIComponent(e.message)}`);
  }
}
