import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

export async function GET(_: Request, { params }: Params) {
  const item = await prisma.partner.findUnique({ where: { id: params.id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json();
    const updated = await prisma.partner.update({
      where: { id: params.id },
      data: {
        name: body.name,
        url: body.url ?? null,
        logoUrl: body.logoUrl,
        active: typeof body.active === "boolean" ? body.active : undefined,
        order: typeof body.order === "number" ? body.order : undefined,
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Falha ao atualizar parceiro" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await prisma.partner.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Falha ao excluir parceiro" }, { status: 500 });
  }
}
