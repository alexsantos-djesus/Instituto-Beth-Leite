"use client";
import { useEffect, useState } from "react";
import Container from "@/components/Container";

type Partner = {
  id: string;
  name: string;
  url?: string | null;
  logoUrl: string;
  active: boolean;
  order: number;
};

export default function PartnersAdmin() {
  const [items, setItems] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/partners");
    const j = await r.json();
    setItems(j || []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function toggleActive(p: Partner) {
    await fetch(`/api/admin/partners/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !p.active }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir parceiro?")) return;
    await fetch(`/api/admin/partners/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <Container className="pt-3">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-extrabold">Parceiros</h1>
        <a
          href="/admin/partners/new"
          className="rounded-full bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700"
        >
          Novo parceiro
        </a>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-neutral-200/60">
        {loading ? <p>Carregando…</p> : null}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <div key={p.id} className="rounded-xl ring-1 ring-neutral-200/60 p-3">
              <img src={p.logoUrl} alt={p.name} className="h-16 object-contain mx-auto" />
              <div className="mt-2 font-semibold text-center">{p.name}</div>
              <div className="mt-1 text-xs text-center text-neutral-600">{p.url || "—"}</div>
              <div className="mt-3 flex justify-center gap-2">
                <a
                  href={`/admin/partners/${p.id}`}
                  className="rounded-full px-3 py-1 ring-1 ring-neutral-300 text-sm"
                >
                  Editar
                </a>
                <button
                  onClick={() => toggleActive(p)}
                  className={`rounded-full px-3 py-1 text-sm ${
                    p.active ? "bg-neutral-900 text-white" : "ring-1 ring-neutral-300"
                  }`}
                >
                  {p.active ? "Ativo" : "Inativo"}
                </button>
                <button
                  onClick={() => remove(p.id)}
                  className="rounded-full px-3 py-1 text-sm ring-1 ring-rose-300 text-rose-700"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
        {items.length === 0 && !loading ? <p>Nenhum parceiro cadastrado.</p> : null}
      </div>
    </Container>
  );
}
