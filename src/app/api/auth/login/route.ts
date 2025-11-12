import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signSession } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "faltam campos" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email: String(email).toLowerCase().trim() },
  });
  if (!user) return NextResponse.json({ error: "credenciais inválidas" }, { status: 401 });

  const ok = await bcrypt.compare(String(password), user.password);
  if (!ok) return NextResponse.json({ error: "credenciais inválidas" }, { status: 401 });

  const isUser1 = String(user.id) === "1";
  const approved = isUser1 ? true : user.approved;

  const token = await signSession({
    id: String(user.id),
    role: user.role as "ADMIN" | "EDITOR" | "USER",
    approved,
  });

  const res = NextResponse.json({ ok: true, approved, role: user.role });
  res.cookies.set("ibl_user", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}
