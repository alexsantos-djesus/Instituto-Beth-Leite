// src/app/eventos/[slug]/page.tsx
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import { prisma } from "@/lib/prisma";
import { CalendarDays, Clock, MapPin, ArrowLeft } from "lucide-react";

export const revalidate = 60;

type PageParams = { params: { slug: string } };

// Normaliza o slug vindo da URL (remove acentos, espaços, múltiplos hífens, etc.)
function normalizeSlug(raw: string) {
  const dec = decodeURIComponent(raw || "");
  return dec
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos (sem \p{...} e sem flag u)
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function generateMetadata({ params }: PageParams) {
  const slug = normalizeSlug(params.slug);

  const ev = await prisma.event.findUnique({
    where: { slug },
    select: { title: true, excerpt: true },
  });

  if (!ev) {
    return { title: "Evento não encontrado — Instituto Beth Leite" };
  }

  return {
    title: `${ev.title} — Instituto Beth Leite`,
    description: ev.excerpt ?? "Evento do Instituto Beth Leite",
  };
}

export default async function EventoPage({ params }: PageParams) {
  const normalized = normalizeSlug(params.slug);
  if (params.slug !== normalized) {
    // se a URL veio “torta”, redireciona para o slug canônico
    redirect(`/eventos/${normalized}`);
  }

  const ev = await prisma.event.findUnique({
    where: { slug: normalized },
    select: {
      title: true,
      slug: true,
      startsAt: true,
      endsAt: true,
      location: true,
      city: true,
      coverUrl: true,
      excerpt: true,
      content: true,
      published: true,
    },
  });

  if (!ev || ev.published === false) notFound();

  const starts = ev.startsAt ? new Date(ev.startsAt) : null;
  const ends = ev.endsAt ? new Date(ev.endsAt) : null;

  const dataLonga =
    starts && new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(starts);
  const horaCurta =
    starts && new Intl.DateTimeFormat("pt-BR", { timeStyle: "short" }).format(starts);
  const horaFim = ends && new Intl.DateTimeFormat("pt-BR", { timeStyle: "short" }).format(ends);

  return (
    <>
      <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-gradient-to-b from-[#DDF9F3] via-[#CBF2ED] to-[#C7EFE9] border-b border-teal-100">
        <Container>
          <div className="py-10 sm:py-14">
            <Link
              href="/eventos"
              className="inline-flex items-center gap-2 text-teal-800/85 hover:text-teal-900"
            >
              <ArrowLeft size={18} /> Voltar para eventos
            </Link>

            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
              {ev.title}
            </h1>

            <div className="mt-3 flex flex-wrap gap-3 text-neutral-800">
              {dataLonga && (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 ring-1 ring-teal-200 px-3 py-1">
                  <CalendarDays size={16} /> {dataLonga}
                </span>
              )}
              {horaCurta && (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 ring-1 ring-teal-200 px-3 py-1">
                  <Clock size={16} />
                  {horaCurta}
                  {horaFim ? ` – ${horaFim}` : ""}
                </span>
              )}
              {(ev.location || ev.city) && (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 ring-1 ring-teal-200 px-3 py-1">
                  <MapPin size={16} /> {[ev.location, ev.city].filter(Boolean).join(" • ")}
                </span>
              )}
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <div className="grid lg:grid-cols-3 gap-8 my-10">
          <div className="lg:col-span-2 space-y-6">
            {ev.coverUrl && (
              <div className="rounded-2xl overflow-hidden bg-neutral-100 shadow">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={ev.coverUrl}
                    alt={ev.title}
                    fill
                    className="object-cover"
                    // se a imagem for externa (ex.: Cloudinary), lembre de liberar o domínio no next.config.js
                    // unoptimized // <- opcional se quiser evitar o otimizador
                  />
                </div>
              </div>
            )}

            {ev.excerpt && (
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h2 className="font-bold text-lg mb-2">Resumo</h2>
                <p className="text-neutral-700 whitespace-pre-line">{ev.excerpt}</p>
              </div>
            )}

            {ev.content && (
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h2 className="font-bold text-lg mb-2">Sobre o evento</h2>
                <p className="text-neutral-700 whitespace-pre-line">{ev.content}</p>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            {(ev.location || ev.city) && (
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h3 className="font-bold mb-2">Local</h3>
                <p className="text-neutral-800">
                  {[ev.location, ev.city].filter(Boolean).join(" — ")}
                </p>
              </div>
            )}

            <Link
              href="/eventos"
              className="inline-flex w-full justify-center rounded-full px-4 py-2 bg-teal-600 text-white hover:bg-teal-700"
            >
              Ver todos os eventos
            </Link>
          </aside>
        </div>
      </Container>
    </>
  );
}
