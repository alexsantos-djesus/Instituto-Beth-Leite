"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import CloudinaryUploader from "@/components/CloudinaryUploader";

type Photo = { url: string; alt?: string };

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export default function NewAnimalPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nome: "",
    slug: "",
    especie: "GATO",
    sexo: "FEMEA",
    porte: "PEQUENO",
    idadeMeses: 0,
    vacinado: false,
    castrado: false,
    raca: "",
    temperamento: "",
    descricao: "",
    historiaResgate: "",
    convivencia: "",
    saudeDetalhes: "",
    dataResgate: "",
  });

  const [fotos, setFotos] = useState<Photo[]>([]);
  const [saving, setSaving] = useState(false);

  const addFotos = (arr: Photo[]) =>
    setFotos((prev) => [...prev, ...arr.map((p) => ({ ...p, alt: p.alt || form.nome }))]);

  const canAutosetSlug = useMemo(
    () => form.slug.trim() === "" || form.slug === slugify(form.nome),
    [form.nome, form.slug]
  );

  const onChange = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload: any = {
      ...form,
      slug: (canAutosetSlug ? slugify(form.nome) : form.slug).trim(),
      idadeMeses: Number(form.idadeMeses || 0),
      raca: form.raca.trim() || null,
      temperamento: form.temperamento.trim() || null,
      historiaResgate: form.historiaResgate.trim() || null,
      convivencia: form.convivencia.trim() || null,
      saudeDetalhes: form.saudeDetalhes.trim() || null,
      dataResgate: form.dataResgate ? new Date(form.dataResgate) : null,
      photos: fotos.map((p, i) => ({
        url: p.url,
        alt: p.alt || form.nome,
        sortOrder: i,
        isCover: i === 0,
      })),
    };

    let res = await fetch("/api/admin/animals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const { photos, ...base } = payload;
      res = await fetch("/api/admin/animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(base),
      });
      if (!res.ok) {
        setSaving(false);
        alert("Não foi possível salvar o animal.");
        return;
      }
      const created = await res.json();
      if (fotos.length) {
        await fetch(`/api/admin/animals/${created.id}/photos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photos: payload.photos }),
        });
      }
    }

    setSaving(false);
    router.push("/admin/animals");
  };

  return (
    <Container>
      <h1 className="text-2xl font-extrabold mb-4">Novo animal</h1>

      <form onSubmit={submit} className="bg-white rounded-2xl shadow-card p-6 space-y-5 max-w-3xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm">Nome</span>
            <input
              className="w-full border rounded-xl px-3 py-2"
              value={form.nome}
              onChange={(e) => {
                const nome = e.target.value;
                setForm((f) => ({
                  ...f,
                  nome,
                  slug: canAutosetSlug ? slugify(nome) : f.slug,
                }));
              }}
            />
          </label>
          <label className="block">
            <span className="text-sm">Slug</span>
            <input
              className="w-full border rounded-xl px-3 py-2"
              value={form.slug}
              onChange={(e) => onChange("slug", e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm">Espécie</span>
            <select
              className="w-full border rounded-xl px-3 py-2"
              value={form.especie}
              onChange={(e) => onChange("especie", e.target.value as any)}
            >
              <option value="GATO">GATO</option>
              <option value="CACHORRO">CACHORRO</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm">Sexo</span>
            <select
              className="w-full border rounded-xl px-3 py-2"
              value={form.sexo}
              onChange={(e) => onChange("sexo", e.target.value as any)}
            >
              <option value="FEMEA">FÊMEA</option>
              <option value="MACHO">MACHO</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm">Porte</span>
            <select
              className="w-full border rounded-xl px-3 py-2"
              value={form.porte}
              onChange={(e) => onChange("porte", e.target.value as any)}
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
              className="w-full border rounded-xl px-3 py-2"
              value={form.idadeMeses}
              onChange={(e) => onChange("idadeMeses", Number(e.target.value))}
            />
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.vacinado}
              onChange={(e) => onChange("vacinado", e.target.checked)}
            />
            Vacinado
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.castrado}
              onChange={(e) => onChange("castrado", e.target.checked)}
            />
            Castrado
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm">Raça</span>
            <input
              className="w-full border rounded-xl px-3 py-2"
              value={form.raca}
              onChange={(e) => onChange("raca", e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm">Temperamento</span>
            <input
              className="w-full border rounded-xl px-3 py-2"
              value={form.temperamento}
              onChange={(e) => onChange("temperamento", e.target.value)}
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm">Descrição</span>
          <textarea
            className="w-full border rounded-xl px-3 py-2"
            rows={4}
            value={form.descricao}
            onChange={(e) => onChange("descricao", e.target.value)}
          />
        </label>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm">História do resgate</span>
            <textarea
              className="w-full border rounded-xl px-3 py-2"
              rows={4}
              value={form.historiaResgate}
              onChange={(e) => onChange("historiaResgate", e.target.value)}
              placeholder="Conte como foi o resgate…"
            />
          </label>
          <label className="block">
            <span className="text-sm">Convivência (uma por linha)</span>
            <textarea
              className="w-full border rounded-xl px-3 py-2"
              rows={4}
              value={form.convivencia}
              onChange={(e) => onChange("convivencia", e.target.value)}
              placeholder={
                "Convive bem com outros gatos\nGosta de colo\nPrefere ambiente tranquilo"
              }
            />
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm">Saúde / Observações</span>
            <textarea
              className="w-full border rounded-xl px-3 py-2"
              rows={3}
              value={form.saudeDetalhes}
              onChange={(e) => onChange("saudeDetalhes", e.target.value)}
              placeholder="Vacinas, rotina, medicações…"
            />
          </label>
          <label className="block">
            <span className="text-sm">Data do resgate</span>
            <input
              type="date"
              className="w-full border rounded-xl px-3 py-2"
              value={form.dataResgate}
              onChange={(e) => onChange("dataResgate", e.target.value)}
            />
          </label>
        </div>

        <div className="space-y-2">
          <CloudinaryUploader onAdd={addFotos} />
          <div className="flex flex-wrap gap-2">
            {fotos.map((f, i) => (
              <div
                key={`${f.url}-${i}`}
                className="relative w-24 h-24 rounded-lg overflow-hidden bg-neutral-100"
              >
                <img src={f.url} alt={f.alt || form.nome} className="h-full w-full object-cover" />
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 text-[10px] bg-black/70 text-white px-1.5 rounded">
                    capa
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          disabled={saving}
          className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 disabled:opacity-60"
        >
          {saving ? "Salvando…" : "Salvar"}
        </button>
      </form>
    </Container>
  );
}
