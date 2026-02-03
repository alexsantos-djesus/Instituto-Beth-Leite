import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";

export async function getSession() {
  const token = cookies().get("ibl_user")?.value;
  if (!token) return null;

  return await verifySession(token);
}
