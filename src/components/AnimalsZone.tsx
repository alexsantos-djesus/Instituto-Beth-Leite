import Link from "next/link";
import Image from "next/image";
import { PawPrint, Sparkles } from "lucide-react";
import SectionShell from "./SectionShell";

export default function AnimalsZone({ destaques }: { destaques: any[] }) {
  return (
    <SectionShell id="animais" tone="teal">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-3 py-1 text-teal-900 text-xs font-medium ring-1 ring-teal-200">
            <PawPrint size={14} /> adoção responsável
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold">Animais para Adoção</h2>
          <p className="text-neutral-700">Filtros por porte, idade e temperamento.</p>
        </div>
        <Link
          href="/animais"
          className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 bg-teal-600 text-white hover:bg-teal-700"
        >
          Ver todos <Sparkles size={16} />
        </Link>
      </div>

      {/* 2 col (mobile) → 3 col (sm+) */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {destaques.map((a, i) => {
          const cover = a.photos?.[0];
          return (
            <Link
              key={a.id}
              href={`/animais/${a.slug}`}
              // esconde apenas o 4º item (index 3) em telas lg+
              className={`group relative overflow-hidden rounded-2xl bg-neutral-100 shadow-md ${
                i === 3 ? "lg:hidden" : ""
              }`}
            >
              {cover && (
                <Image
                  src={cover.url}
                  alt={cover.alt || a.nome}
                  width={600}
                  height={800}
                  className="h-56 w-full object-cover transition-transform group-hover:scale-105"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-black/40 text-white p-2 text-sm">
                <div className="font-semibold truncate">{a.nome}</div>
                <div className="opacity-90">
                  {a.especie} • {String(a.porte).toLowerCase()}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <Link
        href="/animais"
        className="mt-6 sm:hidden inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 bg-teal-600 text-white font-medium hover:bg-teal-700"
      >
        Ver todos os animais <Sparkles size={16} />
      </Link>
    </SectionShell>
  );
}
