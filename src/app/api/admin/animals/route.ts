import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const slugify = (s: string) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

type FivFelv = "POSITIVO" | "NEGATIVO" | "NAO_TESTADO";
const asFivFelv = (v: unknown): FivFelv | null => {
  if (v == null) return null;
  const s = String(v).trim().toUpperCase();
  return s === "POSITIVO" || s === "NEGATIVO" || s === "NAO_TESTADO" ? (s as FivFelv) : null;
};

async function uniqueSlug(base: string) {
  let s = slugify(base);
  if (!s) return s;
  let i = 1;
  while (await prisma.animal.findUnique({ where: { slug: s } })) {
    i += 1;
    s = `${slugify(base)}-${i}`;
  }
  return s;
}

export async function GET() {
  const data = await prisma.animal.findMany({
    orderBy: { atualizadoEm: "desc" },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
  });
  return NextResponse.json(data, { headers: { "cache-control": "no-store" } });
}

export async function POST(req: Request) {
  try {
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
      fivFelvStatus,
    } = body ?? {};

    const cleanedNome = String(nome || "").trim();
    const cleanedDescricao = typeof descricao === "string" ? descricao : "";
    if (!cleanedNome) {
      return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
    }
    if (cleanedDescricao == null) {
      return NextResponse.json({ error: "Descrição é obrigatória." }, { status: 400 });
    }

    const baseSlug = slugify(slug || cleanedNome);
    if (!baseSlug) {
      return NextResponse.json({ error: "Slug inválido." }, { status: 400 });
    }
    const safeSlug = await uniqueSlug(baseSlug);

    const created = await prisma.animal.create({
      data: {
        slug: safeSlug,
        nome: cleanedNome,
        especie,
        sexo,
        porte,
        idadeMeses: Number(idadeMeses || 0),
        vacinado: !!vacinado,
        castrado: !!castrado,
        raca: raca ?? null,
        temperamento: temperamento ?? null,
        descricao: cleanedDescricao,
        historiaResgate: historiaResgate ?? null,
        convivencia: convivencia ?? null,
        saudeDetalhes: saudeDetalhes ?? null,
        dataResgate: dataResgate ? new Date(dataResgate) : null,
        fivFelvStatus: especie === "GATO" ? asFivFelv(fivFelvStatus) : null,
        photos:
          Array.isArray(photos) && photos.length
            ? {
                create: photos.map((p: any, i: number) => ({
                  url: String(p.url),
                  alt: p.alt ?? "",
                  sortOrder: Number.isFinite(p.sortOrder) ? p.sortOrder : i,
                  isCover: p.isCover ?? i === 0,
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
  } catch (err: any) {

    if (err?.code === "P2002") {
      return NextResponse.json({ error: "Já existe um animal com esse slug." }, { status: 409 });
    }
    if (err?.code === "P2003") {
      return NextResponse.json(
        { error: "Falha de integridade referencial (foto inválida?)." },
        { status: 400 }
      );
    }
    console.error("POST /api/admin/animals error:", err);
    return NextResponse.json({ error: "Erro interno ao salvar o animal." }, { status: 500 });
  }
}
