"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import CloudinaryUploader from "@/components/CloudinaryUploader";

type Form = {
  title: string;
  slug: string;
  startsAt: string; // datetime-local
  endsAt: string; // datetime-local
  location: string;
  city: string;
  coverUrl: string;
  excerpt: string;
  content: string;
  published: boolean;
};

function toInputLocal(dt?: string | null) {
  if (!dt) return "";
  const d = new Date(dt);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${y}-${m}-${day}T${hh}:${mm}`;
}

export default function EditEvent({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = params.id;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Form | null>(null);

  useEffect(() => {
    (async () => {
      const r = await fetch(`/api/admin/events/${id}`);
      if (!r.ok) {
        alert("Evento não encontrado");
        router.push("/admin/events");
        return;
      }
      const data = await r.json();
      setForm({
        title: data.title ?? "",
        slug: data.slug ?? "",
        startsAt: toInputLocal(data.startsAt),
        endsAt: toInputLocal(data.endsAt),
        location: data.location ?? "",
        city: data.city ?? "",
        coverUrl: data.coverUrl ?? "",
        excerpt: data.excerpt ?? "",
        content: data.content ?? "",
        published: !!data.published,
      });
      setLoading(false);
    })();
  }, [id, router]);

  if (loading || !form) return null;

  const onChange =
    (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({
        ...form,
        [key]: e.target.type === "checkbox" ? (e as any).target.checked : e.target.value,
      });

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const toIso = (v: string) => (v ? new Date(v).toISOString() : null);

    const body = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      startsAt: toIso(form.startsAt),
      endsAt: toIso(form.endsAt),
      location: form.location.trim() || null,
      city: form.city.trim() || null,
      coverUrl: form.coverUrl.trim() || null,
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim() || null,
      published: !!form.published,
    };

    const r = await fetch(`/api/admin/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);
    if (r.ok) router.push("/admin/events");
    else alert("Erro ao salvar");
  }

  return (
    <Container className="pt-3">
      <h1 className="text-2xl font-extrabold mb-4">Editar evento</h1>

      <form
        onSubmit={save}
        className="max-w-2xl rounded-2xl bg-white p-5 shadow-card ring-1 ring-neutral-200/60 space-y-3"
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm">Título</span>
            <input
              className="w-full border rounded-xl px-3 py-2"
              value={form.title}
              onChange={onChange("title")}
            />
          </label>

          <label className="block">
            <span className="text-sm">Slug</span>
            <input
              className="w-full border rounded-xl px-3 py-2"
              value={form.slug}
              onChange={onChange("slug")}
            />
          </label>

          <label className="block">
            <span className="text-sm">Início</span>
            <input
              type="datetime-local"
              className="w-full border rounded-xl px-3 py-2"
              value={form.startsAt}
              onChange={onChange("startsAt")}
            />
          </label>

          <label className="block">
            <span className="text-sm">Fim</span>
            <input
              type="datetime-local"
              className="w-full border rounded-xl px-3 py-2"
              value={form.endsAt}
              onChange={onChange("endsAt")}
            />
          </label>

          <label className="block">
            <span className="text-sm">Local</span>
            <input
              className="w-full border rounded-xl px-3 py-2"
              value={form.location}
              onChange={onChange("location")}
            />
          </label>

          <label className="block">
            <span className="text-sm">Cidade</span>
            <input
              className="w-full border rounded-xl px-3 py-2"
              value={form.city}
              onChange={onChange("city")}
            />
          </label>
        </div>

        <div>
          <span className="text-sm block mb-1">Capa</span>
          <input
            className="w-full border rounded-xl px-3 py-2 mb-2"
            value={form.coverUrl}
            onChange={onChange("coverUrl")}
            placeholder="https://…"
          />
          <CloudinaryUploader
            label="Trocar capa"
            onUploaded={(url) => setForm({ ...form, coverUrl: url })}
          />
          {form.coverUrl ? (
            <img src={form.coverUrl} alt="" className="mt-2 h-28 object-cover rounded-lg" />
          ) : null}
        </div>

        <label className="block">
          <span className="text-sm">Resumo</span>
          <input
            className="w-full border rounded-xl px-3 py-2"
            value={form.excerpt}
            onChange={onChange("excerpt")}
          />
        </label>

        <label className="block">
          <span className="text-sm">Conteúdo</span>
          <textarea
            rows={5}
            className="w-full border rounded-xl px-3 py-2"
            value={form.content}
            onChange={onChange("content")}
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
          className="rounded-full bg-neutral-900 text-white px-4 py-2 disabled:opacity-60"
        >
          {saving ? "Salvando…" : "Salvar"}
        </button>
      </form>
    </Container>
  );
}
