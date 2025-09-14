import Container from "@/components/Container";
import Link from "next/link";
import {
  HeartHandshake,
  Target,
  ShieldCheck,
  PawPrint,
  Stethoscope,
  Home,
  Megaphone,
  Users,
  HandHeart,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import PartnersSection from "@/components/PartnersSection";
import { prisma } from "@/lib/prisma";

import { AnimatedHero, FadeIn, Stagger, CardHover } from "@/components/animated";

export const metadata = {
  title: "Sobre o Instituto — Instituto Beth Leite",
  description: "Nossa história, missão e valores.",
};

export default async function SobrePage() {
  const [animalsCount, requestsCount, partnersCount] = await prisma.$transaction([
    prisma.animal.count(),
    prisma.adoptionRequest.count(),
    prisma.partner.count({ where: { active: true } }),
  ]);

  const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(n);

  return (
    <>
      <AnimatedHero
        className="
          relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]
          -mt-[var(--header-h)] pt-[calc(var(--header-h)+18px)]
          bg-gradient-to-b from-[#ffbe78] via-[#ffe1b2] to-[#fff6ea]
          overflow-hidden
        "
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14] md:opacity-[0.16]"
          style={{
            backgroundImage: "url('/patinhas.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "min(80vw, 680px) auto",
            backgroundPosition: "right -20px top -20px",
          }}
        />
        <Container>
          <FadeIn className="py-10 sm:py-14 md:py-18">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 ring-1 ring-cyan-200 px-3 py-1 text-sm text-cyan-900">
              <PawPrint className="h-4 w-4" /> adoção responsável
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900">
              Quem somos
            </h1>
            <p className="mt-3 max-w-3xl text-neutral-700 text-lg">
              O <strong>Instituto Beth Leite</strong> existe para promover a adoção responsável e o
              bem-estar animal. Unimos voluntários, parceiros e a comunidade para transformar
              histórias por meio de <em>resgate, cuidado, acolhimento</em> e muito carinho.
            </p>
          </FadeIn>
        </Container>
        <svg
          className="block w-full h-[28px] text-white"
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
        <Stagger className="mt-8 grid md:grid-cols-3 gap-6">
          <Card title="Missão" icon={<HeartHandshake className="h-5 w-5" />}>
            Promover o bem-estar animal por meio de resgates, reabilitação e
            <br className="hidden sm:block" /> adoção responsável – com transparência e afeto.
          </Card>
          <Card title="Visão" icon={<Target className="h-5 w-5" />}>
            Ser referência regional na defesa animal e em políticas de prevenção,
            <br className="hidden sm:block" /> como castração, educação e redes de acolhimento.
          </Card>
          <Card title="Valores" icon={<ShieldCheck className="h-5 w-5" />}>
            Cuidado, responsabilidade, respeito, transparência e trabalho em rede.
          </Card>
        </Stagger>

        <section className="mt-10">
          <h2 className="text-xl sm:text-2xl font-extrabold">O que fazemos</h2>
          <Stagger className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Feature
              icon={<Stethoscope className="h-5 w-5" />}
              title="Resgate & cuidados veterinários"
              desc="Atendimento clínico, vacinação, castração e reabilitação até o lar definitivo."
            />
            <Feature
              icon={<Home className="h-5 w-5" />}
              title="Lar temporário & acolhimento"
              desc="Famílias e voluntários oferecem abrigo seguro enquanto preparamos a adoção."
            />
            <Feature
              icon={<HandHeart className="h-5 w-5" />}
              title="Adoção responsável"
              desc="Triagem, orientação e acompanhamento pós-adoção para garantir bem-estar."
            />
            <Feature
              icon={<Users className="h-5 w-5" />}
              title="Apadrinhamento"
              desc="Padrinhos ajudam custos mensais e recebem atualizações dos afilhados."
            />
            <Feature
              icon={<Megaphone className="h-5 w-5" />}
              title="Educação & mobilização"
              desc="Campanhas, oficinas e apoio a políticas públicas de proteção animal."
            />
            <Feature
              icon={<CalendarDays className="h-5 w-5" />}
              title="Feiras & ações"
              desc="Eventos de adoção, mutirões de castração e parcerias com a comunidade."
            />
          </Stagger>
        </section>

        <section className="mt-10">
          <h2 className="text-xl sm:text-2xl font-extrabold">Nosso impacto</h2>
          <p className="mt-2 text-neutral-700">
            Indicadores calculados automaticamente a partir do banco de dados.
          </p>
          <Stagger className="mt-6 grid sm:grid-cols-3 gap-4">
            <Stat number={fmt(animalsCount)} label="Animais cadastrados" />
            <Stat number={fmt(requestsCount)} label="Solicitações de adoção" />
            <Stat number={fmt(partnersCount)} label="Parceiros ativos" />
          </Stagger>
          <FadeIn className="mt-2">
            <p className="text-sm text-neutral-500">
              * Em breve traremos outros indicadores (ex.: adoções concluídas).
            </p>
          </FadeIn>
        </section>

        <PartnersSection
          id="parceiros"
          title="Parceiros & apoiadores"
          showMax={undefined}
          ctaHref="/como-ajudar#parcerias"
          ctaLabel="Seja parceiro"
        />

        <section className="mt-12 grid md:grid-cols-3 gap-6">
          <LinkCard
            href="/como-ajudar"
            title="Como ajudar"
            desc="Doação, apadrinhamento, voluntariado e pontos de coleta."
          />
          <LinkCard
            href="/padrinhos"
            title="Padrinhos"
            desc="Homenagem, relatos de impacto e prestação de contas."
          />
          <LinkCard
            href="/eventos"
            title="Eventos"
            desc="Feiras de adoção, mutirões e ações com a comunidade."
          />
        </section>

        <FadeIn className="mt-12 mb-16">
          <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-cyan-200/50">
            <p className="text-neutral-700">
              Cada vida salva é resultado de uma rede: tutores responsáveis, voluntários, parceiros,
              profissionais de saúde e doadores. Obrigado por caminhar com a gente. 🐾
            </p>
          </div>
        </FadeIn>
      </Container>
    </>
  );
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <FadeIn className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-cyan-200/60 hover:shadow-lg transition">
      <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 ring-1 ring-cyan-200 px-2.5 py-1 text-cyan-900 text-sm">
        {icon}
        <span className="font-semibold">{title}</span>
      </div>
      <p className="mt-3 text-neutral-700">{children}</p>
    </FadeIn>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <FadeIn className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-cyan-200/60 hover:shadow-lg transition">
      <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 ring-1 ring-cyan-200 px-2.5 py-1 text-cyan-900 text-sm">
        {icon}
        <span className="font-semibold">{title}</span>
      </div>
      <p className="mt-2 text-neutral-700">{desc}</p>
    </FadeIn>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <FadeIn className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-cyan-200/60 text-center">
      <div className="text-3xl sm:text-4xl font-extrabold text-neutral-900">{number}</div>
      <div className="mt-1 text-neutral-600">{label}</div>
    </FadeIn>
  );
}

function LinkCard({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="block">
      <CardHover className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-cyan-200/60">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="mt-1 text-neutral-700">{desc}</p>
          </div>
          <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-600 text-white">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </CardHover>
    </Link>
  );
}
