import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { photoId: string } }) {
  const data = await req.json();
  const updated = await prisma.photo.update({
    where: { id: Number(params.photoId) }, data
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { photoId: string } }) {
  await prisma.photo.delete({ where: { id: Number(params.photoId) } });
  return NextResponse.json({ ok: true });
}
