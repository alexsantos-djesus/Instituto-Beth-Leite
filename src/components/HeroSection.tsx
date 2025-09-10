import Image from "next/image";
import Container from "@/components/Container";
import Brand from "@/components/Brand";

type Props = {
  imageSrc?: string;
  imageAlt?: string;
};

export default function HeroSection({
  imageSrc = "/Logo.png",
  imageAlt = "Instituto Beth Leite",
}: Props) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-soft via-white to-white" />
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-brand-secondary/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-brand-primary/30 blur-3xl" />
      </div>

      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <div className="space-y-6 order-1 md:order-1 text-center md:text-left">
            <div className="hidden md:inline-flex items-center gap-2 rounded-full bg-brand-secondary/10 px-3 py-1 text-xs font-medium text-brand-secondary ring-1 ring-brand-secondary/20">
              ❤️ adoção responsável
            </div>

            <h1 className="leading-tight">
              <Brand variant="hero" />
            </h1>

            <div className="md:hidden flex justify-center">
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={420}
                height={420}
                priority
                className="w-56 sm:w-72 h-auto rounded-2xl shadow-xl"
              />
            </div>

            <p className="text-neutral-700 text-lg">
              Adoção responsável muda histórias. Encontre seu novo melhor amigo ou torne-se padrinho
              de um animal que precisa de você.
            </p>

            <div className="grid grid-cols-3 max-w-xs mx-auto md:mx-0 gap-4 text-center">
              <div>
                <div className="text-2xl font-extrabold text-neutral-900">+100</div>
                <div className="text-xs text-neutral-600">adoções</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-neutral-900">+16 Mil</div>
                <div className="text-xs text-neutral-600">Castrações</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-neutral-900">+20</div>
                <div className="text-xs text-neutral-600">resgates/mês</div>
              </div>
            </div>
          </div>

          <div className="hidden md:block order-2 md:order-2 relative">
            <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[2rem] bg-brand-secondary/20 blur-2xl" />
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={720}
              height={720}
              priority
              sizes="(max-width: 768px) 90vw, 640px"
              className="mx-auto w-full max-w-lg rounded-3xl shadow-xl"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
