"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

/* -------- tipos -------- */
type Event = {
  id: string;
  titulo: string;
  data: string; // YYYY-MM-DD local (ou ISO completo)
  hora?: string;
  local: string;
  endereco?: string;
  cidade?: string;
  tipo: "Feira de Adoção" | "Mutirão" | "Bazar" | "Campanha";
  link?: string;
  img?: string;
  destaque?: boolean;
};

/* -------- helpers robustos -------- */
function parseISO(iso?: string | null): Date | null {
  if (!iso) return null;

  // Se vier no formato YYYY-MM-DD, criamos a data em fuso LOCAL (sem UTC)
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (m) {
    const [, y, mo, d] = m;
    return new Date(Number(y), Number(mo) - 1, Number(d)); // local midnight
  }

  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

function isPast(iso: string) {
  const d = parseISO(iso);
  if (!d) return false;
  const endOfDay = new Date(d);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay.getTime() < Date.now();
}

function fmtData(iso: string) {
  const d = parseISO(iso);
  if (!d) return "";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(d);
}

/* -------- UI -------- */
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 text-teal-900 ring-1 ring-teal-200 px-2.5 py-0.5 text-xs">
      {children}
    </span>
  );
}

function EventCard({ e }: { e: Event }) {
  const passado = isPast(e.data);
  const dataFormatada = fmtData(e.data);

  return (
    <article className="group rounded-2xl bg-white ring-1 ring-teal-100 overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="relative aspect-[16/9] bg-neutral-100">
        {e.img ? <Image src={e.img} alt={e.titulo} fill className="object-cover" /> : null}
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge>{e.tipo}</Badge>
          {e.destaque ? <Badge>🎉 destaque</Badge> : null}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg leading-snug">{e.titulo}</h3>

        {dataFormatada ? (
          <p className="mt-1 text-sm text-neutral-700">
            <strong className="text-neutral-900">{dataFormatada}</strong>
            {e.hora ? ` • ${e.hora}` : ""}
            {e.local ? ` • ${e.local}` : ""}
            {e.cidade ? ` — ${e.cidade}` : ""}
          </p>
        ) : (
          <p className="mt-1 text-sm text-neutral-500">Data a definir</p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              passado
                ? "bg-neutral-100 text-neutral-600"
                : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
            }`}
          >
            {passado ? "Encerrado" : "Em breve"}
          </span>
          {e.link ? (
            <Link
              href={e.link}
              className="text-sm font-medium text-teal-700 hover:text-teal-900 underline underline-offset-4"
            >
              Ver detalhes
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function groupAndSort(evts: Event[]) {
  const proximos = evts
    .filter((e) => !isPast(e.data))
    .sort((a, b) => {
      const da = parseISO(a.data)?.getTime() ?? 0;
      const db = parseISO(b.data)?.getTime() ?? 0;
      return da - db;
    });

  const passados = evts
    .filter((e) => isPast(e.data))
    .sort((a, b) => {
      const da = parseISO(a.data)?.getTime() ?? 0;
      const db = parseISO(b.data)?.getTime() ?? 0;
      return db - da;
    });

  return { proximos, passados };
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-full text-center py-10 rounded-2xl bg-white ring-1 ring-teal-100">
      <p className="text-neutral-700">{children}</p>
    </div>
  );
}

export default function EventsClient({ initialEvents }: { initialEvents: Event[] }) {
  const [tab, setTab] = useState<"proximos" | "passados" | "todos">("proximos");
  const groups = useMemo(() => groupAndSort(initialEvents), [initialEvents]);
  const list =
    tab === "proximos"
      ? groups.proximos
      : tab === "passados"
      ? groups.passados
      : [...groups.proximos, ...groups.passados];

  return (
    <section className="mt-4">
      <div className="inline-flex rounded-xl bg-white ring-1 ring-teal-100 p-1 shadow-sm">
        {(["proximos", "passados", "todos"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === t ? "bg-teal-600 text-white shadow-sm" : "text-neutral-700 hover:bg-teal-50"
            }`}
          >
            {t === "proximos" ? "Próximos" : t === "passados" ? "Passados" : "Todos"}
          </button>
        ))}
      </div>

      <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.length === 0 ? (
          <Empty>Nenhum evento nesta aba por enquanto. 🐾</Empty>
        ) : (
          list.map((e) => <EventCard key={e.id} e={e} />)
        )}
      </div>
    </section>
  );
}
