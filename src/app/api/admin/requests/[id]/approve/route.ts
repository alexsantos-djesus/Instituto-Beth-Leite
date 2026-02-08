import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendRequestApprovedEmail } from "@/lib/mail";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  // 🔐 sessão
  const token = cookies().get("ibl_user")?.value;
  const session = token ? await verifySession(token) : null;

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const userId = Number(session.id);
  const role = session.role;

  // 🔎 buscar solicitação + dono do animal
  const reqAdocao = await prisma.adoptionRequest.findUnique({
    where: { id },
    include: {
      animal: {
        select: {
          nome: true,
          criadoPorId: true,
        },
      },
    },
  });

  if (!reqAdocao) {
    return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 });
  }

  // 🔒 permissão
  if (role !== "ADMIN" && reqAdocao.animal.criadoPorId !== userId) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  if (reqAdocao.status === "APROVADO") {
    return NextResponse.json({ ok: true });
  }

  // ✅ aprova
  await prisma.adoptionRequest.update({
    where: { id },
    data: { status: "APROVADO" },
  });

  // 📧 email para o adotante
  await sendRequestApprovedEmail(reqAdocao.email, reqAdocao.nome, reqAdocao.animal.nome);

  return NextResponse.json({ ok: true });
}