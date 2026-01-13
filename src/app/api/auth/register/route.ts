import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendAdminNotification } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "")
      .toLowerCase()
      .trim();
    const password = String(form.get("password") || "");
    const institution = String(form.get("institution") || "");
    const photo = form.get("photo") as File | null;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Nome, e-mail e senha são obrigatórios" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (exists) {
      return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);

    // TODO: upload da foto (se quiser depois)
    const photoUrl: string | null = null;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
        institution: institution || null,
        photoUrl,
        role: "USER",
        approved: false, // nasce pendente
      },
      select: { id: true, name: true, email: true },
    });

    /**
     * 🔔 NOTIFICAR ADMINS
     */
    const admins = await prisma.user.findMany({
      where: {
        approved: true,
        OR: [{ role: "ADMIN" }, { id: 1 }],
      },
      select: { email: true },
    });

    const adminEmails = admins.map((a) => a.email);

    if (adminEmails.length > 0) {
      await sendAdminNotification(adminEmails, user.name, user.email);
    }

    return NextResponse.json({ ok: true, id: user.id });
  } catch (error) {
    console.error("register error:", error);
    return NextResponse.json({ error: "Erro ao criar conta" }, { status: 500 });
  }
}
