import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import QRModal from "@/components/QRModal";
import { prisma } from "@/lib/prisma";
import { idadeEmTexto, dataPt } from "@/lib/formatters";
import {
  Share2,
  QrCode,
  HeartHandshake,
  Syringe,
  Scissors,
  PawPrint,
  Dog,
  Cat,
} from "lucide-react";
import { Great_Vibes } from "next/font/google";
import AnimalGallery from "@/components/AnimalGallery";

const script = Great_Vibes({ subsets: ["latin"], weight: "400" });

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const a = await prisma.animal.findUnique({ where: { slug: params.slug } });
  if (!a) return { title: "Animal não encontrado — Instituto Beth Leite" };
  return {
    title: `${a.nome} para adoção — Instituto Beth Leite`,
    description: a.descricao.slice(0, 140),
    openGraph: { title: `${a.nome} • Adoção`, description: a.descricao.slice(0, 140) },
  };
}

export default async function AnimalPage({ params }: { params: { slug: string } }) {
  const animal = await prisma.animal.findUnique({
    where: { slug: params.slug },
    include: { photos: true },
  });
  if (!animal) notFound();

  if (animal.oculto || animal.adotado) notFound();

  const fotos = animal.photos ?? [];
  const capa = fotos[0];
  const extra = fotos.slice(1, 3);

  const urlRelative = `/animais/${animal.slug}`;
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const absoluteUrl = `${site}${urlRelative}`;
  const shareMsg = `Conheça ${animal.nome} no Instituto Beth Leite: ${absoluteUrl}`;

  const especieIcon =
    animal.especie === "GATO" ? <Cat className="h-4 w-4" /> : <Dog className="h-4 w-4" />;

  const chip = (content: React.ReactNode, key?: string) => (
    <span
      key={key}
      className="inline-flex items-center gap-1 rounded-full border border-black/5 bg-white/90 backdrop-blur-[1px] px-3 py-1 text-[0.95rem] sm:text-sm text-neutral-800 shadow-sm"
    >
      {content}
    </span>
  );

  return (
    <>
      <section
        className="
          relative w-full
          -mt-[var(--header-h)] pt-[calc(var(--header-h)+8px)]
          bg-gradient-to-b from-brand-soft via-[#F8E59C] to-brand-primary
          overflow-hidden
        "
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.16] md:opacity-[0.18] mix-blend-multiply"
          style={{
            backgroundImage: "url('/patinhas.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "clamp(240px, 65vmin, 700px) auto",
            backgroundPosition: "right -8px top -8px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(1100px 450px at 25% 0%, rgba(255,255,255,0.28), rgba(255,255,255,0) 60%)",
          }}
        />

        <div className="container max-w-6xl">
          <div className="relative py-8 sm:py-10 md:py-12">
            {/* ===== DESKTOP: imagem + nome SOBRE a imagem ===== */}
            {capa && (
              <div className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 z-[2]">
                <div
                  className="relative h-72 w-72
                            rounded-full overflow-hidden
                            bg-neutral-100
                            ring-4 ring-white ring-offset-4 ring-offset-brand-primary
                            shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)]"
                >
                  <Image src={capa.url} alt={capa.alt} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
                </div>
              </div>
            )}{" "}
            {/* <-- FECHA AQUI */}
            {/* BLOCO TEXTO */}
            <div className="hidden md:block pl-[340px] pr-4">
              <h1
                className={`${script.className} text-[64px] leading-none text-neutral-900 drop-shadow-sm mb-2`}
              >
                {animal.nome}
              </h1>
            </div>
            <div className="md:hidden px-4 text-center">
              {capa && (
                <div className="flex justify-center">
                  <div className="relative h-36 w-36 sm:h-40 sm:w-40 rounded-full overflow-hidden bg-neutral-100 ring-4 ring-white ring-offset-3 ring-offset-brand-primary shadow-[0_16px_28px_-12px_rgba(0,0,0,0.35)]">
                    <Image src={capa.url} alt={capa.alt} fill className="object-cover" />
                  </div>
                </div>
              )}

              <h1
                className={`${script.className} mt-4 text-[54px] leading-[1] tracking-tight text-neutral-900 drop-shadow-sm`}
              >
                {animal.nome}
              </h1>

              {animal.dataResgate && (
                <p className="mt-1 text-neutral-900/80">
                  Resgatado em <span className="font-semibold">{dataPt(animal.dataResgate)}</span>
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                {chip(
                  <>
                    {especieIcon} {animal.especie === "GATO" ? "Gato" : "Cachorro"}
                  </>
                )}
                {chip(<>{animal.sexo === "MACHO" ? "Macho" : "Fêmea"}</>)}
                {chip(<>Porte: {animal.porte.toLowerCase()}</>)}
                {animal.raca ? chip(<>Raça: {animal.raca}</>, "raca-m") : null}
                {animal.temperamento
                  ? chip(<>Temperamento: {animal.temperamento}</>, "temp-m")
                  : null}
              </div>
            </div>
            <div className="hidden md:block pl-[340px] pr-4">
              {animal.dataResgate && (
                <p className="mt-1 text-neutral-900/80">
                  Resgatado em <span className="font-semibold">{dataPt(animal.dataResgate)}</span>
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2 max-w-[860px]">
                {chip(
                  <>
                    {animal.especie === "GATO" ? (
                      <Cat className="h-4 w-4" />
                    ) : (
                      <Dog className="h-4 w-4" />
                    )}{" "}
                    {animal.especie === "GATO" ? "Gato" : "Cachorro"}
                  </>
                )}
                {chip(<>{animal.sexo === "MACHO" ? "Macho" : "Fêmea"}</>)}
                {chip(<>Porte: {animal.porte.toLowerCase()}</>)}
                {animal.raca ? chip(<>Raça: {animal.raca}</>, "raca") : null}
                {animal.temperamento
                  ? chip(<>Temperamento: {animal.temperamento}</>, "temp")
                  : null}
              </div>
            </div>
            {extra.length > 0 && (
              <div className="hidden md:flex justify-end gap-4 mt-6">
                {extra.map((p, i) => (
                  <div
                    key={p.id}
                    className={`relative overflow-hidden rounded-2xl bg-neutral-100
              ring-4 ring-white ring-offset-4 ring-offset-brand-primary
              shadow-[0_18px_36px_-12px_rgba(0,0,0,0.35)]
              h-36 w-28 ${i === 0 ? "rotate-[-6deg]" : "rotate-3"}`}
                  >
                    <Image src={p.url} alt={p.alt} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <svg
          className="block w-full h-[30px] sm:h-[44px] text-white"
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
        <PageBody
          animal={animal}
          fotos={fotos}
          urlRelative={urlRelative}
          shareMsg={shareMsg}
          especieIcon={especieIcon}
          chip={chip}
        />
      </Container>
    </>
  );
}

function PageBody({ animal, fotos, urlRelative, shareMsg, especieIcon, chip }: any) {
  const hasRescue =
    Boolean(animal.historiaResgate) &&
    typeof animal.historiaResgate === "string" &&
    animal.historiaResgate.trim().length > 0;

  const showFivFelv =
    animal.especie === "GATO" &&
    animal.fivFelvStatus !== null &&
    animal.fivFelvStatus !== undefined;

  const fivFelvLabel =
    animal.fivFelvStatus === "POSITIVO"
      ? "Sim, positivo"
      : animal.fivFelvStatus === "NEGATIVO"
      ? "Sim, negativo"
      : "Não testado";

  return (
    <div className="mt-12 md:mt-16 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-extrabold text-xl mb-2">Sobre mim</h2>
          <p className="text-neutral-700">
            {animal.descricao ||
              "Sou um(a) pet muito especial aguardando um lar amoroso. Pergunte mais sobre mim!"}
          </p>
        </div>

        {hasRescue && (
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <h3 className="font-bold text-lg mb-2">História do resgate</h3>
            <p className="text-neutral-700 whitespace-pre-line">{animal.historiaResgate}</p>
            {animal.temperamento ? (
              <p className="mt-3 text-sm text-neutral-600">
                <span className="font-semibold">Temperamento:</span> {animal.temperamento}
              </p>
            ) : null}
          </div>
        )}

        {animal.convivencia ? (
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <h3 className="font-bold text-lg mb-2">Convivência</h3>
            <ul className="list-disc pl-5 space-y-1 text-neutral-800">
              {animal.convivencia.split("\n").map((linha: string, i: number) => (
                <li key={i}>{linha.trim()}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {animal.saudeDetalhes || animal.vacinado || animal.castrado ? (
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <h3 className="font-bold text-lg mb-4">Saúde & cuidados</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
                <Syringe className="h-4 w-4 text-neutral-700" />
                <span className="text-sm">
                  Vacinas:{" "}
                  <span className="font-semibold">
                    {animal.vacinado ? "em dia" : "a atualizar"}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
                <Scissors className="h-4 w-4 text-neutral-700" />
                <span className="text-sm">
                  Castração:{" "}
                  <span className="font-semibold">{animal.castrado ? "sim" : "não"}</span>
                </span>
              </div>
            </div>
            {animal.saudeDetalhes ? (
              <p className="mt-3 text-sm text-neutral-700">
                <span className="font-semibold">Observações:</span> {animal.saudeDetalhes}
              </p>
            ) : null}
          </div>
        ) : null}

        {fotos.filter((f) => f.url).length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <h3 className="font-bold text-lg mb-4">Galeria de momentos</h3>
            <AnimalGallery fotos={fotos.filter((f) => f.url)} />
          </div>
        )}
      </div>

      <aside className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h3 className="font-bold mb-3">Ficha técnica</h3>
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-neutral-600">Espécie</dt>
            <dd className="flex items-center gap-1">
              {especieIcon}
              {animal.especie}
            </dd>
            <dt className="text-neutral-600">Sexo</dt>
            <dd>{animal.sexo}</dd>
            <dt className="text-neutral-600">Porte</dt>
            <dd>{animal.porte}</dd>
            <dt className="text-neutral-600">Idade</dt>
            <dd>{idadeEmTexto(animal.idadeMeses)}</dd>
            {animal.raca ? (
              <>
                <dt className="text-neutral-600">Raça</dt>
                <dd>{animal.raca}</dd>
              </>
            ) : null}

            {showFivFelv && (
              <>
                <dt className="text-neutral-600">Testado FIV/FELV</dt>
                <dd>{fivFelvLabel}</dd>
              </>
            )}
          </dl>
          <div className="mt-3 flex flex-wrap gap-2">
            {chip(
              <>
                <PawPrint className="h-4 w-4" /> Pronto para amar
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card space-y-3">
          <QRModal
            url={urlRelative}
            nome={animal.nome}
            especie={animal.especie as "GATO" | "CACHORRO"}
            sexo={animal.sexo as "MACHO" | "FEMEA"}
          >
            <button className="w-full inline-flex items-center justify-center gap-2 rounded-pill px-4 py-2 bg-white border border-neutral-200 hover:bg-neutral-50">
              Ver QR Code
            </button>
          </QRModal>
          <a
            className="w-full inline-flex items-center justify-center gap-2 rounded-pill px-4 py-2 bg-brand-secondary text-white hover:bg-brand-secondaryHover active:scale-[0.99] transition"
            href={`https://wa.me/?text=${encodeURIComponent(shareMsg)}`}
            target="_blank"
            rel="noreferrer"
          >
            <Share2 size={18} /> Compartilhar
          </a>
          <Link
            className="w-full inline-flex items-center justify-center gap-2 rounded-pill px-4 py-2 bg-brand-primary text-neutral-900 hover:bg-brand-primaryHover active:scale-[0.99] transition"
            href="/como-ajudar"
          >
            <HeartHandshake size={18} /> Apadrinhar / Doar
          </Link>
          <Link
            className="block text-center text-brand-secondary underline"
            href={{ pathname: "/adote", query: { animal: animal.id } }}
          >
            Quero adotar {animal.nome}
          </Link>
        </div>
      </aside>
    </div>
  );
}
