"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageViewer({
  images,
  index,
  setIndex,
  onClose,
}: {
  images: any[];
  index: number;
  setIndex: (i: number) => void;
  onClose: () => void;
}) {
  const imageRef = useRef<HTMLDivElement>(null);

  const prev = () => setIndex(index === 0 ? images.length - 1 : index - 1);

  const next = () => setIndex(index === images.length - 1 ? 0 : index + 1);

  // 🔒 Bloqueia scroll da página enquanto o modal estiver aberto
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // 🎹 Controles de teclado
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] bg-black/80 flex items-center justify-center"
      onClick={(e) => {
        // Fecha se clicar fora da imagem
        if (imageRef.current && !imageRef.current.contains(e.target as Node)) {
          onClose();
        }
      }}
    >
      <div ref={imageRef} className="relative w-[90vw] h-[80vh] max-w-[1200px]">
        <Image
          src={images[index].url}
          alt={images[index].alt}
          fill
          className="object-contain"
          priority
        />

        {/* Botão fechar */}
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:opacity-80">
          <X size={28} />
        </button>

        {/* Anterior */}
        {images.length > 1 && (
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:opacity-80"
          >
            <ChevronLeft size={40} />
          </button>
        )}

        {/* Próxima */}
        {images.length > 1 && (
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:opacity-80"
          >
            <ChevronRight size={40} />
          </button>
        )}
      </div>
    </div>,
    document.body
  );
}
