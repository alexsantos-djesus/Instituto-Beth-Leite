import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, canSeeUsers } from "@/lib/authz";

export async function GET() {
  const me = await getSessionUser();
  if (!canSeeUsers(me)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const users = await prisma.user.findMany({
    orderBy: [{ approved: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      name: true,
      email: true,
      institution: true,
      photoUrl: true,
      role: true,
      approved: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ users });
}
