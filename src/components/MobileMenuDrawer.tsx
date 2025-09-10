"use client";

import Link from "next/link";
import Brand from "./Brand";
import { X } from "lucide-react";

const DRAWER_SIDE: "right" | "left" = "left";

export default function MobileMenuDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const sideClass =
    DRAWER_SIDE === "right"
      ? "right-0 translate-x-full data-[open=true]:translate-x-0"
      : "left-0 -translate-x-full data-[open=true]:translate-x-0";

  return (
    <>
      <div
        onClick={onClose}
        className={`md:hidden fixed inset-0 z-[80] bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        data-open={open}
        className={`md:hidden fixed top-0 bottom-0 z-[90] w-80 bg-white shadow-xl transition-transform duration-300 ${sideClass}`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Brand variant="header" />
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-col p-3">
          {[
            ["/", "home"],
            ["/animais", "adotáveis"],
            ["/como-ajudar", "como ajudar"],
            ["/eventos", "eventos"],
            ["/sobre", "quem somos"],
            ["/contato", "fale conosco"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="px-3 py-2 rounded-lg hover:bg-neutral-100"
            >
              {label}
            </Link>
          ))}

          <Link
            href="/adote"
            onClick={onClose}
            className="mt-2 px-4 py-3 rounded-xl bg-brand-secondary text-white text-center"
          >
            Adote
          </Link>
        </nav>
      </aside>
    </>
  );
}
