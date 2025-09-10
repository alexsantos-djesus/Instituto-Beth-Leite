"use client";
import { useState, useEffect } from "react";
import QRCode from "qrcode";

export default function QRModal({ url, children }: { url: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [dataURL, setDataURL] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const full = `${window.location.origin}${url}`;
    QRCode.toDataURL(full, { margin: 1, width: 512 }).then(setDataURL);
  }, [open, url]);

  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold mb-3">QR Code da página</h3>
            {dataURL ? (
              <img src={dataURL} alt="QR code" className="w-full rounded-xl border" />
            ) : (
              <div className="h-64 bg-neutral-100 rounded-xl animate-pulse" />
            )}
            <p className="text-sm text-neutral-600 mt-3">
              Imprima este QR nas feiras para abrir a ficha do animal.
            </p>
            <button
              className="mt-4 w-full rounded-pill bg-neutral-900 text-white py-2"
              onClick={() => setOpen(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
