"use client";
import { useState } from "react";

/**
 * Pode usar de duas formas:
 * 1) Upload único (default):
 *    <CloudinaryUploader onUploaded={(url) => ...} />
 *
 * 2) Vários uploads de uma vez:
 *    <CloudinaryUploader multiple onAdd={(urls) => ...} />
 */
type Props =
  | {
      label?: string;
      multiple?: boolean;
      onUploaded: (url: string) => void;
      onAdd?: never;
    }
  | {
      label?: string;
      multiple?: boolean;
      onUploaded?: never;
      onAdd: (urls: string[]) => void;
    };

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
    input.multiple = !!onAdd || multiple; // ativa múltiplo quando for usar onAdd/multiple

    input.onchange = async () => {
      const files = input.files ? Array.from(input.files) : [];
      if (!files.length) return;

      setBusy(true);
      try {
        // Assinatura do upload
        const sign = await fetch("/api/admin/upload/sign").then((r) => r.json());

        // tenta ler o preset de várias formas (compatibilidade)
        const preset =
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
          process.env.CLOUDINARY_UPLOAD_PRESET ||
          process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

        const uploadUrl = `https://api.cloudinary.com/v1_1/${sign.cloud}/auto/upload`;

        // faz upload de todos (se múltiplo) ou apenas um
        const results = await Promise.all(
          files.map(async (file) => {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("api_key", sign.key);
            fd.append("timestamp", String(sign.timestamp));
            fd.append("signature", sign.signature);
            if (preset) fd.append("upload_preset", String(preset));

            const res = await fetch(uploadUrl, { method: "POST", body: fd }).then((r) => r.json());
            return res?.secure_url as string | undefined;
          })
        );

        const urls = results.filter(Boolean) as string[];

        // Compatibilidade: se onAdd foi passado, devolve todas as URLs;
        // se onUploaded foi passado, dispara para cada URL (ou única).
        if (onAdd && urls.length) onAdd(urls);
        if (onUploaded && urls.length) urls.forEach((u) => onUploaded(u));
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
