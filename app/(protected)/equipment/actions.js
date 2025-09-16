"use server";

import { requirePermission } from "@/lib/session";
import { assertCsrf } from "@/lib/csrf";
import { redirect } from "next/navigation";
import { createEquipment, updateEquipmentById, deleteEquipmentById } from "@/services/equipment";

function get(field, formData) { return String(formData.get(field) || "").trim(); }

export async function createEquipmentAction(formData) {
  await requirePermission("create:equipment");
  assertCsrf(formData);
  const tag = get("tag", formData);
  const name = get("name", formData);
  const description = get("description", formData);
  if (!tag) return redirect("/equipment/new?error=Tag+is+required");
  if (!name) return redirect("/equipment/new?error=Name+is+required");
  try {
    const id = createEquipment({ tag, name, description });
    redirect(`/equipment/${id}`);
  } catch (e) {
    redirect(`/equipment/new?error=${encodeURIComponent(e.message)}`);
  }
}

export async function updateEquipmentAction(formData) {
  await requirePermission("edit:equipment");
  assertCsrf(formData);
  const id = get("id", formData);
  const tag = get("tag", formData);
  const name = get("name", formData);
  const description = get("description", formData);
  if (!id) return redirect("/equipment?error=Missing+id");
  if (!tag) return redirect(`/equipment/${id}/edit?error=Tag+is+required`);
  if (!name) return redirect(`/equipment/${id}/edit?error=Name+is+required`);
  try {
    updateEquipmentById(id, { tag, name, description });
    redirect(`/equipment/${id}`);
  } catch (e) {
    redirect(`/equipment/${id}/edit?error=${encodeURIComponent(e.message)}`);
  }
}

export async function deleteEquipmentAction(formData) {
  await requirePermission("delete:equipment");
  assertCsrf(formData);
  const id = get("id", formData);
  if (!id) return redirect("/equipment?error=Missing+id");
  try {
    deleteEquipmentById(id);
    redirect("/equipment?success=Deleted");
  } catch (e) {
    redirect(`/equipment?error=${encodeURIComponent(e.message)}`);
  }
}
