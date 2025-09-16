import { requireUser } from "@/lib/session";

export default async function Guarded({ children }) {
  await requireUser();
  return <>{children}</>;
}
