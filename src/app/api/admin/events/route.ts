import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(s: string) {
  return s
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

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

export async function GET() {
  const list = await prisma.event.findMany({
    orderBy: [{ published: "desc" }, { startsAt: "desc" }],
  });
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  try {
    const b = await req.json();

    const startsAt = localDatetimeToUTC(b.startsAt);
    const endsAt   = localDatetimeToUTC(b.endsAt);

    if (!b.title || !startsAt) {
      return NextResponse.json(
        { error: "title e startsAt são obrigatórios" },
        { status: 400 }
      );
    }

    let slug: string = (b.slug && String(b.slug).trim()) || slugify(b.title);
    let base = slug, i = 1;
    while (await prisma.event.findUnique({ where: { slug } })) {
      slug = `${base}-${i++}`;
    }

    const created = await prisma.event.create({
      data: {
        title: b.title,
        slug,
        startsAt,
        endsAt: endsAt || null,
        location: b.location || null,
        city: b.city || null,
        coverUrl: b.coverUrl || null,
        excerpt: b.excerpt || null,
        content: b.content || null,
        published: typeof b.published === "boolean" ? b.published : true,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Falha ao criar evento" }, { status: 500 });
  }
}
