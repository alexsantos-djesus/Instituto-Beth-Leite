import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendRequestApprovedEmail } from "@/lib/mail";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const reqAdocao = await prisma.adoptionRequest.findUnique({
    where: { id },
    include: { animal: { select: { nome: true } } },
  });

  if (!reqAdocao) {
    return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 });
  }

  if (reqAdocao.status === "APROVADO") {
    return NextResponse.json({ ok: true });
  }

  await prisma.adoptionRequest.update({
    where: { id },
    data: { status: "APROVADO" },
  });

  // 🔔 E-MAIL DE APROVAÇÃO
  await sendRequestApprovedEmail(reqAdocao.email, reqAdocao.nome, reqAdocao.animal.nome);

  return NextResponse.json({ ok: true });
}
