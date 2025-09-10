"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import CloudinaryUploader from "@/components/CloudinaryUploader";

export default function NewPartner() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", url: "", logoUrl: "", active: true, order: 0 });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/admin/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (r.ok) router.push("/admin/partners");
    else alert("Erro ao salvar");
  }

  return (
    <Container className="pt-3">
      <h1 className="text-2xl font-extrabold mb-4">Novo parceiro</h1>
      <form
        onSubmit={submit}
        className="max-w-xl rounded-2xl bg-white p-5 shadow-card ring-1 ring-neutral-200/60 space-y-3"
      >
        <label className="block">
          <span className="text-sm">Nome</span>
          <input
            className="w-full border rounded-xl px-3 py-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="text-sm">URL (opcional)</span>
          <input
            className="w-full border rounded-xl px-3 py-2"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
          />
        </label>
        <div>
          <span className="text-sm block mb-1">Logo</span>
          <CloudinaryUploader
            label="Enviar logo"
            onUploaded={(url) => setForm((f) => ({ ...f, logoUrl: url }))}
          />
          {form.logoUrl ? (
            <img src={form.logoUrl} alt="" className="mt-2 h-16 object-contain" />
          ) : null}
        </div>
        <div className="flex gap-3">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Ativo
          </label>
          <label className="inline-flex items-center gap-2">
            <span className="text-sm">Ordem</span>
            <input
              type="number"
              className="w-20 border rounded-xl px-2 py-1"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            />
          </label>
        </div>
        <button className="rounded-full bg-emerald-600 text-white px-4 py-2">Salvar</button>
      </form>
    </Container>
  );
}
