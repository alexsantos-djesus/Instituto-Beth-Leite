import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const data = await prisma.donationSettings.findUnique({
    where: { id: "singleton" },
    include: { collectionPoints: { orderBy: [{ active: "desc" }, { order: "asc" }, { name: "asc" }] } },
  });
  return NextResponse.json(data ?? null);
}

export async function PUT(req: Request) {
  try {
    const b = await req.json();

    const saved = await prisma.donationSettings.upsert({
      where: { id: "singleton" },
      update: {
        pixKey: b.pixKey ?? null,
        pixKeyType: b.pixKeyType ?? null,
        bankName: b.bankName ?? null,
        bankAgency: b.bankAgency ?? null,
        bankAccount: b.bankAccount ?? null,
        bankHolder: b.bankHolder ?? null,
        recurringLink: b.recurringLink ?? null,
        itemsWanted: b.itemsWanted ?? null,
      },
      create: {
        id: "singleton",
        pixKey: b.pixKey ?? null,
        pixKeyType: b.pixKeyType ?? null,
        bankName: b.bankName ?? null,
        bankAgency: b.bankAgency ?? null,
        bankAccount: b.bankAccount ?? null,
        bankHolder: b.bankHolder ?? null,
        recurringLink: b.recurringLink ?? null,
        itemsWanted: b.itemsWanted ?? null,
      },
    });

    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: "Falha ao salvar configurações" }, { status: 500 });
  }
}
