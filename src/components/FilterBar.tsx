"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, Syringe, Scissors, Dog, Cat } from "lucide-react";

type ChipProps = { active?: boolean; onClick: () => void; children: React.ReactNode };
const Chip = ({ active, onClick, children }: ChipProps) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-pill border text-sm transition whitespace-nowrap snap-start ${
      active
        ? "bg-neutral-900 text-white border-neutral-900"
        : "bg-white border-neutral-200 hover:bg-neutral-100"
    }`}
  >
    {children}
  </button>
);

export default function FilterBar() {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");

  const set = (key: string, value?: string) => {
    const params = new URLSearchParams(Array.from(sp.entries()));
    if (!value) params.delete(key);
    else params.set(key, value);
    router.push(`/animais?${params.toString()}`);
  };

  const toggleBool = (key: string) => {
    const v = sp.get(key);
    set(key, v === "true" ? undefined : "true");
  };

  useEffect(() => {
    setQ(sp.get("q") ?? "");
  }, [sp]);

  return (
    <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-card">
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto scrollbar-none snap-x snap-mandatory">
        <Chip
          active={sp.get("especie") === "CACHORRO"}
          onClick={() => set("especie", sp.get("especie") === "CACHORRO" ? undefined : "CACHORRO")}
        >
          <Dog size={16} className="inline mr-1" /> Cães
        </Chip>
        <Chip
          active={sp.get("especie") === "GATO"}
          onClick={() => set("especie", sp.get("especie") === "GATO" ? undefined : "GATO")}
        >
          <Cat size={16} className="inline mr-1" /> Gatos
        </Chip>

        {["PEQUENO", "MEDIO", "GRANDE"].map((p) => (
          <Chip
            key={p}
            active={sp.get("porte") === p}
            onClick={() => set("porte", sp.get("porte") === p ? undefined : p)}
          >
            {p.toLowerCase()}
          </Chip>
        ))}

        {["MACHO", "FEMEA"].map((s) => (
          <Chip
            key={s}
            active={sp.get("sexo") === s}
            onClick={() => set("sexo", sp.get("sexo") === s ? undefined : s)}
          >
            {s === "MACHO" ? "macho" : "fêmea"}
          </Chip>
        ))}

        {["0-6", "7-24", "25+"].map((f) => (
          <Chip
            key={f}
            active={sp.get("faixa") === f}
            onClick={() => set("faixa", sp.get("faixa") === f ? undefined : f)}
          >
            {f === "0-6" ? "até 6m" : f === "7-24" ? "7m–2a" : "2+ anos"}
          </Chip>
        ))}

        <Chip active={sp.get("vacinado") === "true"} onClick={() => toggleBool("vacinado")}>
          <Syringe size={16} className="inline mr-1" /> vacinado
        </Chip>
        <Chip active={sp.get("castrado") === "true"} onClick={() => toggleBool("castrado")}>
          <Scissors size={16} className="inline mr-1" /> castrado
        </Chip>
      </div>

      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") set("q", q || undefined); }}
            className="w-full pl-8 pr-3 py-2 border rounded-pill"
            placeholder="buscar por nome/raça"
            aria-label="Buscar"
          />
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-pill bg-neutral-900 text-white"
            onClick={() => set("q", q || undefined)}
          >
            Buscar
          </button>
          <button
            className="px-4 py-2 rounded-pill bg-white border border-neutral-200"
            onClick={() => router.push("/animais")}
          >
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
}
