"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import CloudinaryUploader from "@/components/CloudinaryUploader";

function normalizeSlug(raw: string) {
  const dec = decodeURIComponent(raw || "");
  return dec
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function NewEvent() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    startsAt: "",
    endsAt: "",
    location: "",
    city: "",
    coverUrl: "",
    excerpt: "",
    content: "",
    published: true,
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const title = form.title.trim();
    const slug = normalizeSlug((form.slug || title).trim());

    const toIso = (v: string) => (v ? new Date(v).toISOString() : null);

    const body = {
      title,
      slug,
      startsAt: toIso(form.startsAt),
      endsAt: toIso(form.endsAt),
      location: form.location.trim() || null,
      city: form.city.trim() || null,
      coverUrl: form.coverUrl.trim() || null,
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim() || null,
      published: !!form.published,
    };

    try {
      const r = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (r.ok) router.push("/admin/events");
      else alert("Erro ao salvar");
    } catch {
      alert("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Container className="pt-3">
      <h1 className="text-2xl font-extrabold mb-4">Novo evento</h1>

      <form
        onSubmit={submit}
        className="max-w-2xl rounded-2xl bg-white p-5 shadow-card ring-1 ring-neutral-200/60 space-y-3"
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm">Título</span>
            <input
              className="w-full border rounded-xl px-3 py-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm">Slug (opcional)</span>
            <input
              className="w-full border rounded-xl px-3 py-2"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="deixe em branco p/ gerar do título"
            />
          </label>

          <label className="block">
            <span className="text-sm">Início</span>
            <input
              type="datetime-local"
              className="w-full border rounded-xl px-3 py-2"
              value={form.startsAt}
              onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm">Fim (opcional)</span>
            <input
              type="datetime-local"
              className="w-full border rounded-xl px-3 py-2"
              value={form.endsAt}
              onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
            />
          </label>

          <label className="block">
            <span className="text-sm">Local</span>
            <input
              className="w-full border rounded-xl px-3 py-2"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </label>

          <label className="block">
            <span className="text-sm">Cidade</span>
            <input
              className="w-full border rounded-xl px-3 py-2"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </label>
        </div>

        <div>
          <span className="text-sm block mb-1">Capa</span>
          <input
            className="w-full border rounded-xl px-3 py-2 mb-2"
            value={form.coverUrl}
            onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
            placeholder="https://…"
            name="coverUrl"
          />
          <CloudinaryUploader
            label="Enviar capa"
            onUploaded={(url) => setForm((f) => ({ ...f, coverUrl: url }))}
          />
          {form.coverUrl ? (
            <img
              src={form.coverUrl}
              alt="Capa do evento"
              className="mt-2 h-28 object-cover rounded-lg w-full"
            />
          ) : null}
        </div>

        <label className="block">
          <span className="text-sm">Resumo (excerpt)</span>
          <input
            className="w-full border rounded-xl px-3 py-2"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />
        </label>

        <label className="block">
          <span className="text-sm">Conteúdo</span>
          <textarea
            rows={5}
            className="w-full border rounded-xl px-3 py-2"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          Publicado
        </label>

        <button
          disabled={saving}
          className="rounded-full bg-emerald-600 text-white px-4 py-2 disabled:opacity-60"
        >
          {saving ? "Salvando…" : "Salvar"}
        </button>
      </form>
    </Container>
  );
}
