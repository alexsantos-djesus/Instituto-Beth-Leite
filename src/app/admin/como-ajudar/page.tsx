"use client";
import { useEffect, useState } from "react";
import Container from "@/components/Container";

type DonationSettings = {
  id: string;
  pixKey?: string | null;
  pixKeyType?: "CPF" | "CNPJ" | "EMAIL" | "TELEFONE" | "ALEATORIA" | null;
  bankName?: string | null;
  bankAgency?: string | null;
  bankAccount?: string | null;
  bankHolder?: string | null;
  recurringLink?: string | null;
  itemsWanted?: string | null;
  collectionPoints?: CollectionPoint[];
};
type CollectionPoint = {
  id: string;
  name: string;
  address: string;
  hours?: string | null;
  phone?: string | null;
  active: boolean;
  order: number;
};

export default function DonationsAdmin() {
  const [data, setData] = useState<DonationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [cpForm, setCpForm] = useState({
    name: "",
    address: "",
    hours: "",
    phone: "",
    active: true,
    order: 0,
  });

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/donations");
    const j = await r.json();
    setData(j);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function saveSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    const r = await fetch("/api/donations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.ok) load();
    else alert("Erro ao salvar");
  }

  async function addPoint(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/admin/collection-points", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cpForm),
    });
    if (r.ok) {
      setCpForm({ name: "", address: "", hours: "", phone: "", active: true, order: 0 });
      load();
    } else alert("Erro ao criar ponto");
  }

  async function updatePoint(p: CollectionPoint, patch: Partial<CollectionPoint>) {
    await fetch(`/api/admin/collection-points/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    load();
  }

  async function removePoint(id: string) {
    if (!confirm("Remover ponto de coleta?")) return;
    await fetch(`/api/admin/collection-points/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <Container className="pt-3">
      <h1 className="text-2xl font-extrabold mb-4">Como Ajudar</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <form
          onSubmit={saveSettings}
          className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-neutral-200/60 space-y-3"
        >
          <h2 className="font-bold mb-1">Configurações (PIX, banco, itens)</h2>
          {loading ? <p>Carregando…</p> : null}
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm">Chave PIX</span>
              <input
                name="pixKey"
                defaultValue={data?.pixKey ?? ""}
                className="w-full border rounded-xl px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm">Tipo da chave</span>
              <select
                name="pixKeyType"
                defaultValue={data?.pixKeyType ?? ""}
                className="w-full border rounded-xl px-3 py-2"
              >
                <option value="">—</option>
                <option value="CPF">CPF</option>
                <option value="CNPJ">CNPJ</option>
                <option value="EMAIL">EMAIL</option>
                <option value="TELEFONE">TELEFONE</option>
                <option value="ALEATORIA">ALEATÓRIA</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm">Banco</span>
              <input
                name="bankName"
                defaultValue={data?.bankName ?? ""}
                className="w-full border rounded-xl px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm">Agência</span>
              <input
                name="bankAgency"
                defaultValue={data?.bankAgency ?? ""}
                className="w-full border rounded-xl px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm">Conta</span>
              <input
                name="bankAccount"
                defaultValue={data?.bankAccount ?? ""}
                className="w-full border rounded-xl px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm">Titular</span>
              <input
                name="bankHolder"
                defaultValue={data?.bankHolder ?? ""}
                className="w-full border rounded-xl px-3 py-2"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="text-sm">Link de doação recorrente</span>
              <input
                name="recurringLink"
                defaultValue={data?.recurringLink ?? ""}
                className="w-full border rounded-xl px-3 py-2"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm">Itens que mais precisamos (um por linha)</span>
            <textarea
              name="itemsWanted"
              defaultValue={data?.itemsWanted ?? ""}
              rows={5}
              className="w-full border rounded-xl px-3 py-2"
            />
          </label>

          <button className="rounded-full bg-neutral-900 text-white px-4 py-2">Salvar</button>
        </form>

        <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-neutral-200/60">
          <h2 className="font-bold mb-2">Pontos de coleta</h2>

          <form onSubmit={addPoint} className="grid sm:grid-cols-2 gap-3 mb-4">
            <input
              placeholder="Nome"
              className="border rounded-xl px-3 py-2"
              value={cpForm.name}
              onChange={(e) => setCpForm({ ...cpForm, name: e.target.value })}
            />
            <input
              placeholder="Endereço"
              className="border rounded-xl px-3 py-2"
              value={cpForm.address}
              onChange={(e) => setCpForm({ ...cpForm, address: e.target.value })}
            />
            <input
              placeholder="Horários (opcional)"
              className="border rounded-xl px-3 py-2"
              value={cpForm.hours}
              onChange={(e) => setCpForm({ ...cpForm, hours: e.target.value })}
            />
            <input
              placeholder="Telefone (opcional)"
              className="border rounded-xl px-3 py-2"
              value={cpForm.phone}
              onChange={(e) => setCpForm({ ...cpForm, phone: e.target.value })}
            />
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={cpForm.active}
                onChange={(e) => setCpForm({ ...cpForm, active: e.target.checked })}
              />{" "}
              Ativo
            </label>
            <input
              type="number"
              placeholder="Ordem"
              className="border rounded-xl px-3 py-2"
              value={cpForm.order}
              onChange={(e) => setCpForm({ ...cpForm, order: Number(e.target.value) })}
            />
            <div className="sm:col-span-2">
              <button className="rounded-full bg-emerald-600 text-white px-4 py-2">
                Adicionar
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {(data?.collectionPoints || []).map((p) => (
              <div key={p.id} className="rounded-xl ring-1 ring-neutral-200/60 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-neutral-600">{p.address}</div>
                    <div className="text-xs text-neutral-600">
                      {[p.hours, p.phone].filter(Boolean).join(" • ") || "—"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updatePoint(p, { active: !p.active })}
                      className={`rounded-full px-3 py-1 text-sm ${
                        p.active ? "bg-neutral-900 text-white" : "ring-1 ring-neutral-300"
                      }`}
                    >
                      {p.active ? "Ativo" : "Inativo"}
                    </button>
                    <button
                      onClick={() => removePoint(p.id)}
                      className="rounded-full px-3 py-1 text-sm ring-1 ring-rose-300 text-rose-700"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {(data?.collectionPoints?.length ?? 0) === 0 ? (
              <p className="text-sm text-neutral-600">Nenhum ponto cadastrado.</p>
            ) : null}
          </div>
        </div>
      </div>
    </Container>
  );
}
