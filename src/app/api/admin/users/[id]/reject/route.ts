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

  const user = await prisma.user.findUnique({
    where: { id: targetId },
    select: { approved: true },
  });

  if (!user) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }

  if (user.approved) {
    return NextResponse.json({ error: "cannot reject approved user" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: targetId },
    data: {
      approved: false,
      active: false, // 👈 desativa
    },
  });

  return NextResponse.json({ ok: true });
}
