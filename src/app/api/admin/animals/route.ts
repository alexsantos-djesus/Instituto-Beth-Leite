// src/app/api/admin/animals/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function toFivFelv(val: unknown): boolean | null {
  if (typeof val === "boolean") return val;
  if (val == null) return null;
  const s = String(val).trim().toUpperCase();
  if (s === "SIM" || s === "TRUE" || s === "1") return true;
  if (s === "NAO" || s === "NÃO" || s === "FALSE" || s === "0") return false;
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
    slug, nome, especie, sexo, porte, idadeMeses,
    vacinado, castrado, raca, temperamento, descricao,
    historiaResgate, convivencia, saudeDetalhes, dataResgate,
    photos = [], fivFelvTested,
  } = body;

  const created = await prisma.animal.create({
    data: {
      slug, nome, especie, sexo, porte,
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
      fivFelvTested: especie === "GATO" ? toFivFelv(fivFelvTested) : null,
      atualizadoEm: new Date(),
      photos: Array.isArray(photos) && photos.length
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
