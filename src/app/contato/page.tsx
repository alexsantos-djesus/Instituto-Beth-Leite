import Container from "@/components/Container";
import { ChevronDown, Mail, Instagram } from "lucide-react";

export const metadata = {
  title: "Contato — Instituto Beth Leite",
  description: "Fale conosco e confira as dúvidas frequentes (FAQ).",
};

const faq = [
  {
    q: "Como funciona o processo de adoção?",
    a: "Após enviar o formulário, nossa equipe entra em contato para uma breve entrevista e alinhamento. Em seguida, agendamos a visita e finalizamos com o termo de adoção.",
  },
  {
    q: "Posso apadrinhar sem adotar?",
    a: "Sim! No programa de apadrinhamento você contribui mensalmente para os cuidados de um animal específico.",
  },
  {
    q: "Onde ficam os animais?",
    a: "Em lares temporários e parceiros. Os encontros são agendados após a aprovação inicial.",
  },
];

export default function ContatoPage() {
  return (
    <>
      <section
        className="
          relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]
          -mt-[var(--header-h)] pt-[calc(var(--header-h)+18px)]
          bg-gradient-to-b from-[#f3c59d] via-[#fff2e3] to-[#fffcf8]
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
              📬 fale com a gente
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900">
              Contato
            </h1>
            <p className="mt-3 max-w-3xl text-neutral-700 text-lg">
              Dúvidas, sugestões ou parcerias? Escreva pra gente — será um prazer responder.
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
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <a
            href="mailto:contato@institutobethleite.org"
            className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-emerald-200/60 hover:shadow-lg transition flex items-center gap-3"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <div className="font-semibold">E-mail</div>
              <div className="text-neutral-700">contato@institutobethleite.org</div>
            </div>
          </a>

          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-emerald-200/60 hover:shadow-lg transition flex items-center gap-3"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <Instagram className="h-5 w-5" />
            </span>
            <div>
              <div className="font-semibold">Instagram</div>
              <div className="text-neutral-700">@institutobethleite</div>
            </div>
          </a>
        </div>

        <h2 className="mt-10 font-bold text-lg">FAQ</h2>
        <div className="mt-3 space-y-3">
          {faq.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl bg-white p-4 shadow-card ring-1 ring-emerald-200/60 open:ring-emerald-300/70"
            >
              <summary className="flex items-center justify-between cursor-pointer font-medium list-none">
                <span>{f.q}</span>
                <ChevronDown className="h-5 w-5 text-neutral-700 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-2 text-neutral-700">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="h-10" />
      </Container>
    </>
  );
}
