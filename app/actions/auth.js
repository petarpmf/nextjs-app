"use server";

import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export async function login(formData) {
  const email = String(formData.get("email") || "").toLowerCase();
  const password = String(formData.get("password") || "");
  const user = db.prepare("SELECT * FROM user WHERE email = ?").get(email);
  if (!user) {
    redirect("/login?error=1");
  }
  const ok = await bcrypt.compare(password, user.hashed_password);
  if (!ok) {
    redirect("/login?error=1");
  }
  
  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  console.log("-=-=--=-");
  console.log(sessionCookie)
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  redirect("/");
}

export async function logout() {
  const c = cookies();
  const sessionId = c.get(lucia.sessionCookieName)?.value;
  if (sessionId) await lucia.invalidateSession(sessionId);
  const blank = lucia.createBlankSessionCookie();
  c.set(blank.name, blank.value, blank.attributes);
  redirect("/login");
}
