import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { url, alt } = await req.json();
  const count = await prisma.photo.count({ where: { animalId: Number(params.id) } });
  const created = await prisma.photo.create({
    data: {
      url, alt: alt ?? "", animalId: Number(params.id),
      sortOrder: count, isCover: count === 0
    },
  });
  return NextResponse.json(created, { status: 201 });
}
