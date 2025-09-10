import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const list = await prisma.collectionPoint.findMany({
    orderBy: [{ active: "desc" }, { order: "asc" }, { name: "asc" }],
  });
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!b.name || !b.address) {
      return NextResponse.json({ error: "name e address são obrigatórios" }, { status: 400 });
    }
    const created = await prisma.collectionPoint.create({
      data: {
        settingsId: "singleton",
        name: b.name,
        address: b.address,
        hours: b.hours ?? null,
        phone: b.phone ?? null,
        active: typeof b.active === "boolean" ? b.active : true,
        order: typeof b.order === "number" ? b.order : 0,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Falha ao criar ponto de coleta" }, { status: 500 });
  }
}
