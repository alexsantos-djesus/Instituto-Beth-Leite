import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendAdoptionRequestNotification } from "@/lib/mail";

const onlyDigits = (s: string) => String(s || "").replace(/\D/g, "");

const TempoAusente = ["ATE_4H", "H4_8", "H8_12", "12H_PLUS"] as const;

const PerfilBase = z.object({
  trabalhaFora: z.enum(["SIM", "NAO"]),
  tempoAusente: z.enum(TempoAusente).optional(),
  ramoTrabalho: z.string().min(2).max(120),
  alguemEmCasaDia: z.enum(["SIM", "NAO"]),
  moradoresQtd: z.coerce.number().int().min(1).max(50),
  haCriancas: z.enum(["SIM", "NAO"]),
  idadeResponsavel: z.coerce.number().int().min(18).max(120),
  redesSociais: z.string().optional().default(""),
  moradiaTipo: z.enum(["CASA", "APTO"]),
  casaBemFechada: z.enum(["SIM", "NAO"]),
  imovelTipo: z.enum(["PROPRIO", "ALUGADO"]),
  possuiOutrosAnimais: z.enum(["SIM", "NAO"]),
  qtdCaes: z.coerce.number().int().min(0).max(50).optional(),
  qtdGatos: z.coerce.number().int().min(0).max(50).optional(),
  castrados: z.enum(["SIM", "NAO"]).optional(),
  sabeImportanciaCastracao: z.enum(["SIM", "NAO"]),
  ondeVivera: z.enum(["DENTRO", "QUINTAL", "MISTO"]),
  morreuAnimalRecente: z.enum(["SIM", "NAO"]),
  condicoesFinanceirasVet: z.enum(["SIM", "NAO"]),
  verOutrosSeNaoSelecionado: z.enum(["SIM", "NAO"]),
});

const PerfilSchema = PerfilBase.superRefine((val, ctx) => {
  if (val.trabalhaFora === "SIM" && !val.tempoAusente) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Informe o tempo fora de casa",
      path: ["tempoAusente"],
    });
  }
  if (val.possuiOutrosAnimais === "SIM") {
    if (typeof val.qtdCaes !== "number" && typeof val.qtdGatos !== "number") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe a quantidade de cães/gatos",
        path: ["qtdCaes"],
      });
    }
    if (!val.castrados) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe se são castrados",
        path: ["castrados"],
      });
    }
  }
});

const CreateRequestSchema = z.object({
  animalId: z.coerce.number().int().positive(),
  nome: z.string().min(2).max(120),
  email: z.string().email(),

  telefone: z
    .string()
    .min(8)
    .max(25)
    .transform(onlyDigits)
    .refine((v) => v.length === 11, "Telefone deve ter DDD + 9 dígitos (11 números)"),

  cep: z
    .string()
    .min(1, "Informe o CEP")
    .transform(onlyDigits)
    .refine((v) => v.length === 8, "CEP deve ter 8 dígitos"),
  endereco: z.string().min(2).max(200),
  numero: z.string().min(1).max(20),
  bairro: z.string().min(2).max(120),
  cidade: z.string().min(2).max(80),
  uf: z
    .string()
    .min(2)
    .max(2)
    .transform((v) => v.toUpperCase())
    .refine((v) => /^[A-Z]{2}$/.test(v), "UF deve ter 2 letras (ex.: SP)"),

  mensagem: z.string().min(5).max(1000),

  perfil: PerfilSchema,
});

export async function GET() {
  const animals = await prisma.animal.findMany({
    where: { adotado: false },
    select: { id: true, nome: true },
    orderBy: { nome: "asc" },
  });
  return NextResponse.json({ animals }, { headers: { "cache-control": "no-store" } });
}

export async function POST(req: Request) {
  try {
    const json = await req.json();

    const data = CreateRequestSchema.parse({
      ...json,
      animalId: Number(json?.animalId),
    });

    const exists = await prisma.animal.findUnique({
      where: { id: data.animalId },
      select: { id: true, adotado: true, nome: true },
    });

    if (!exists || exists.adotado) {
      return NextResponse.json({ error: "Animal indisponível." }, { status: 404 });
    }

    const created = await prisma.adoptionRequest.create({
      data: {
        animalId: data.animalId,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        cidade: data.cidade,
        uf: data.uf,
        cep: data.cep,
        endereco: data.endereco,
        numero: data.numero,
        bairro: data.bairro,
        mensagem: data.mensagem,
        perfil: data.perfil,
        status: "NOVO",
      },
    });

    const admins = await prisma.user.findMany({
      where: {
        approved: true,
        OR: [{ role: "ADMIN" }, { id: 1 }],
      },
      select: { email: true },
    });

    const adminEmails = admins.map((a) => a.email);

    await sendAdoptionRequestNotification(
      adminEmails,
      exists.nome,
      created.nome, 
      created.email 
    );

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    if (err?.issues) {
      return NextResponse.json({ error: "Dados inválidos", details: err.issues }, { status: 400 });
    }

    console.error("create adoption request error:", err);
    return NextResponse.json({ error: "Erro ao criar solicitação" }, { status: 500 });
  }
}