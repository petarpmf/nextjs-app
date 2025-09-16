"use server";

import { requirePermission } from "@/lib/session";
import { assertCsrf } from "@/lib/csrf";
import { redirect } from "next/navigation";
import { createDepartment, updateDepartmentById, deleteDepartmentById } from "@/services/departments";

function get(field, formData) { return String(formData.get(field) || "").trim(); }

export async function createDepartmentAction(formData) {
  await requirePermission("create:departments");
  assertCsrf(formData);
  const name = get("name", formData);
  if (!name) return redirect("/departments/new?error=Name+is+required");
  try {
    const id = createDepartment({ name });
    redirect(`/departments/${id}`);
  } catch (e) {
    redirect(`/departments/new?error=${encodeURIComponent(e.message)}`);
  }
}

export async function updateDepartmentAction(formData) {
  await requirePermission("edit:departments");
  assertCsrf(formData);
  const id = get("id", formData);
  const name = get("name", formData);
  if (!id) return redirect("/departments?error=Missing+id");
  if (!name) return redirect(`/departments/${id}/edit?error=Name+is+required`);
  try {
    updateDepartmentById(id, { name });
    redirect(`/departments/${id}`);
  } catch (e) {
    redirect(`/departments/${id}/edit?error=${encodeURIComponent(e.message)}`);
  }
}

export async function deleteDepartmentAction(formData) {
  await requirePermission("delete:departments");
  assertCsrf(formData);
  const id = get("id", formData);
  if (!id) return redirect("/departments?error=Missing+id");
  try {
    deleteDepartmentById(id);
    redirect("/departments?success=Deleted");
  } catch (e) {
    redirect(`/departments?error=${encodeURIComponent(e.message)}`);
  }
}
