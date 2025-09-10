import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/* -------------------- helpers -------------------- */
const onlyDigits = (s: string) => String(s || "").replace(/\D/g, "");

/* -------------------- Perfil (novo) -------------------- */
const TempoAusente = ["ATE_4H", "H4_8", "H8_12", "12H_PLUS"] as const;

const PerfilBase = z.object({
  // 1
  trabalhaFora: z.enum(["SIM", "NAO"]),
  // 2 (condicional quando trabalhaFora = SIM)
  tempoAusente: z.enum(TempoAusente).optional(),
  // 3
  ramoTrabalho: z.string().min(2).max(120),
  // 4
  alguemEmCasaDia: z.enum(["SIM", "NAO"]),
  // 5
  moradoresQtd: z.coerce.number().int().min(1).max(50),
  // 6
  haCriancas: z.enum(["SIM", "NAO"]),
  // 7
  idadeResponsavel: z.coerce.number().int().min(18).max(120),
  // 9
  redesSociais: z.string().optional().default(""),
  // 10
  moradiaTipo: z.enum(["CASA", "APTO"]),
  // 11
  casaBemFechada: z.enum(["SIM", "NAO"]),
  // 12
  imovelTipo: z.enum(["PROPRIO", "ALUGADO"]),
  // 13
  possuiOutrosAnimais: z.enum(["SIM", "NAO"]),
  // 14/15 (condicionais)
  qtdCaes: z.coerce.number().int().min(0).max(50).optional(),
  qtdGatos: z.coerce.number().int().min(0).max(50).optional(),
  castrados: z.enum(["SIM", "NAO"]).optional(),
  // 16
  sabeImportanciaCastracao: z.enum(["SIM", "NAO"]),
  // 17
  ondeVivera: z.enum(["DENTRO", "QUINTAL", "MISTO"]),
  // 18
  morreuAnimalRecente: z.enum(["SIM", "NAO"]),
  // 19
  condicoesFinanceirasVet: z.enum(["SIM", "NAO"]),
  // 20
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

/* -------------------- Body do POST -------------------- */
const CreateRequestSchema = z.object({
  animalId: z.coerce.number().int().positive(),
  nome: z.string().min(2).max(120),
  email: z.string().email(),

  // telefone: salvar em dígitos (DDD+9) — precisa ser WhatsApp
  telefone: z
    .string()
    .min(8)
    .max(25)
    .transform(onlyDigits)
    .refine((v) => v.length === 11, "Telefone deve ter DDD + 9 dígitos (11 números)"),

  // Endereço (novos campos; mantemos cidade/uf também como colunas)
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

  perfil: PerfilSchema, // todo o resto do questionário
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
      select: { id: true, adotado: true },
    });
    if (!exists || exists.adotado) {
      return NextResponse.json({ error: "Animal indisponível." }, { status: 404 });
    }

    const created = await prisma.adoptionRequest.create({
      data: {
        animalId: data.animalId,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone, // já vem só com dígitos
        cidade: data.cidade,
        uf: data.uf,             // já uppercase pelo schema
        cep: data.cep,
        endereco: data.endereco,
        numero: data.numero,
        bairro: data.bairro,

        mensagem: data.mensagem,
        perfil: data.perfil,     // guarda o restante do questionário
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    if (err?.issues) {
      return NextResponse.json(
        { error: "Dados inválidos", details: err.issues },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Erro ao criar solicitação" }, { status: 500 });
  }
}
