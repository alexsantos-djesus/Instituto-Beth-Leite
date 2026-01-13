import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, canApprove } from "@/lib/authz";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function GET() {
  const data = await prisma.donationSettings.findUnique({
    where: { id: "singleton" },
    include: {
      collectionPoints: {
        orderBy: [{ active: "desc" }, { order: "asc" }, { name: "asc" }],
      },
    },
  });

  return NextResponse.json(data ?? null);
}

export async function PUT(req: Request) {
  const me = await getSessionUser();
  if (!canApprove(me)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

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
}