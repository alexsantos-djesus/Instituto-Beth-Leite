import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const UpdateStatusSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(["NOVO", "CONTATADO", "NAO_ELEGIVEL"]),
});

export async function GET() {
  const list = await prisma.adoptionRequest.findMany({
    include: { animal: { select: { id: true, nome: true } } },
    orderBy: { criadoEm: "desc" },
  });
  return NextResponse.json(list, { headers: { "cache-control": "no-store" } });
}

export async function PUT(req: Request) {
  try {
    const json = await req.json();
    const data = UpdateStatusSchema.parse({ ...json, id: Number(json?.id) });

    const updated = await prisma.adoptionRequest.update({
      where: { id: data.id },
      data: { status: data.status },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    if (err?.issues) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}
