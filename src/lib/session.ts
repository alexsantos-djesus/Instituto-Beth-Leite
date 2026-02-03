import { verifySession } from "@/lib/auth";

export function getSessionFromToken(token?: string) {
  if (!token) return null;
  return verifySession(token);
}
