import Container from "@/components/Container";
import { prisma } from "@/lib/prisma";
import FormClient from "./FormClient";

export const metadata = {
  title: "Manifestar Interesse — Instituto Beth Leite",
  description: "Envie sua mensagem e entraremos em contato.",
};

export default async function AdotePage({ searchParams }: { searchParams?: { animal?: string } }) {
  const animals = await prisma.animal.findMany({
    where: { adotado: false },
    select: { id: true, nome: true },
    orderBy: { nome: "asc" },
  });

  const defaultAnimalId = searchParams?.animal ? Number(searchParams.animal) : undefined;

  return (
    <>
      <section
        className="
          relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]
          -mt-[var(--header-h)] pt-[calc(var(--header-h)+18px)]
          bg-gradient-to-b from-[#CFF5E8] via-[#E8FFF6] to-white
          overflow-hidden
        "
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14] md:opacity-[0.16]"
          style={{
            backgroundImage: "url('/patinhas.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "min(80vw, 680px) auto",
            backgroundPosition: "right -20px top -20px",
          }}
        />
        <Container>
          <div className="py-10 sm:py-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 ring-1 ring-emerald-200 px-3 py-1 text-sm text-emerald-900">
              🐾 adoção responsável
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900">
              Manifestar Interesse
            </h1>
            <p className="mt-3 max-w-3xl text-neutral-700 text-lg">
              Preencha o formulário abaixo para que nossa equipe entre em contato e siga com o
              processo de adoção.
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

      <Container>
        <div className="mt-8">
          <FormClient animals={animals} defaultAnimalId={defaultAnimalId} />
        </div>
        <div className="h-10" />
      </Container>
    </>
  );
}
