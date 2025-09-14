import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const payload = await req.json();
  const items = Array.isArray(payload?.photos) ? payload.photos : [payload];

  const start = await prisma.photo.count({ where: { animalId: id } });

  const created = await prisma.$transaction(
    items.filter((p: any) => p?.url).map((p: any, idx: number) =>
      prisma.photo.create({
        data: {
          url: p.url,
          alt: p.alt ?? "",
          animalId: id,
          sortOrder: start + idx,
          isCover: start + idx === 0,
        },
      })
    )
  );

  await prisma.animal.update({ where: { id }, data: { atualizadoEm: new Date() } });

  const animal = await prisma.animal.findUnique({ where: { id }, select: { slug: true } });

  revalidatePath("/animais");
  if (animal?.slug) revalidatePath(`/animais/${animal.slug}`);
  revalidatePath("/admin/animals");
  revalidatePath("/");

  return NextResponse.json({ ok: true, count: created.length }, { status: 201 });
}
