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
      const full = `${window.location.origin}${url}`;

      // Tema por sexo
      const isMacho = sexo === "MACHO";
      const bg = isMacho ? "#e6f0ff" : "#ffe6f2"; // azul clarinho / rosa clarinho
      const accent = isMacho ? "#2563eb" : "#db2777"; // azul / rosa mais forte

      // Padrão de patinhas por espécie
      const pawSrc = especie === "GATO" ? "/patinhas-gatos.png" : "/patinhas-cachorro.png";

      // Tamanho do “cartaz” (boa qualidade p/ imprimir em A5/A4)
      const W = 900;
      const H = 1200;

      // 1) Gera o QR em um canvas separado (fundo transparente)
      const qrCanvas = document.createElement("canvas");
      await QRCode.toCanvas(qrCanvas, full, {
        width: 560,
        margin: 2,
        color: {
          dark: "#111111",
          light: "#00000000", // transparente
        },
      });

      // 2) Carrega a imagem de patinhas
      const pawImg = await loadImage(pawSrc);

      // 3) Monta o cartaz final
      const poster = document.createElement("canvas");
      poster.width = W;
      poster.height = H;
      const ctx = poster.getContext("2d")!;

      // Fundo principal
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Padrão de patinhas suave
      const pattern = ctx.createPattern(pawImg, "repeat");
      if (pattern) {
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
      }

      // “Cartão” branco com cantos arredondados
      const CARD_X = 80;
      const CARD_Y = 160;
      const CARD_W = W - CARD_X * 2;
      const CARD_H = H - CARD_Y * 2;
      roundRect(ctx, CARD_X, CARD_Y, CARD_W, CARD_H, 32);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // Título “Oi titio, eu sou”
      ctx.font = "bold 40px system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial";
      ctx.fillStyle = "#111111";
      ctx.textAlign = "center";
      ctx.fillText("Oi titio, eu sou", W / 2, CARD_Y + 80);

      // Nome destacado com a cor de destaque
      ctx.font = "900 72px system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial";
      ctx.fillStyle = accent;
      fitAndFillText(ctx, nome, W / 2, CARD_Y + 160, CARD_W - 120, 72);

      // QR centralizado
      const qrSize = 560;
      const qrX = (W - qrSize) / 2;
      const qrY = CARD_Y + 220;
      // moldura do QR
      roundRect(ctx, qrX - 20, qrY - 20, qrSize + 40, qrSize + 40, 24);
      ctx.fillStyle = "#f3f4f6";
      ctx.fill();
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

      // Rodapé com instrução
      ctx.font = "500 28px system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial";
      ctx.fillStyle = "#4b5563";
      ctx.fillText(
        "Aponte a câmera do celular para saber mais sobre mim!",
        W / 2,
        qrY + qrSize + 80
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
            className="bg-white rounded-2xl p-6 max-w-[720px] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold mb-3">QR Code da página</h3>

            {dataURL ? (
              <img src={dataURL} alt={`QR do ${nome}`} className="w-full rounded-xl border" />
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

/* ===== helpers ===== */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // importante p/ evitar problemas de CORS ao transformar em dataURL
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
  // reduz a fonte se o nome for muito comprido
  let size = baseSize;
  ctx.font = `900 ${size}px system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial`;
  while (ctx.measureText(text).width > maxWidth && size > 28) {
    size -= 2;
    ctx.font = `900 ${size}px system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial`;
  }
  ctx.fillText(text, x, y);
}
