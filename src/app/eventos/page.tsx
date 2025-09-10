import Container from "@/components/Container";
import type { Metadata } from "next";
import EventsClient from "./EventsClient";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Eventos — Instituto Beth Leite",
  description: "Feiras de adoção e ações do instituto.",
};

export const revalidate = 60;

type EventForClient = {
  id: string;
  titulo: string;
  data: string; // YYYY-MM-DD (local)
  hora?: string;
  local: string;
  endereco?: string;
  cidade?: string;
  tipo: "Feira de Adoção" | "Mutirão" | "Bazar" | "Campanha";
  link?: string;
  img?: string;
  destaque?: boolean;
};

// Converte Date UTC para string YYYY-MM-DD em fuso local
function toLocalYYYYMMDD(d: Date) {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export default async function EventosPage() {
  const rows = await prisma.event.findMany({
    where: { published: true },
    orderBy: { startsAt: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      startsAt: true,
      endsAt: true,
      location: true,
      city: true,
      coverUrl: true,
    },
  });

  const horaPt = (d: Date) =>
    new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Sao_Paulo",
    }).format(d);

  const initialEvents: EventForClient[] = rows.map((r) => ({
    id: r.id,
    titulo: r.title,
    data: toLocalYYYYMMDD(r.startsAt), // ✅ dia correto
    hora: horaPt(r.startsAt), // ✅ hora no fuso certo
    local: r.location ?? "",
    cidade: r.city ?? undefined,
    tipo: "Feira de Adoção",
    link: r.slug ? `/eventos/${r.slug}` : undefined,
    img: r.coverUrl ?? undefined,
    destaque: false,
  }));

  return (
    <>
      <section
        className="
          relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]
          -mt-[var(--header-h)] pt-[calc(var(--header-h)+10px)]
          bg-gradient-to-b from-[#ff85fb] via-[#f1cfff] to-[#faf6fc]
          overflow-hidden
        "
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12] md:opacity-[0.14] mix-blend-multiply"
          style={{
            backgroundImage: "url('/patinhas.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "clamp(260px, 60vmin, 720px) auto",
            backgroundPosition: "right -12px top -20px",
          }}
        />
        <Container>
          <div className="py-10 sm:py-14 md:py-16">
            <span className="inline-flex items-center gap-2 text-sm rounded-full px-3 py-1 bg-white/70 ring-1 ring-teal-200/70 text-teal-900">
              🐾 agenda do instituto
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900">
              Eventos
            </h1>
            <p className="mt-2 max-w-2xl text-neutral-700">
              Feiras de adoção, mutirões, bazares e campanhas. Venha nos visitar, adotar, apadrinhar
              ou doar — sua presença transforma vidas!
            </p>
          </div>
        </Container>
        <svg
          className="block w-full h-[32px] sm:h-[44px] text-white"
          viewBox="0 0 1440 64"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32 C240,64 480,0 720,16 C960,32 1200,80 1440,32 L1440,64 L0,64 Z"
            fill="currentColor"
          />
        </svg>
      </section>

      <Container>
        <EventsClient initialEvents={initialEvents} />

        <div className="mt-12 md:mt-16 grid sm:grid-cols-2 gap-4">
          <a
            href="/como-ajudar"
            className="rounded-2xl bg-white ring-1 ring-teal-100 p-5 shadow-sm hover:shadow-md transition"
          >
            <h3 className="font-semibold text-lg">Quero ser voluntário</h3>
            <p className="text-neutral-700 mt-1">
              Ajude em feiras, transporte, lar temporário e comunicação.
            </p>
          </a>
          <a
            href="/contato"
            className="rounded-2xl bg-white ring-1 ring-teal-100 p-5 shadow-sm hover:shadow-md transition"
          >
            <h3 className="font-semibold text-lg">Quero levar a feira ao meu espaço</h3>
            <p className="text-neutral-700 mt-1">
              Tem uma loja, praça ou empresa? Fale com a gente para receber a feira.
            </p>
          </a>
        </div>
      </Container>
    </>
  );
}
