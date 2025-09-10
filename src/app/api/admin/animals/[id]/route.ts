import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const a = await prisma.animal.findUnique({
    where: { id: Number(params.id) },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
  });
  if (!a) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(a);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updated = await prisma.animal.update({
    where: { id: Number(params.id) },
    data: {
      ...body,
      dataResgate: body.dataResgate ? new Date(body.dataResgate) : null,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.animal.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
