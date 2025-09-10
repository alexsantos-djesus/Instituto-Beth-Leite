import { prisma } from "@/lib/prisma";
import Container from "@/components/Container";
import AnimalCard from "@/components/AnimalCard";
import FilterBar from "@/components/FilterBar";
import { Metadata } from "next";
import { PawPrint } from "lucide-react";

export const metadata: Metadata = {
  title: "Animais para Adoção — Instituto Beth Leite",
  description: "Filtre por espécie, porte, sexo, idade e encontre seu companheiro ideal.",
};

export default async function AnimaisPage({
  searchParams,
}: {
  searchParams: { [k: string]: string | string[] | undefined };
}) {
  const especie = (searchParams.especie as string) || undefined;
  const porte = (searchParams.porte as string) || undefined;
  const sexo = (searchParams.sexo as string) || undefined;
  const vacinado = (searchParams.vacinado as string) || undefined;
  const castrado = (searchParams.castrado as string) || undefined;
  const q = (searchParams.q as string) || undefined;
  const faixa = (searchParams.faixa as string) || undefined;

  const where: any = {};
  if (especie) where.especie = especie;
  if (porte) where.porte = porte;
  if (sexo) where.sexo = sexo;
  if (vacinado) where.vacinado = vacinado === "true";
  if (castrado) where.castrado = castrado === "true";
  if (q) {
    where.OR = [
      { nome: { contains: q, mode: "insensitive" } },
      { raca: { contains: q, mode: "insensitive" } },
    ];
  }
  if (faixa) {
    if (faixa === "0-6") where.idadeMeses = { lte: 6 };
    if (faixa === "7-24") where.idadeMeses = { gte: 7, lte: 24 };
    if (faixa === "25+") where.idadeMeses = { gte: 25 };
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const visClause = {
    OR: [{ adotado: false }, { AND: [{ adotado: true }, { adotadoEm: { gte: cutoff } }] }],
  };
  where.AND = [...(where.AND || []), visClause];

  const animals = await prisma.animal.findMany({
    where,
    include: { photos: { take: 1 } },
    orderBy: [{ adotado: "asc" }, { criadoEm: "asc" }],
  });

  return (
    <>
      <section
        className="
          relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]
          -mt-[var(--header-h)] pt-[calc(var(--header-h)+16px)]
          bg-gradient-to-b from-[#66ff94] via-[#bfffda] to-[#f1fffc]
          overflow-hidden
        "
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14] md:opacity-[0.16]"
          style={{
            backgroundImage: "url('/patinhas.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "min(78vw, 640px) auto",
            backgroundPosition: "right -18px top -18px",
          }}
        />
        <Container>
          <div className="py-8 sm:py-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 ring-1 ring-emerald-200 px-3 py-1 text-sm text-emerald-900">
              <PawPrint className="h-4 w-4" /> adoção responsável
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
              Animais para Adoção
            </h1>
            <p className="mt-2 text-neutral-700">
              Filtre por espécie, porte, sexo e idade para encontrar seu novo melhor amigo.
            </p>
          </div>
        </Container>
        <svg
          className="block w-full h-[28px] text-white"
          viewBox="0 0 1440 64"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32 C240,64 480,0 720,16 C960,32 1200,80 1440,32 L1440,64 L0,64 Z"
            fill="currentColor"
          />
        </svg>
      </section>

      <Container className="pt-4 md:pt-6">
        <div className="bg-white rounded-2xl shadow-card ring-1 ring-emerald-200/60 p-4">
          <FilterBar />
        </div>

        {animals.length === 0 ? (
          <p className="mt-8 text-neutral-700">
            Nenhum animal encontrado com os filtros aplicados.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {animals.map((a) => (
              <AnimalCard key={a.id} animal={a} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
