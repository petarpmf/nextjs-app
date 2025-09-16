import crypto from "node:crypto";
export function rid() { return crypto.randomUUID(); }
