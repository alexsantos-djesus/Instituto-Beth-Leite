"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Textarea from "@/components/Textarea";
import Button from "@/components/Button";
import cepPromise from "cep-promise";
import type { Resolver } from "react-hook-form";

function ensureToastHost() {
  let host = document.getElementById("toast-host");
  if (!host) {
    host = document.createElement("div");
    host.id = "toast-host";
    host.className =
      "fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-[min(92vw,760px)] " +
      "flex flex-col items-center gap-3 pointer-events-none";
    document.body.appendChild(host);
  }
  return host;
}

type ToastOptions = {
  variant?: "success" | "error" | "info";
  size?: "sm" | "md" | "lg";
  duration?: number;
};
function toast(message: string, opts: ToastOptions = {}) {
  const { variant = "info", size = "md", duration = 5000 } = opts;
  const host = ensureToastHost();

  const base =
    "pointer-events-auto rounded-2xl text-white ring-1 shadow-[0_18px_48px_rgba(0,0,0,.25)] " +
    "flex items-center gap-3 w-full";

  const sizeCls =
    size === "lg"
      ? "text-base md:text-lg px-6 py-4"
      : size === "sm"
      ? "text-sm px-4 py-2.5"
      : "text-sm md:text-base px-5 py-3";

  const colorCls =
    variant === "success"
      ? "bg-emerald-600 ring-emerald-500"
      : variant === "error"
      ? "bg-rose-600 ring-rose-500"
      : "bg-neutral-800 ring-neutral-700";

  const el = document.createElement("div");
  el.setAttribute("role", "status");
  el.className = `${base} ${sizeCls} ${colorCls}`;
  el.innerHTML = `<div class="grow text-center">${message}</div>`;
  el.style.opacity = "0";
  el.style.transform = "translateY(-10px)";
  el.style.transition = "opacity .25s ease, transform .25s ease";
  host.appendChild(el);
  requestAnimationFrame(() => {
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  });

  const t = window.setTimeout(() => close(), duration);
  function close() {
    window.clearTimeout(t);
    el.style.opacity = "0";
    el.style.transform = "translateY(-10px)";
    window.setTimeout(() => el.remove(), 250);
  }
  return { close };
}

const onlyDigits = (s: string) => s.replace(/\D/g, "");
function formatBRPhone(raw: string) {
  let d = onlyDigits(raw);
  if (d.startsWith("55")) d = d.slice(2);
  d = d.slice(0, 11);
  const ddd = d.slice(0, 2);
  const rest = d.slice(2);
  let body = "";
  if (rest.length <= 4) body = rest;
  else if (rest.length === 8) body = rest.slice(0, 4) + "-" + rest.slice(4);
  else if (rest.length <= 9) body = rest.slice(0, 5) + "-" + rest.slice(5);
  return "+55 " + (ddd ? ddd + " " : "") + body;
}

const enumSelect = <T extends readonly string[]>(vals: T) =>
  z
    .string({ required_error: "Escolha uma opção" })
    .min(1, "Escolha uma opção")
    .refine((v) => (vals as readonly string[]).includes(v), "Escolha uma opção")
    .transform((v) => v as T[number]);

const TempoAusente = ["ATE_4H", "H4_8", "H8_12", "12H_PLUS"] as const;

const PerfilSchemaBase = z.object({
  trabalhaFora: enumSelect(["SIM", "NAO"] as const),
  tempoAusente: z.enum(TempoAusente).optional(),
  ramoTrabalho: z.string().min(2, "Informe seu ramo de trabalho").max(120),
  alguemEmCasaDia: enumSelect(["SIM", "NAO"] as const),
  moradoresQtd: z.coerce.number().int().min(1, "Informe um número").max(50),
  haCriancas: enumSelect(["SIM", "NAO"] as const),
  idadeResponsavel: z.coerce.number().int().min(18, "Responsável deve ter 18+").max(120),
  redesSociais: z.string().optional().default(""),
  moradiaTipo: enumSelect(["CASA", "APTO"] as const),
  casaBemFechada: enumSelect(["SIM", "NAO"] as const),
  imovelTipo: enumSelect(["PROPRIO", "ALUGADO"] as const),
  possuiOutrosAnimais: enumSelect(["SIM", "NAO"] as const),
  qtdCaes: z.coerce.number().int().min(0).max(50).optional(),
  qtdGatos: z.coerce.number().int().min(0).max(50).optional(),
  castrados: enumSelect(["SIM", "NAO"] as const).optional(),
  sabeImportanciaCastracao: enumSelect(["SIM", "NAO"] as const),
  ondeVivera: enumSelect(["DENTRO", "QUINTAL", "MISTO"] as const),
  morreuAnimalRecente: enumSelect(["SIM", "NAO"] as const),
  condicoesFinanceirasVet: enumSelect(["SIM", "NAO"] as const),
  verOutrosSeNaoSelecionado: enumSelect(["SIM", "NAO"] as const),
});

