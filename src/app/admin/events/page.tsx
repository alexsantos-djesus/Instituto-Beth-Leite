"use client";
import { useEffect, useState } from "react";
import Container from "@/components/Container";

type EventI = {
  id: string;
  title: string;
  slug: string;
  startsAt: string;
  endsAt?: string | null;
  location?: string | null;
  city?: string | null;
  coverUrl?: string | null;
  published: boolean;
};

export default function EventsAdmin() {
  const [items, setItems] = useState<EventI[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/events");
    const j = await r.json();
    setItems(j || []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function togglePub(e: EventI) {
    await fetch(`/api/admin/events/${e.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !e.published }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir evento?")) return;
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <Container className="pt-3">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-extrabold">Eventos</h1>
        <a
          href="/admin/events/new"
          className="rounded-full bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700"
        >
          Novo evento
        </a>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-neutral-200/60">
        {loading ? <p>Carregando…</p> : null}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((e) => (
            <div key={e.id} className="rounded-xl ring-1 ring-neutral-200/60 p-3">
              {e.coverUrl ? (
                <img src={e.coverUrl} alt="" className="h-28 w-full object-cover rounded-lg" />
              ) : (
                <div className="h-28 bg-neutral-100 rounded-lg" />
              )}
              <div className="mt-2 font-semibold">{e.title}</div>
              <div className="text-xs text-neutral-600">
                {new Date(e.startsAt).toLocaleString()}
              </div>
              <div className="mt-2 flex justify-center gap-2">
                <a
                  href={`/admin/events/${e.id}`}
                  className="rounded-full px-3 py-1 ring-1 ring-neutral-300 text-sm"
                >
                  Editar
                </a>
                <button
                  onClick={() => togglePub(e)}
                  className={`rounded-full px-3 py-1 text-sm ${
                    e.published ? "bg-neutral-900 text-white" : "ring-1 ring-neutral-300"
                  }`}
                >
                  {e.published ? "Publicado" : "Rascunho"}
                </button>
                <button
                  onClick={() => remove(e.id)}
                  className="rounded-full px-3 py-1 text-sm ring-1 ring-rose-300 text-rose-700"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
        {items.length === 0 && !loading ? <p>Nenhum evento cadastrado.</p> : null}
      </div>
    </Container>
  );
}
