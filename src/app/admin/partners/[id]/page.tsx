"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import CloudinaryUploader from "@/components/CloudinaryUploader";

export default function EditPartner({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const id = params.id;

  useEffect(() => {
    fetch(`/api/admin/partners/${id}`)
      .then((r) => r.json())
      .then(setData);
  }, [id]);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body: any = Object.fromEntries(fd.entries());
    body.active = fd.get("active") === "on";
    body.order = Number(fd.get("order") || 0);
    const r = await fetch(`/api/admin/partners/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.ok) router.push("/admin/partners");
    else alert("Erro ao salvar");
  }

  if (!data) return null;

  return (
    <Container className="pt-3">
      <h1 className="text-2xl font-extrabold mb-4">Editar parceiro</h1>
      <form
        onSubmit={save}
        className="max-w-xl rounded-2xl bg-white p-5 shadow-card ring-1 ring-neutral-200/60 space-y-3"
      >
        <label className="block">
          <span className="text-sm">Nome</span>
          <input
            name="name"
            defaultValue={data.name}
            className="w-full border rounded-xl px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm">URL</span>
          <input
            name="url"
            defaultValue={data.url ?? ""}
            className="w-full border rounded-xl px-3 py-2"
          />
        </label>
        <div>
          <span className="text-sm block mb-1">Logo</span>
          <input
            name="logoUrl"
            defaultValue={data.logoUrl}
            className="w-full border rounded-xl px-3 py-2"
          />
          <CloudinaryUploader
            label="Trocar logo"
            onUploaded={(url) => {
              (document.querySelector('input[name="logoUrl"]') as HTMLInputElement).value = url;
            }}
          />
          <img src={data.logoUrl} alt="" className="mt-2 h-16 object-contain" />
        </div>
        <div className="flex gap-4">
          <label className="inline-flex items-center gap-2">
            <input name="active" type="checkbox" defaultChecked={data.active} /> Ativo
          </label>
          <label className="inline-flex items-center gap-2">
            <span className="text-sm">Ordem</span>
            <input
              name="order"
              type="number"
              defaultValue={data.order}
              className="w-20 border rounded-xl px-2 py-1"
            />
          </label>
        </div>
        <button className="rounded-full bg-neutral-900 text-white px-4 py-2">Salvar</button>
      </form>
    </Container>
  );
}