const PerfilSchema = PerfilSchemaBase.superRefine((val, ctx) => {
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

const FormSchema = z.object({
  animalId: z.coerce.number().min(1, "Escolha um animal"),
  nome: z.string().min(2, "Informe seu nome"),
  email: z.string().min(1, "Informe seu e-mail").email("Informe um e-mail válido"),
  telefone: z
    .string()
    .min(1, "Informe seu telefone")
    .transform((v) => {
      let d = onlyDigits(v);
      if (d.startsWith("55")) d = d.slice(2);
      return d;
    })
    .refine((d) => d.length === 11, "Telefone deve ter DDD + 9 dígitos (11 números)"),

  cep: z
    .string()
    .min(1, "Informe o CEP")
    .transform(onlyDigits)
    .refine((v) => v.length === 8, "CEP deve ter 8 dígitos"),
  endereco: z.string().min(2, "Endereço obrigatório"),
  numero: z.string().min(1, "Informe o número"),
  bairro: z.string().min(2, "Bairro obrigatório"),
  cidade: z.string().min(2, "Cidade obrigatória"),
  uf: z
    .string()
    .min(2, "UF obrigatória")
    .max(2, "UF com 2 letras")
    .refine((v) => /^[A-Z]{2}$/.test(v.toUpperCase()), "UF deve ter 2 letras (ex.: SP)")
    .transform((v) => v.toUpperCase() as string),

  mensagem: z.string().min(10, "Conte-nos mais"),
  perfil: PerfilSchema,
});
type FormData = z.infer<typeof FormSchema>;

export default function FormClient({
  animals,
  defaultAnimalId,
}: {
  animals: { id: number; nome: string }[];
  defaultAnimalId?: number;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema) as unknown as Resolver<FormData>,
    defaultValues: {
      cep: "",
      endereco: "",
      numero: "",
      bairro: "",
      cidade: "",
      uf: "",
      perfil: {
        trabalhaFora: "" as any,
        tempoAusente: undefined,
        ramoTrabalho: "",
        alguemEmCasaDia: "" as any,
        moradoresQtd: 1,
        haCriancas: "" as any,
        idadeResponsavel: 18,
        redesSociais: "",
        moradiaTipo: "" as any,
        casaBemFechada: "" as any,
        imovelTipo: "" as any,
        possuiOutrosAnimais: "" as any,
        qtdCaes: undefined,
        qtdGatos: undefined,
        castrados: undefined,
        sabeImportanciaCastracao: "" as any,
        ondeVivera: "" as any,
        morreuAnimalRecente: "" as any,
        condicoesFinanceirasVet: "" as any,
        verOutrosSeNaoSelecionado: "" as any,
      },
    },
    mode: "onSubmit",
  });

  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("adote_sent") === "1") {
      sessionStorage.removeItem("adote_sent");
      setOk(true);
      setTimeout(() => setOk(false), 6000);
    }
  }, []);

  useEffect(() => {
    if (defaultAnimalId) setValue("animalId", defaultAnimalId);
  }, [defaultAnimalId, setValue]);

  const cepDigits = watch("cep");
  useEffect(() => {
    const d = onlyDigits(cepDigits || "");
    if (d.length !== 8) return;
    cepPromise(d)
      .then((data) => {
        setValue("endereco", `${data.street}`.trim(), { shouldValidate: true });
        setValue("bairro", `${data.neighborhood}`.trim(), { shouldValidate: true });
        setValue("cidade", `${data.city}`.trim(), { shouldValidate: true });
        setValue("uf", `${data.state}`.toUpperCase(), { shouldValidate: true });
      })
      .catch(() => {
      });
  }, [cepDigits, setValue]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, telefone: data.telefone }),
    });
    setLoading(false);
    if (res.ok) {
      toast("Solicitação enviada com sucesso!", { variant: "success", size: "lg", duration: 6000 });
      sessionStorage.setItem("adote_sent", "1");
      window.location.reload();
    } else {
      toast("Erro ao enviar. Tente novamente.", { variant: "error", size: "lg", duration: 6500 });
    }
  };

  const onInvalid = () => {
    const msgs: string[] = [];
    const collect = (obj: any) => {
      Object.values(obj || {}).forEach((v: any) => {
        if (!v) return;
        if (typeof v === "object") {
          if (v.message) msgs.push(v.message as string);
          collect(v);
        }
      });
    };
    collect(errors);
    toast(
      msgs.length
        ? "Preencha: " + msgs.slice(0, 5).join(" • ") + (msgs.length > 5 ? "…" : "")
        : "Confira os campos obrigatórios.",
      { variant: "error", size: "lg", duration: 6500 }
    );
  };

  const telReg = register("telefone");
  const telMasked = watch("telefone") || "";

  const trabalhaFora = watch("perfil.trabalhaFora");
  const possuiOutros = watch("perfil.possuiOutrosAnimais");

  return (
    <>
      {ok ? (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-xl mb-6">
          Solicitação enviada com sucesso! Em breve entraremos em contato.
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="grid md:grid-cols-2 gap-4 bg-white p-6 rounded-2xl shadow-card"
      >
        <Select label="Animal" error={errors.animalId?.message} {...register("animalId")}>
          <option value="">Selecione</option>
          {animals.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nome}
            </option>
          ))}
        </Select>

        <Input
          label="Seu nome"
          placeholder="Maria Silva"
          error={errors.nome?.message}
          {...register("nome")}
        />

        <Input
          label="E-mail"
          type="email"
          placeholder="nome@gmail.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <div>
          <Input
            label="Telefone"
            placeholder="+55 71 99999-9999"
            inputMode="numeric"
            autoComplete="tel"
            error={errors.telefone?.message}
            name={telReg.name}
            ref={telReg.ref}
            value={telMasked ?? ""}
            onChange={(e) => {
              const masked = formatBRPhone(e.target.value);
              setValue("telefone", masked, { shouldValidate: true });
              if (typeof telReg.onChange === "function") (telReg.onChange as any)(e);
            }}
          />
          <p className="mt-1 text-xs text-neutral-500">Precisa ser WhatsApp para contato.</p>
        </div>

        <Input
          label="CEP"
          placeholder="00000-000"
          inputMode="numeric"
          error={errors.cep?.message}
          {...register("cep")}
        />
        <Input
          label="Endereço"
          placeholder="Rua / Av."
          error={errors.endereco?.message}
          {...register("endereco")}
        />

        <Input
          label="Número"
          placeholder="123"
          error={errors.numero?.message}
          {...register("numero")}
        />
        <Input
          label="Bairro"
          placeholder="Bairro"
          error={errors.bairro?.message}
          {...register("bairro")}
        />

        <Input
          label="Cidade"
          placeholder="Cidade"
          error={errors.cidade?.message}
          {...register("cidade")}
        />
        <Input
          label="UF"
          placeholder="SP"
          maxLength={2}
          error={errors.uf?.message}
          {...register("uf")}
        />

        <div className="md:col-span-2 mt-2">
          <div className="mb-2 font-semibold text-neutral-800">Seu perfil</div>

          <div className="grid md:grid-cols-2 gap-3">
            <Select label="Você trabalha fora?" {...register("perfil.trabalhaFora")}>
              <option value="">Selecione</option>
              <option value="SIM">Sim</option>
              <option value="NAO">Não</option>
            </Select>

            {trabalhaFora === "SIM" && (
              <Select label="Tempo fora de casa" {...register("perfil.tempoAusente")}>
                <option value="">Selecione</option>
                <option value="ATE_4H">Até 4h/dia</option>
                <option value="H4_8">4–8h/dia</option>
                <option value="H8_12">8–12h/dia</option>
                <option value="12H_PLUS">+12h/dia</option>
              </Select>
            )}

            <Input
              label="Trabalha em qual ramo?"
              placeholder="Ex.: Educação, Saúde, Tecnologia..."
              {...register("perfil.ramoTrabalho")}
            />

            <Select
              label="Fica alguém em casa durante o dia?"
              {...register("perfil.alguemEmCasaDia")}
            >
              <option value="">Selecione</option>
              <option value="SIM">Sim</option>
              <option value="NAO">Não</option>
            </Select>

            <Input
              type="number"
              label="Quantas pessoas moram na residência?"
              {...register("perfil.moradoresQtd", { valueAsNumber: true })}
            />

            <Select label="Há crianças na casa?" {...register("perfil.haCriancas")}>
              <option value="">Selecione</option>
              <option value="SIM">Sim</option>
              <option value="NAO">Não</option>
            </Select>

            <Input
              type="number"
              label="Idade do responsável"
              {...register("perfil.idadeResponsavel", { valueAsNumber: true })}
            />

            <Input
              label="Facebook / Instagram"
              placeholder="@usuario ou link"
              {...register("perfil.redesSociais")}
            />

            <Select label="Tipo de moradia" {...register("perfil.moradiaTipo")}>
              <option value="">Selecione</option>
              <option value="CASA">Casa</option>
              <option value="APTO">Apartamento</option>
            </Select>

            <Select label="Sua casa é bem fechada?" {...register("perfil.casaBemFechada")}>
              <option value="">Selecione</option>
              <option value="SIM">Sim</option>
              <option value="NAO">Não</option>
            </Select>

            <Select label="O imóvel é" {...register("perfil.imovelTipo")}>
              <option value="">Selecione</option>
              <option value="PROPRIO">Próprio</option>
              <option value="ALUGADO">Alugado</option>
            </Select>

            <Select label="Possui outros animais?" {...register("perfil.possuiOutrosAnimais")}>
              <option value="">Selecione</option>
              <option value="SIM">Sim</option>
              <option value="NAO">Não</option>
            </Select>

            {possuiOutros === "SIM" && (
              <>
                <Input
                  type="number"
                  label="Quantos cães?"
                  {...register("perfil.qtdCaes", { valueAsNumber: true })}
                />
                <Input
                  type="number"
                  label="Quantos gatos?"
                  {...register("perfil.qtdGatos", { valueAsNumber: true })}
                />
                <Select label="São castrados?" {...register("perfil.castrados")}>
                  <option value="">Selecione</option>
                  <option value="SIM">Sim</option>
                  <option value="NAO">Não</option>
                </Select>
              </>
            )}

            <Select
              label="Sabe da importância da castração?"
              {...register("perfil.sabeImportanciaCastracao")}
            >
              <option value="">Selecione</option>
              <option value="SIM">Sim</option>
              <option value="NAO">Não</option>
            </Select>

            <Select label="Onde viverá o animal?" {...register("perfil.ondeVivera")}>
              <option value="">Selecione</option>
              <option value="DENTRO">Dentro de casa</option>
              <option value="QUINTAL">Quintal</option>
              <option value="MISTO">Dentro e fora</option>
            </Select>

            <Select
              label="Morreu algum animal recentemente?"
              {...register("perfil.morreuAnimalRecente")}
            >
              <option value="">Selecione</option>
              <option value="SIM">Sim</option>
              <option value="NAO">Não</option>
            </Select>

            <Select
              label="Condições financeiras para veterinário?"
              {...register("perfil.condicoesFinanceirasVet")}
            >
              <option value="">Selecione</option>
              <option value="SIM">Sim</option>
              <option value="NAO">Não</option>
            </Select>

            <Select
              label="Gostaria de ver outros animais, caso não seja selecionado?"
              {...register("perfil.verOutrosSeNaoSelecionado")}
            >
              <option value="">Selecione</option>
              <option value="SIM">Sim</option>
              <option value="NAO">Não</option>
            </Select>
          </div>
        </div>

        <div className="md:col-span-2">
          <Textarea
            label="Mensagem"
            rows={5}
            placeholder="Conte sobre seu lar e rotina..."
            error={errors.mensagem?.message}
            {...register("mensagem")}
          />
        </div>

        <div className="md:col-span-2 flex gap-3">
          <Button type="submit" loading={loading}>
            Enviar interesse
          </Button>
        </div>
      </form>
    </>
  );
}
