"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";
import CloudinaryUploader from "@/components/CloudinaryUploader";

type Animal = {
  id: number;
  slug: string;
  nome: string;
  especie: "GATO" | "CACHORRO";
  sexo: "MACHO" | "FEMEA";
  porte: "PEQUENO" | "MEDIO" | "GRANDE";
  idadeMeses: number;
  vacinado: boolean;
  castrado: boolean;
  raca?: string | null;
  temperamento?: string | null;
  descricao: string;
  historiaResgate?: string | null;
  convivencia?: string | null;
  saudeDetalhes?: string | null;
  dataResgate?: string | null;
  photos: { id: number; url: string; alt: string; isCover: boolean }[];
};

export default function EditAnimal({ params }: { params: { id: string } }) {
  const id = params.id;
  const [data, setData] = useState<Animal | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await fetch(`/api/admin/animals/${id}`);
      const a = await r.json();
      setData(a);
    })();
  }, [id]);

  const updateField = <K extends keyof Animal>(key: K, value: Animal[K]) =>
    setData((prev) => (prev ? { ...prev, [key]: value } : prev));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);

    const payload = {
      ...data,
      idadeMeses: Number(data.idadeMeses || 0),
      raca: data.raca?.trim() || null,
      temperamento: data.temperamento?.trim() || null,
      historiaResgate: data.historiaResgate?.trim() || null,
      convivencia: data.convivencia?.trim() || null,
      saudeDetalhes: data.saudeDetalhes?.trim() || null,
      dataResgate: data.dataResgate ? new Date(data.dataResgate) : null,
    };

    await fetch(`/api/admin/animals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    alert("Salvo!");
  }

  if (!data) return null;

  const dateVal = data.dataResgate ? new Date(data.dataResgate).toISOString().slice(0, 10) : "";

  return (
    <Container>
      <h1 className="text-2xl font-extrabold mb-4">Editar: {data.nome}</h1>

      <form onSubmit={save} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-white p-4 shadow-card ring-1 ring-neutral-200/60 space-y-3">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm">Nome</span>
              <input
                className="w-full mt-1 border rounded-xl px-3 py-2"
                value={data.nome}
                onChange={(e) => updateField("nome", e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-sm">Slug</span>
              <input
                className="w-full mt-1 border rounded-xl px-3 py-2"
                value={data.slug}
                onChange={(e) => updateField("slug", e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-sm">Espécie</span>
              <select
                className="w-full mt-1 border rounded-xl px-3 py-2"
                value={data.especie}
                onChange={(e) => updateField("especie", e.target.value as any)}
              >
                <option value="GATO">GATO</option>
                <option value="CACHORRO">CACHORRO</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm">Sexo</span>
              <select
                className="w-full mt-1 border rounded-xl px-3 py-2"
                value={data.sexo}
                onChange={(e) => updateField("sexo", e.target.value as any)}
              >
                <option value="FEMEA">FÊMEA</option>
                <option value="MACHO">MACHO</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm">Porte</span>
              <select
                className="w-full mt-1 border rounded-xl px-3 py-2"
                value={data.porte}
                onChange={(e) => updateField("porte", e.target.value as any)}
              >
                <option value="PEQUENO">PEQUENO</option>
                <option value="MEDIO">MÉDIO</option>
                <option value="GRANDE">GRANDE</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm">Idade (meses)</span>
              <input
                type="number"
                min={0}
                className="w-full mt-1 border rounded-xl px-3 py-2"
                value={data.idadeMeses}
                onChange={(e) => updateField("idadeMeses", Number(e.target.value))}
              />
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.vacinado}
                onChange={(e) => updateField("vacinado", e.target.checked)}
              />
              Vacinado
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.castrado}
                onChange={(e) => updateField("castrado", e.target.checked)}
              />
              Castrado
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm">Raça</span>
              <input
                className="w-full mt-1 border rounded-xl px-3 py-2"
                value={data.raca || ""}
                onChange={(e) => updateField("raca", e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-sm">Temperamento</span>
              <input
                className="w-full mt-1 border rounded-xl px-3 py-2"
                value={data.temperamento || ""}
                onChange={(e) => updateField("temperamento", e.target.value)}
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm">Descrição</span>
            <textarea
              className="w-full mt-1 border rounded-xl px-3 py-2"
              rows={4}
              value={data.descricao}
              onChange={(e) => updateField("descricao", e.target.value)}
            />
          </label>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm">História do resgate</span>
              <textarea
                className="w-full mt-1 border rounded-xl px-3 py-2"
                rows={4}
                value={data.historiaResgate || ""}
                onChange={(e) => updateField("historiaResgate", e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-sm">Convivência (uma por linha)</span>
              <textarea
                className="w-full mt-1 border rounded-xl px-3 py-2"
                rows={4}
                value={data.convivencia || ""}
                onChange={(e) => updateField("convivencia", e.target.value)}
              />
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm">Saúde / Observações</span>
              <textarea
                className="w-full mt-1 border rounded-xl px-3 py-2"
                rows={3}
                value={data.saudeDetalhes || ""}
                onChange={(e) => updateField("saudeDetalhes", e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-sm">Data do resgate</span>
              <input
                type="date"
                className="w-full mt-1 border rounded-xl px-3 py-2"
                value={dateVal}
                onChange={(e) => updateField("dataResgate", e.target.value)}
              />
            </label>
          </div>

          <button
            disabled={saving}
            className="rounded-full bg-neutral-900 text-white px-4 py-2 disabled:opacity-60"
          >
            {saving ? "Salvando…" : "Salvar alterações"}
          </button>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-neutral-200/60">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold">Fotos</h3>
            <CloudinaryUploader
              label="Enviar foto"
              onUploaded={async (url: string) => {
                await fetch(`/api/admin/animals/${id}/photos`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ url, alt: data.nome }),
                });
                const fresh = await fetch(`/api/admin/animals/${id}`).then((r) => r.json());
                setData(fresh);
              }}
            />
          </div>

          <ul className="grid grid-cols-3 gap-3">
            {data.photos?.map((p) => (
              <li key={p.id} className="relative group">
                <img src={p.url} className="w-full h-28 object-cover rounded-lg" alt={p.alt} />
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    type="button"
                    onClick={async () => {
                      await fetch(`/api/admin/photos/${p.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ isCover: true }),
                      });
                      const fresh = await fetch(`/api/admin/animals/${id}`).then((r) => r.json());
                      setData(fresh);
                    }}
                    className="text-xs rounded-full bg-white/90 px-2 py-1"
                  >
                    capa
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await fetch(`/api/admin/photos/${p.id}`, { method: "DELETE" });
                      const fresh = await fetch(`/api/admin/animals/${id}`).then((r) => r.json());
                      setData(fresh);
                    }}
                    className="text-xs rounded-full bg-white/90 px-2 py-1"
                  >
                    excluir
                  </button>
                </div>
                {p.isCover && (
                  <span className="absolute bottom-1 left-1 text-xs bg-black/70 text-white px-1.5 rounded">
                    capa
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </form>
    </Container>
  );
}
