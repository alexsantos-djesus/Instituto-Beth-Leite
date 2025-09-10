"use client";
import Link from "next/link";
import { HeartHandshake, Gift, ArrowRight } from "lucide-react";
import SectionShell from "./SectionShell";

export default function DonateZone() {
  return (
    <SectionShell id="apadrinhe" tone="amber">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-amber-900 text-xs font-medium ring-1 ring-amber-200">
            <Gift size={14} /> impacto contínuo
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold">Doe ou Apadrinhe</h2>
          <p className="text-neutral-700 leading-relaxed">
            Ajude a manter vacinas, castrações, consultas, ração e abrigo. Se não pode adotar agora,
            torne-se padrinho e acompanhe a jornada dele.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/como-ajudar#doar"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 bg-neutral-900 text-white hover:bg-neutral-800"
            >
              <HeartHandshake size={18} /> Quero ajudar
            </Link>
            <Link
              href="/padrinhos"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 ring-1 ring-neutral-300 text-neutral-800 hover:bg-neutral-50"
            >
              Conhecer planos <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
