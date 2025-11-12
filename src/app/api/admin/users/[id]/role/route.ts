import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, canChangeRoles } from "@/lib/authz";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const me = await getSessionUser();
  if (!canChangeRoles(me)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { role } = await req.json().catch(() => ({}));
  if (!["ADMIN", "EDITOR", "USER"].includes(role)) {
    return NextResponse.json({ error: "invalid role" }, { status: 400 });
  }

  const targetId = Number(params.id);
  if (Number.isNaN(targetId)) return NextResponse.json({ error: "invalid id" }, { status: 400 });
  if (String(targetId) === "1") return NextResponse.json({ error: "not allowed" }, { status: 400 });

  const user = await prisma.user.update({
    where: { id: targetId },
    data: { role },
    select: { id: true, name: true, email: true, role: true, approved: true },
  });

  return NextResponse.json({ ok: true, user });
}
