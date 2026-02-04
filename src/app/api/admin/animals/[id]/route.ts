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
  const s = String(v).toUpperCase();
  return s === "POSITIVO" || s === "NEGATIVO" || s === "NAO_TESTADO" ? (s as FivFelv) : null;
};

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const a = await prisma.animal.findUnique({
    where: { id: Number(params.id) },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
  });
  if (!a) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(a, { headers: { "cache-control": "no-store" } });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await req.json().catch(() => ({}));

  const current = await prisma.animal.findUnique({
    where: { id },
    select: { slug: true, especie: true },
  });

  if (!current) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const oldSlug = current.slug;

  const {
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
    slug,
    fivFelvStatus,
    oculto,
    adotado,
  } = body ?? {};

  const safeSlug = slugify(slug || nome || "") || oldSlug;

  const nextFivFelv = (especie ?? current.especie) === "GATO" ? asFivFelv(fivFelvStatus) : null;

  const data = {
    nome,
    sexo,
    porte,
    idadeMeses: Number(idadeMeses),
    vacinado: !!vacinado,
    castrado: !!castrado,
    raca: raca ?? null,
    temperamento: temperamento ?? null,
    descricao,
    historiaResgate: historiaResgate ?? null,
    convivencia: convivencia ?? null,
    saudeDetalhes: saudeDetalhes ?? null,
    dataResgate: dataResgate ? new Date(dataResgate) : null,
    especie,
    slug: safeSlug,
    fivFelvStatus: nextFivFelv,
    oculto: !!oculto,
    adotado: !!adotado,
    adotadoEm: adotado ? new Date() : null,
    atualizadoEm: new Date(),
  };

  const updated = await prisma.animal.update({
    where: { id },
    data,
    select: { id: true, slug: true },
  });

  revalidatePath("/admin/animals");
  revalidatePath("/animais");
  if (oldSlug && oldSlug !== updated.slug) revalidatePath(`/animais/${oldSlug}`);
  revalidatePath(`/animais/${updated.slug}`);
  revalidatePath("/");

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const deleted = await prisma.animal.delete({
    where: { id: Number(params.id) },
    select: { slug: true },
  });

  revalidatePath("/admin/animals");
  revalidatePath("/animais");
  if (deleted?.slug) revalidatePath(`/animais/${deleted.slug}`);
  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
