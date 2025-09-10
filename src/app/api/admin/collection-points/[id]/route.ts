import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

export async function PUT(req: Request, { params }: Params) {
  try {
    const b = await req.json();
    const updated = await prisma.collectionPoint.update({
      where: { id: params.id },
      data: {
        name: b.name,
        address: b.address,
        hours: b.hours ?? null,
        phone: b.phone ?? null,
        active: typeof b.active === "boolean" ? b.active : undefined,
        order: typeof b.order === "number" ? b.order : undefined,
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Falha ao atualizar ponto" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await prisma.collectionPoint.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Falha ao excluir ponto" }, { status: 500 });
  }
}
