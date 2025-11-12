import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";

export type SessionUser = { id: string; role: "ADMIN" | "EDITOR" | "USER"; approved?: boolean };

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = cookies().get("ibl_user")?.value;
  if (!token) return null;
  const s = await verifySession(token);
  return s ? { id: String(s.id), role: s.role, approved: s.approved } : null;
}

export function isSuperadmin(u: SessionUser | null) {
  return !!u && u.id === "1";
}

export function canAccessAdmin(u: SessionUser | null) {
  return !!u && (isSuperadmin(u) || u.approved === true);
}

export function canSeeUsers(u: SessionUser | null) {
  return !!u && (isSuperadmin(u) || u.role === "ADMIN");
}

export function canApprove(u: SessionUser | null) {
  return canSeeUsers(u);
}

export function canChangeRoles(u: SessionUser | null) {
  return isSuperadmin(u);
}
