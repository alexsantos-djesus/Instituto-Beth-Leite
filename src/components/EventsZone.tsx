import Link from "next/link";
import { MapPin } from "lucide-react";
import SectionShell from "./SectionShell";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

function dia(d: Date) {
  return String(d.getDate()).padStart(2, "0");
}
function mesAbrev(d: Date) {
  return new Intl.DateTimeFormat("pt-BR", { month: "short" })
    .format(d)
    .replace(".", "")
    .toUpperCase();
}

export default async function EventsZone() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const eventos = await prisma.event.findMany({
    where: { published: true, startsAt: { gte: hoje } },
    orderBy: { startsAt: "asc" },
    take: 4,
    select: {
      id: true,
      title: true,
      slug: true,
      startsAt: true,
      location: true,
      city: true,
    },
  });

  return (
    <SectionShell id="eventos" tone="indigo">
      <div className="flex items-start justify-between">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Agenda de Eventos</h2>
        <Link
          href="/eventos"
          className="hidden sm:inline-flex rounded-full px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Ver calendário
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {eventos.length === 0 ? (
          <div className="col-span-full rounded-2xl bg-white ring-1 ring-indigo-200 p-6 text-center text-neutral-700">
            Em breve divulgaremos os próximos eventos. 🐾
          </div>
        ) : (
          eventos.map((ev) => {
            const d = new Date(ev.startsAt);
            const href = ev.slug ? `/eventos/${ev.slug}` : "/eventos";
            const localTxt = ev.location ?? ev.city ?? "";

            return (
              <Link
                key={ev.id}
                href={href}
                className="rounded-2xl bg-white ring-1 ring-indigo-200 p-4 shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  <div className="grid place-items-center rounded-2xl bg-indigo-600 text-white w-16 h-16 font-bold">
                    <span className="text-[10px] leading-none">{mesAbrev(d)}</span>
                    <span className="text-2xl leading-none">{dia(d)}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold line-clamp-2">{ev.title}</div>
                    <div className="mt-0.5 text-sm text-neutral-600">
                      {new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(d)}
                    </div>
                    {localTxt && (
                      <div className="flex items-center gap-1 text-sm text-neutral-600">
                        <MapPin size={14} /> {localTxt}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <div className="mt-4 sm:hidden">
        <Link
          href="/eventos"
          className="inline-flex w-full justify-center rounded-full px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Ver calendário completo
        </Link>
      </div>
    </SectionShell>
  );
}
