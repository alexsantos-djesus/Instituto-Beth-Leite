import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, canApprove } from "@/lib/authz";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const me = await getSessionUser();
  if (!canApprove(me)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const targetId = Number(params.id);
  if (Number.isNaN(targetId)) return NextResponse.json({ error: "invalid id" }, { status: 400 });

  const user = await prisma.user.update({
    where: { id: targetId },
    data: { approved: true },
    select: { id: true, name: true, email: true, role: true, approved: true },
  });

  return NextResponse.json({ ok: true, user });
}
