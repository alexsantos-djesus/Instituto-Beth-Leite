import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const form = await req.formData();
  const name = String(form.get("name") || "");
  const email = String(form.get("email") || "")
    .toLowerCase()
    .trim();
  const password = String(form.get("password") || "");
  const institution = String(form.get("institution") || "");
  const photo = form.get("photo") as File | null;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "faltam campos" }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "e-mail já cadastrado" }, { status: 409 });

  const hash = await bcrypt.hash(password, 10);

  // TODO: subir a foto e obter URL, se aplicável
  const photoUrl = null as string | null;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hash,
      institution: institution || null,
      photoUrl,
      role: "USER", // nasce como USER
      approved: false, // pendente
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: user.id });
}
