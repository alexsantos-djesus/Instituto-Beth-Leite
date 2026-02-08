import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendRequestStatusEmail } from "@/lib/mail";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";

const UpdateStatusSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(["NOVO", "CONTATADO", "NAO_ELEGIVEL"]),
});

export async function GET() {
  const token = cookies().get("ibl_user")?.value;
  const session = token ? await verifySession(token) : null;

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const userId = Number(session.id);
  const role = session.role;

  const list = await prisma.adoptionRequest.findMany({
    where:
      role === "ADMIN"
        ? {}
        : {
            animal: {
              criadoPorId: userId,
            },
          },
    include: {
      animal: {
        select: {
          id: true,
          nome: true,
          criadoPor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: { criadoEm: "desc" },
  });

  return NextResponse.json(list, {
    headers: { "cache-control": "no-store" },
  });
}

export async function PUT(req: Request) {
  try {
    const token = cookies().get("ibl_user")?.value;
    const session = token ? await verifySession(token) : null;

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const userId = Number(session.id);
    const role = session.role;

    const json = await req.json();
    const data = UpdateStatusSchema.parse({ ...json, id: Number(json?.id) });

    const before = await prisma.adoptionRequest.findUnique({
      where: { id: data.id },
      include: {
        animal: {
          select: {
            nome: true,
            criadoPorId: true,
          },
        },
      },
    });

    if (!before) {
      return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 });
    }

    // 🔒 REGRA DE PERMISSÃO
    if (role !== "ADMIN" && before.animal.criadoPorId !== userId) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    const updated = await prisma.adoptionRequest.update({
      where: { id: data.id },
      data: { status: data.status },
    });

    // 📧 Email ao solicitante
    if (
      before.status !== data.status &&
      (data.status === "CONTATADO" || data.status === "NAO_ELEGIVEL")
    ) {
      await sendRequestStatusEmail(before.email, before.nome, before.animal.nome, data.status);
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    if (err?.issues) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}