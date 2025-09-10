import Image from "next/image";
import Link from "next/link";
import Badge from "./Badge";
import { idadeEmTexto } from "@/lib/formatters";
import { Animal, Photo } from "@prisma/client";

export default function AnimalCard({ animal }: { animal: Animal & { photos: Photo[] } }) {
  const cover = animal.photos[0];
  const isAdotado = Boolean(animal.adotado);

  const Wrapper: any = isAdotado ? "div" : Link;
  const wrapperProps = isAdotado ? {} : { href: `/animais/${animal.slug}` };

  return (
    <Wrapper
      {...wrapperProps}
      aria-disabled={isAdotado ? true : undefined}
      className={`block bg-white rounded-2xl shadow-card overflow-hidden transition
        ${isAdotado ? "cursor-default" : "hover:shadow-lg"}
      `}
    >
      <div className="relative aspect-[4/3] bg-neutral-100">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            className={`object-cover ${isAdotado ? "grayscale" : ""}`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
          />
        ) : null}

        {isAdotado && (
          <span className="absolute inset-0 grid place-items-center pointer-events-none">
            <span className="select-none text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-wider text-rose-700/90 bg-white/75 px-4 py-1 rounded rotate-[-12deg] ring-2 ring-rose-600/40 shadow">
              ADOTADO
            </span>
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">{animal.nome}</h3>
          <Badge>{idadeEmTexto(animal.idadeMeses)}</Badge>
        </div>
        <div className="mt-2 text-sm text-neutral-700">
          {animal.especie} • {animal.sexo} • {animal.porte}
        </div>
      </div>
    </Wrapper>
  );
}
