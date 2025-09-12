// src/app/api/admin/animals/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FivFelvStatus } from "@prisma/client";

// aceita strings variadas e normaliza para o enum ou null
function toFivFelvStatus(val: unknown): FivFelvStatus | null {
  if (val == null || val === "") return null;
  const s = String(val).trim().toUpperCase();

  // valores oficiais
  if (s === "POSITIVO") return FivFelvStatus.POSITIVO;
  if (s === "NEGATIVO") return FivFelvStatus.NEGATIVO;
  if (s === "NAO_TESTADO" || s === "NÃO_TESTADO") return FivFelvStatus.NAO_TESTADO;

  // tolerância a textos vindos de formulários antigos
  if (s.includes("POSI")) return FivFelvStatus.POSITIVO;
  if (s.includes("NEGA")) return FivFelvStatus.NEGATIVO;
  if (s.includes("NAO") || s.includes("NÃO")) return FivFelvStatus.NAO_TESTADO;

  return null;
}

export async function GET() {
  const data = await prisma.animal.findMany({
    orderBy: { atualizadoEm: "desc" },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
  });
  return NextResponse.json(data, { headers: { "cache-control": "no-store" } });
}

export async function POST(req: Request) {
  const body = await req.json();
  const {
    slug,
    nome,
    especie,
    sexo,
    porte,
    idadeMeses,
    vacinado,
    castrado,
    raca,
    temperamento,
    descricao,
    historiaResgate,
    convivencia,
    saudeDetalhes,
    dataResgate,
    photos = [],
    // NOVO: aceite `fivFelvStatus` no payload
    fivFelvStatus,
    // compat: se ainda vier `fivFelvTested`, vamos ignorar (não há como diferenciar positivo/negativo)
  } = body;

  const created = await prisma.animal.create({
    data: {
      slug,
      nome,
      especie,
      sexo,
      porte,
      idadeMeses: Number(idadeMeses || 0),
      vacinado: !!vacinado,
      castrado: !!castrado,
      raca: raca ?? null,
      temperamento: temperamento ?? null,
      descricao,
      historiaResgate: historiaResgate ?? null,
      convivencia: convivencia ?? null,
      saudeDetalhes: saudeDetalhes ?? null,
      dataResgate: dataResgate ? new Date(dataResgate) : null,
      // somente para gatos; outros ficam null
      fivFelvStatus: especie === "GATO" ? toFivFelvStatus(fivFelvStatus) : null,
      atualizadoEm: new Date(),
      photos:
        Array.isArray(photos) && photos.length
          ? {
              create: photos.map((p: any, i: number) => ({
                url: p.url,
                alt: p.alt ?? "",
                sortOrder: i,
                isCover: i === 0,
              })),
            }
          : undefined,
    },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
  });

  revalidatePath("/");
  revalidatePath("/animais");
  revalidatePath(`/animais/${created.slug}`);
  revalidatePath("/admin/animals");

  return NextResponse.json(created, { status: 201 });
}
