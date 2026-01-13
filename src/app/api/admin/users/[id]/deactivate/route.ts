import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, canApprove } from "@/lib/authz";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const me = await getSessionUser();
  if (!canApprove(me)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const targetId = Number(params.id);
  if (Number.isNaN(targetId)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const meId = me ? Number(me.id) : null;
  if (meId && targetId === meId) {
    return NextResponse.json({ error: "cannot deactivate yourself" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: targetId },
    data: { active: false },
  });

  return NextResponse.json({ ok: true });
}
