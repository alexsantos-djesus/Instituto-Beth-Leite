import Image from "next/image";
import Link from "next/link";
import SectionShell from "./SectionShell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = {
  showMax?: number;
  ctaHref?: string;
  ctaLabel?: string;
  title?: string;
  id?: string;
};

export default async function PartnersSection({
  showMax = 10,
  ctaHref = "/sobre#parceiros",
  ctaLabel = "Seja parceiro",
  title = "Parceiros & apoiadores",
  id = "parceiros",
}: Props) {
  const items = await prisma.partner.findMany({
    where: { active: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    take: showMax,
    select: { id: true, name: true, url: true, logoUrl: true },
  });

  return (
    <SectionShell id={id} tone="teal">
      <div className="flex items-start justify-between">
        <h2 className="text-2xl sm:text-3xl font-extrabold">{title}</h2>
        <Link
          href={ctaHref}
          className="hidden sm:inline-flex rounded-full px-4 py-2 bg-teal-600 text-white hover:bg-teal-700"
        >
          {ctaLabel}
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-4 rounded-2xl bg-white p-5 text-neutral-700 ring-1 ring-teal-200/60">
          Em breve divulgaremos os parceiros que acreditam na causa. 🐾
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((p) => {
            const card = (
              <div className="group rounded-2xl bg-white ring-1 ring-teal-200/60 shadow-card hover:shadow-md transition p-3">
                <div className="relative h-16 sm:h-20">
                  <Image
                    src={p.logoUrl}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 15vw"
                    className="object-contain grayscale group-hover:grayscale-0 transition"
                  />
                </div>
                <p className="mt-2 text-center text-xs text-neutral-600 line-clamp-1">{p.name}</p>
              </div>
            );

            return p.url ? (
              <a key={p.id} href={p.url} target="_blank" rel="noreferrer">
                {card}
              </a>
            ) : (
              <div key={p.id}>{card}</div>
            );
          })}
        </div>
      )}

      <Link
        href={ctaHref}
        className="sm:hidden mt-4 inline-flex rounded-full px-4 py-2 bg-teal-600 text-white hover:bg-teal-700"
      >
        {ctaLabel}
      </Link>
    </SectionShell>
  );
}
