import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const data = await prisma.donationSettings.findUnique({
    where: { id: "singleton" },
    include: {
      collectionPoints: {
        where: { active: true },
        orderBy: [{ order: "asc" }, { name: "asc" }],
      },
    },
  });

  return NextResponse.json(data ?? null);
}
