import Link from "next/link";
import Container from "@/components/Container";
import { Great_Vibes } from "next/font/google";
import {
  HeartHandshake,
  Coins,
  Gift,
  ShieldCheck,
  Users,
  Star,
  ArrowRight,
  QrCode,
  Trophy,
  CheckCircle2,
  Calendar,
} from "lucide-react";

import {
  AnimatedHero,
  KpiAnimated,
  ProgressAnimated,
  GridStagger,
  PlanoCardAnimated,
  CardHover,
  FaqAnimated,
} from "@/components/animated";

export const metadata = {
  title: "Padrinhos — Instituto Beth Leite",
  description: "Homenagem e transparência com quem apoia a causa.",
};

const script = Great_Vibes({ subsets: ["latin"], weight: "400" });

const PADRINHOS = [
  { nome: "Ana Souza", cidade: "Belo Horizonte", plano: "Ouro" },
  { nome: "Carlos Lima", cidade: "São Paulo", plano: "Prata" },
  { nome: "Marina Alves", cidade: "Brasília", plano: "Bronze" },
  { nome: "Rafa Santos", cidade: "Fortaleza", plano: "Prata" },
  { nome: "Bianca Rocha", cidade: "Curitiba", plano: "Ouro" },
  { nome: "Gustavo Prado", cidade: "Rio de Janeiro", plano: "Bronze" },
];

