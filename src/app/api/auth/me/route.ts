import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const token = cookies().get("ibl_user")?.value;
  if (!token) return NextResponse.json({ ok: false }, { status: 401 });

  const session = await verifySession(token);
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  const idNum = Number(session.id);
  const user = await prisma.user.findUnique({
    where: { id: Number.isNaN(idNum) ? -1 : idNum },
    select: {
      id: true,
      name: true,
      email: true,
      institution: true,
      photoUrl: true,
      role: true,
      approved: true,
    },
  });
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  return NextResponse.json({ ok: true, user });
}
