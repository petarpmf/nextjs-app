import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { db } from "@/lib/db";

export const lucia = new Lucia(
  new BetterSqlite3Adapter(db, {
    user: "user",
    session: "session"
  }),
  {
    sessionCookie: {
      expires: false,
      attributes: {
        secure: process.env.NODE_ENV === "production"
      }
    }
  }
);

// noop export for JS env
export const __lucia_register = {};
