// lib/csrf.js
"use server";

// In-memory CSRF token (demo only)
let CSRF_TOKEN = null;

// Get existing token or create a new one
export async function getOrCreateCsrfToken() {
  if (!CSRF_TOKEN) {
    CSRF_TOKEN = crypto.randomUUID();
  }
  return CSRF_TOKEN;
}

// Validate token (pass from request)
export async function assertCsrf(token) {
  if (!token || token !== CSRF_TOKEN) {
    throw new Error("CSRF token missing or invalid");
  }
}
