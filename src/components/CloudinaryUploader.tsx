"use client";
import { useState } from "react";

export default function CloudinaryUploader({
  onUploaded,
  label = "Enviar imagem",
}: {
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);

  const pick = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = (input.files && input.files[0]) || null;
      if (!file) return;

      setBusy(true);
      try {
        const sign = await fetch("/api/admin/upload/sign").then((r) => r.json());
        const fd = new FormData();
        fd.append("file", file);
        fd.append("api_key", sign.key);
        fd.append("timestamp", String(sign.timestamp));
        fd.append("signature", sign.signature);
        const preset =
          process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || process.env.CLOUDINARY_UPLOAD_PRESET;
        if (preset) fd.append("upload_preset", preset as string);

        const url = `https://api.cloudinary.com/v1_1/${sign.cloud}/auto/upload`;
        const up = await fetch(url, { method: "POST", body: fd }).then((r) => r.json());
        if (up.secure_url) onUploaded(up.secure_url);
      } finally {
        setBusy(false);
      }
    };
    input.click();
  };

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
