import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const revalidate = 0;
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
