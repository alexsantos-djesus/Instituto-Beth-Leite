// src/app/api/admin/animals/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

  const {
    photos: _ignorePhotos, // fotos são geridas na rota própria
    dataResgate,
    ...rest
  } = body ?? {};

  const updated = await prisma.animal.update({
    where: { id },
    data: {
      ...rest,
      dataResgate: dataResgate ? new Date(dataResgate) : null,
      atualizadoEm: new Date(),
    },
    select: { id: true, slug: true },
  });

  revalidatePath("/admin/animals");
  revalidatePath("/animais");
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
