// components/Modal.tsx
"use client";
import { X } from "lucide-react";

export default function Modal({
  open,
  onClose,
  title,
  right,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  right?: React.ReactNode; // ex.: <select status ... />
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-5xl rounded-2xl bg-white shadow-2xl ring-1 ring-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header fixo */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b px-5 py-3 bg-white/95 backdrop-blur">
          <div className="min-w-0 text-lg font-semibold truncate">{title}</div>
          <div className="flex items-center gap-3">
            {right}
            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-neutral-100"
              aria-label="Fechar"
            >
              <X className="h-5 w-5 text-neutral-600" />
            </button>
          </div>
        </div>

        {/* Conteúdo rolável */}
        <div className="px-5">
          <div className="max-h-[70vh] md:max-h-[78vh] overflow-y-auto py-4 pr-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
