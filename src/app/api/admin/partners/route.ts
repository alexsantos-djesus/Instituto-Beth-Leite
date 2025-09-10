import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const list = await prisma.partner.findMany({
    orderBy: [{ active: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  try {
    const { name, url, logoUrl, active = true, order = 0 } = await req.json();
    if (!name || !logoUrl) {
      return NextResponse.json({ error: "name e logoUrl são obrigatórios" }, { status: 400 });
    }
    const created = await prisma.partner.create({
      data: { name, url: url || null, logoUrl, active, order },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Falha ao criar parceiro" }, { status: 500 });
  }
}
