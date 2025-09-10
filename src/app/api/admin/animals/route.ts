import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const data = await prisma.animal.findMany({
    orderBy: { atualizadoEm: "desc" },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
  });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const {
    slug, nome, especie, sexo, porte, idadeMeses,
    vacinado, castrado, raca, temperamento, descricao,
    historiaResgate, convivencia, saudeDetalhes, dataResgate,
  } = body;

  const created = await prisma.animal.create({
    data: {
      slug, nome, especie, sexo, porte, idadeMeses,
      vacinado: !!vacinado, castrado: !!castrado,
      raca: raca ?? null, temperamento: temperamento ?? null, descricao,
      historiaResgate: historiaResgate ?? null,
      convivencia: convivencia ?? null,
      saudeDetalhes: saudeDetalhes ?? null,
      dataResgate: dataResgate ? new Date(dataResgate) : null,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
