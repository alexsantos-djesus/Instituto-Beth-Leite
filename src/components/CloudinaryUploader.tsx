"use client";
import { useState } from "react";

type Props =
  | { label?: string; multiple?: boolean; onUploaded: (url: string) => void; onAdd?: never }
  | { label?: string; multiple?: boolean; onUploaded?: never; onAdd: (urls: string[]) => void };

export default function CloudinaryUploader({
  label = "Enviar imagem",
  multiple = false,
  onUploaded,
  onAdd,
}: Props) {
  const [busy, setBusy] = useState(false);

  async function pick() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = !!onAdd || multiple;

    input.onchange = async () => {
      const files = input.files ? Array.from(input.files) : [];
      if (!files.length) return;
      setBusy(true);
      try {
        const unsignedPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        const urls = await Promise.all(
          files.map(async (file) => {
            if (unsignedPreset) {
              // MODO UNSIGNED (sem assinatura)
              const cloud =
                process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD ||
                process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
              if (!cloud) throw new Error("Defina NEXT_PUBLIC_CLOUDINARY_CLOUD");
              const fd = new FormData();
              fd.append("file", file);
              fd.append("upload_preset", unsignedPreset);
              const r = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
                method: "POST",
                body: fd,
              });
              const j = await r.json();
              if (!r.ok) throw new Error(j?.error?.message || "Upload failed");
              return j.secure_url as string;
            } else {
              // MODO SIGNED (com assinatura)
              const sign = await fetch("/api/admin/upload/sign").then((r) => r.json());
              const endpoint = `https://api.cloudinary.com/v1_1/${sign.cloud}/image/upload`;
              const fd = new FormData();
              fd.append("file", file);
              // Campos obrigatórios
              fd.append("api_key", String(sign.key));
              fd.append("timestamp", String(sign.timestamp));
              fd.append("signature", String(sign.signature));
              // Campos adicionais que o servidor ASSINOU (use exatamente os nomes que ele retornou)
              if (sign.upload_preset) fd.append("upload_preset", String(sign.upload_preset));
              if (sign.folder) fd.append("folder", String(sign.folder));
              if (sign.public_id) fd.append("public_id", String(sign.public_id));
              if (sign.tags) fd.append("tags", String(sign.tags)); // ex.: "a,b,c"

              const r = await fetch(endpoint, { method: "POST", body: fd });
              const j = await r.json();
              if (!r.ok) throw new Error(j?.error?.message || "Upload failed");
              return j.secure_url as string;
            }
          })
        );

        const ok = urls.filter(Boolean) as string[];
        if (onAdd && ok.length) onAdd(ok);
        if (onUploaded && ok.length) ok.forEach((u) => onUploaded(u));
      } finally {
        setBusy(false);
      }
    };

    input.click();
  }

  return (
    <button
      type="button"
      onClick={pick}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-60"
      disabled={busy}
    >
      {busy ? "Enviando..." : label}
    </button>
  );
}
