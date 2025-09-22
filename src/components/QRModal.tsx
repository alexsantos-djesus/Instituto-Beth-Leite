"use client";
import { useState, useEffect } from "react";
import QRCode from "qrcode";

type Props = {
  url: string;
  nome: string;
  especie: "GATO" | "CACHORRO";
  sexo: "MACHO" | "FEMEA";
  children: React.ReactNode;
};

export default function QRModal({ url, nome, especie, sexo, children }: Props) {
  const [open, setOpen] = useState(false);
  const [dataURL, setDataURL] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const buildPoster = async () => {
      // domínio oficial no QR
      const envBase = process.env.NEXT_PUBLIC_SITE_URL; // ex.: https://institutobethleite.com.br
      let origin = envBase || window.location.origin;
      if (!envBase && /\.vercel\.app$/.test(new URL(origin).hostname)) {
        origin = "https://institutobethleite.com.br";
      }
      const full = `${origin}${url}`;
      const W = 720;
      const H = 1024;
      const qrSize = Math.floor(W * 0.6);

      const isMacho = sexo === "MACHO";
      const bg = isMacho ? "#e6f0ff" : "#ffe6f2";
      const accent = isMacho ? "#2563eb" : "#db2777";
      const pawSrc = especie === "GATO" ? "/patinhas-gatos.png" : "/patinhas-cachorro.jpg";

      const qrCanvas = document.createElement("canvas");
      await QRCode.toCanvas(qrCanvas, full, {
        width: qrSize,
        margin: 2,
        color: { dark: "#111111", light: "#00000000" },
      });

      const pawImg = await loadImage(pawSrc);

      const poster = document.createElement("canvas");
      poster.width = W;
      poster.height = H;
      const ctx = poster.getContext("2d")!;

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      const pattern = ctx.createPattern(pawImg, "repeat");
      if (pattern) {
        ctx.globalAlpha = 0.07;
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
      }

      const CARD_X = 64;
      const CARD_Y = 120;
      const CARD_W = W - CARD_X * 2;
      const CARD_H = H - CARD_Y * 2;
      roundRect(ctx, CARD_X, CARD_Y, CARD_W, CARD_H, 28);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      ctx.textAlign = "center";
      ctx.fillStyle = "#111111";
      ctx.font = "bold 36px system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial";
      ctx.fillText("Oi titio, eu sou", W / 2, CARD_Y + 72);

      ctx.fillStyle = accent;
      fitAndFillText(ctx, nome, W / 2, CARD_Y + 142, CARD_W - 120, 64);

      const qrX = Math.round((W - qrSize) / 2);
      const qrY = CARD_Y + 200;
      roundRect(ctx, qrX - 16, qrY - 16, qrSize + 32, qrSize + 32, 20);
      ctx.fillStyle = "#f3f4f6";
      ctx.fill();
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

      // subtítulo
      ctx.font = "500 22px system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial";
      ctx.fillStyle = "#4b5563";
      ctx.fillText(
        "Aponte a câmera do celular para saber mais sobre mim!",
        W / 2,
        Math.min(H - 64, qrY + qrSize + 80)
      );

      setDataURL(poster.toDataURL("image/png"));
    };

    buildPoster();
  }, [open, url, nome, especie, sexo]);

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
            className="bg-white rounded-2xl p-6 w-full max-w-[420px] sm:max-w-[480px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold mb-3">QR Code da página</h3>

            {dataURL ? (
              <img
                src={dataURL}
                alt={`QR do ${nome}`}
                className="w-full h-auto rounded-xl border max-h-[72vh] object-contain"
              />
            ) : (
              <div className="h-64 bg-neutral-100 rounded-xl animate-pulse" />
            )}

            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <a
                href={dataURL ?? "#"}
                download={`qr-${nome}.png`}
                className={`w-full inline-flex items-center justify-center rounded-pill py-2 ${
                  sexo === "MACHO"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-pink-600 hover:bg-pink-700"
                } text-white disabled:opacity-60`}
                aria-disabled={!dataURL}
                onClick={(e) => {
                  if (!dataURL) e.preventDefault();
                }}
              >
                Baixar PNG
              </a>
              <button
                className="w-full rounded-pill bg-neutral-900 text-white py-2"
                onClick={() => window.print()}
              >
                Imprimir
              </button>
              <button
                className="w-full rounded-pill bg-neutral-200 text-neutral-900 py-2"
                onClick={() => setOpen(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function fitAndFillText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  baseSize: number
) {
  let size = baseSize;
  ctx.font = `900 ${size}px system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial`;
  while (ctx.measureText(text).width > maxWidth && size > 28) {
    size -= 2;
    ctx.font = `900 ${size}px system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial`;
  }
  ctx.fillText(text, x, y);
}
