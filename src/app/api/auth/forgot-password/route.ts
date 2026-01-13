import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendResetEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ ok: true });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    const link = `${process.env.APP_URL}/reset-password?token=${token}`;
    await sendResetEmail(email, link);

    await prisma.passwordReset.deleteMany({
      where: { userId: user.id },
    });

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("forgot-password error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