export default function PadrinhosPage() {
  const metaMensal = 6000;
  const arrecadado = 4380;
  const progresso = Math.min(100, Math.round((arrecadado / metaMensal) * 100));
  const ativos = 124;
  const animaisApoiados = 89;

  return (
    <>
      <AnimatedHero
        className="
          relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]
          -mt-[var(--header-h)] pt-[calc(var(--header-h)+10px)]
          bg-gradient-to-b from-[#ff8c86] via-[#ffd9d8] to-[#fff2f2]
          overflow-hidden
        "
      >
        <div className="container max-w-6xl py-10 sm:py-12">
          <div className="flex flex-col items-start gap-5 sm:gap-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/80 px-3 py-1 text-sm shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              transparência & carinho
            </span>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900">
              Padrinhos{" "}
              <span className={`${script.className} block text-4xl sm:text-6xl leading-none`}>
                que mudam destinos 💛
              </span>
            </h1>

            <p className="max-w-2xl text-neutral-700">
              Com uma contribuição mensal você ajuda a manter cuidados, ração, remédios e muito amor
              para nossos resgatados. Veja como participar e acompanhe tudo com transparência.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/como-ajudar#apadrinhamento"
                className="inline-flex items-center gap-2 rounded-pill bg-brand-secondary px-5 py-2.5 text-white hover:bg-brand-secondaryHover"
              >
                <HeartHandshake className="h-5 w-5" />
                Quero apadrinhar
              </Link>
              <Link
                href="/como-ajudar"
                className="inline-flex items-center gap-2 rounded-pill bg-white/90 px-5 py-2.5 text-neutral-900 border border-black/5 hover:bg-white"
              >
                <ArrowRight className="h-5 w-5" />
                Ver outras formas de ajudar
              </Link>
            </div>
          </div>
        </div>

        <svg
          className="block w-full h-[28px] sm:h-[40px] text-white"
          viewBox="0 0 1440 64"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32 C240,64 480,0 720,16 C960,32 1200,80 1440,32 L1440,64 L0,64 Z"
            fill="currentColor"
          />
        </svg>
      </AnimatedHero>

      <Container>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <KpiAnimated
            icon={<Users className="h-5 w-5" />}
            label="Padrinhos ativos"
            value={ativos}
          />
          <KpiAnimated
            icon={<Trophy className="h-5 w-5" />}
            label="Animais apoiados"
            value={animaisApoiados}
          />

          <div className="bg-white rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <Coins className="h-5 w-5" />
                Meta mensal
              </div>
              <div className="text-sm text-neutral-600">
                R$ {arrecadado.toLocaleString("pt-BR")} / R$ {metaMensal.toLocaleString("pt-BR")}
              </div>
            </div>

            <ProgressAnimated percent={progresso} />
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-extrabold mb-3">Planos de apadrinhamento</h2>
          <p className="text-neutral-700 mb-5">
            Escolha o valor que cabe no seu orçamento. Você pode cancelar quando quiser.
          </p>

          <GridStagger>
            <PlanoCardAnimated>
              <Plano
                destaque={false}
                nome="Bronze"
                valor={30}
                perks={[
                  "Atualizações periódicas",
                  "Certificado de padrinho",
                  "Entrada no grupo de novidades",
                ]}
              />
            </PlanoCardAnimated>

            <PlanoCardAnimated featured>
              <Plano
                destaque
                nome="Prata"
                valor={60}
                perks={[
                  "Tudo do Bronze",
                  "Relatos mensais com fotos",
                  "Prioridade em visitas e eventos",
                ]}
              />
            </PlanoCardAnimated>

            <PlanoCardAnimated>
              <Plano
                destaque={false}
                nome="Ouro"
                valor={120}
                perks={[
                  "Tudo do Prata",
                  "Cartinha trimestral do seu afilhado",
                  "Agradecimento no mural",
                ]}
              />
            </PlanoCardAnimated>
          </GridStagger>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-extrabold mb-3">Como funciona</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <Passo
              icon={<HeartHandshake className="h-5 w-5" />}
              title="Escolha ajudar"
              text="Defina um plano e confirme seu apoio recorrente."
            />
            <Passo
              icon={<Gift className="h-5 w-5" />}
              title="Atribuímos o apoio"
              text="Direcionamos sua ajuda aos custos de um ou mais animais."
            />
            <Passo
              icon={<Calendar className="h-5 w-5" />}
              title="Acompanhe"
              text="Envio de atualizações com fotos e notícias."
            />
            <Passo
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Transparência"
              text="Prestação de contas pública e metas mensais."
            />
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-extrabold">Mural de Padrinhos</h2>
            <span className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white px-3 py-1 text-sm">
              <Star className="h-4 w-4 text-yellow-500" />
              Obrigado, vocês são incríveis!
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PADRINHOS.map((p, i) => (
              <CardHover key={i}>
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-secondary/10 to-brand-secondary/30 text-brand-secondary font-bold ring-1 ring-black/5">
                  {p.nome
                    .split(" ")
                    .slice(0, 2)
                    .map((s) => s[0])
                    .join("")}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{p.nome}</div>
                  <div className="text-sm text-neutral-600 truncate">
                    {p.cidade} • Plano {p.plano}
                  </div>
                </div>
                <CheckCircle2 className="ml-auto h-5 w-5 text-emerald-600" aria-label="ativo" />
              </CardHover>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-extrabold mb-3">Dúvidas frequentes</h2>
          <div className="space-y-3">
            <FaqAnimated
              q="Posso cancelar quando quiser?"
              a="Sim. O apadrinhamento é 100% voluntário e pode ser cancelado a qualquer momento."
            />
            <FaqAnimated
              q="Para onde vai a minha contribuição?"
              a="Cobre ração, vermífugos, vacinas, castrações, consultas veterinárias e manutenção dos lares temporários."
            />
            <FaqAnimated
              q="Receberei notícias do meu afilhado?"
              a="Sim! Enviamos relatos periódicos (texto, fotos e, quando possível, vídeos)."
            />
            <FaqAnimated
              q="Posso doar via Pix?"
              a="Pode sim. Na página “Como Ajudar” você encontra a chave Pix e instruções para recorrência."
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/como-ajudar#apadrinhamento"
              className="inline-flex items-center gap-2 rounded-pill bg-brand-secondary px-5 py-2.5 text-white hover:bg-brand-secondaryHover"
            >
              <HeartHandshake className="h-5 w-5" />
              Apadrinhar agora
            </Link>
            <Link
              href="/como-ajudar"
              className="inline-flex items-center gap-2 rounded-pill bg-white px-5 py-2.5 text-neutral-900 border border-black/5 hover:bg-neutral-50"
            >
              <QrCode className="h-5 w-5" />
              Ver Pix e outras formas
            </Link>
          </div>
        </section>

        <p className="mt-10 text-sm text-neutral-500">
          Prestação de contas atualizada mensalmente. Em caso de dúvidas, fale com a gente:{" "}
          <Link href="/contato" className="underline">
            contato
          </Link>
          .
        </p>
      </Container>
    </>
  );
}

function Kpi({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card">
      <div className="flex items-center gap-2 text-neutral-700">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight">{value}</div>
    </div>
  );
}

function Plano({
  nome,
  valor,
  perks,
  destaque,
}: {
  nome: string;
  valor: number;
  perks: string[];
  destaque?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl p-6 shadow-card bg-white border",
        destaque ? "border-brand-secondary/40 ring-1 ring-brand-secondary/20" : "border-black/5",
      ].join(" ")}
    >
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-extrabold">{nome}</h3>
        {destaque ? (
          <span className="text-xs rounded-full bg-brand-secondary/10 text-brand-secondary px-2 py-0.5">
            recomendado
          </span>
        ) : null}
      </div>

      <div className="mt-2 text-3xl font-extrabold">
        R$ {valor}
        <span className="text-sm font-semibold text-neutral-600">/mês</span>
      </div>

      <ul className="mt-4 space-y-2 text-sm text-neutral-700">
        {perks.map((p, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
            {p}
          </li>
        ))}
      </ul>

      <Link
        href="/como-ajudar#apadrinhamento"
        className={[
          "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-pill px-4 py-2",
          destaque
            ? "bg-brand-secondary text-white hover:bg-brand-secondaryHover"
            : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
        ].join(" ")}
      >
        <HeartHandshake className="h-4 w-4" />
        Apadrinhar
      </Link>
    </div>
  );
}

function Passo({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card border border-black/5">
      <div className="flex items-center gap-2 font-semibold">
        {icon}
        {title}
      </div>
      <p className="mt-2 text-sm text-neutral-700">{text}</p>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group bg-white rounded-2xl p-5 shadow-card border border-black/5">
      <summary className="cursor-pointer list-none font-semibold flex items-center justify-between">
        {q}
        <ArrowRight className="h-4 w-4 transition-transform group-open:rotate-90" />
      </summary>
      <p className="mt-2 text-neutral-700">{a}</p>
    </details>
  );
}
