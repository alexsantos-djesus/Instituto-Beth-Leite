import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

/** Converte "YYYY-MM-DDTHH:mm" (input local) para um Date em UTC */
function localDatetimeToUTC(v: unknown): Date | null {
  if (!v) return null;
  const s = String(v).trim();
  if (!s) return null;
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/);
  if (m) {
    const [_, yy, MM, dd, hh, mm] = m.map(Number);
    return new Date(Date.UTC(yy, MM - 1, dd, hh, mm, 0));
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

export async function GET(_: Request, { params }: Params) {
  const item = await prisma.event.findUnique({ where: { id: params.id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const b = await req.json();

    const startsAt = localDatetimeToUTC(b.startsAt);
    const endsAt   = localDatetimeToUTC(b.endsAt);

    const updated = await prisma.event.update({
      where: { id: params.id },
      data: {
        title: b.title,
        slug: b.slug, // se quiser validar unicidade aqui, pode adicionar verificação
        startsAt: startsAt ?? undefined,                 // não muda se vier undefined
        endsAt: b.endsAt === null ? null : endsAt ?? undefined,
        location: b.location ?? null,
        city: b.city ?? null,
        coverUrl: b.coverUrl ?? null,
        excerpt: b.excerpt ?? null,
        content: b.content ?? null,
        published:
          typeof b.published === "boolean"
            ? b.published
            : undefined,
      },
    });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: "Falha ao atualizar evento" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await prisma.event.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Falha ao excluir evento" }, { status: 500 });
  }
}
