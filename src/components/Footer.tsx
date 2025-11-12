"use client";

import Link from "next/link";
import { Instagram, Mail, HeartHandshake, ArrowUp, PawPrint, ShieldCheck } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="mt-16 border-t border-yellow-400/50 bg-brand-primary text-neutral-900 relative"
    >
      <div aria-hidden className="ft-paws pointer-events-none absolute inset-0 z-0 opacity-10" />
      <style jsx>{`
        .ft-paws {
          background-image: url("/patinhas-footer.png");
          background-repeat: no-repeat;
          background-position: center calc(100% - 50px);
          background-size: clamp(1300px, 88vw, 1800px);
        }
        @media (min-width: 1024px) {
          .ft-paws {
            background-size: clamp(1350px, 88vw, 1600px);
          }
        }
      `}</style>

      <div className="container relative z-[1] max-w-6xl px-4 sm:px-6">
        <div className="py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="font-semibold text-lg flex items-center gap-2">
            <PawPrint className="h-5 w-5" />
            <span>Pronto(a) para transformar uma vida?</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/animais"
              className="rounded-full bg-neutral-900 text-white px-4 py-2 hover:bg-neutral-800 transition"
            >
              Ver animais
            </Link>
            <Link
              href="/como-ajudar"
              className="rounded-full bg-white/80 ring-1 ring-neutral-900/10 px-4 py-2 hover:bg-white transition inline-flex items-center gap-2"
            >
              <HeartHandshake className="h-4 w-4" />
              Como ajudar
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-8 md:py-10">
          <div>
            <div className="font-extrabold text-lg mb-2">Instituto Beth Leite</div>
            <p className="text-sm/6">Adoção responsável, apadrinhamento e bem-estar animal.</p>
          </div>

          <nav aria-labelledby="ft-inst" className="min-w-0">
            <h4 id="ft-inst" className="font-bold mb-2 uppercase tracking-wide text-sm">
              Institucional
            </h4>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/sobre" className="underline underline-offset-2 hover:opacity-80">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link href="/eventos" className="underline underline-offset-2 hover:opacity-80">
                  Eventos
                </Link>
              </li>
              <li>
                <Link href="/padrinhos" className="underline underline-offset-2 hover:opacity-80">
                  Padrinhos
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="ft-adote" className="min-w-0">
            <h4 id="ft-adote" className="font-bold mb-2 uppercase tracking-wide text-sm">
              Adote
            </h4>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/animais" className="underline underline-offset-2 hover:opacity-80">
                  Ver animais
                </Link>
              </li>
              <li>
                <Link href="/adote" className="underline underline-offset-2 hover:opacity-80">
                  Formulário de interesse
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="ft-ajuda" className="min-w-0">
            <h4 id="ft-ajuda" className="font-bold mb-2 uppercase tracking-wide text-sm">
              Contato & Ajuda
            </h4>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/como-ajudar" className="underline underline-offset-2 hover:opacity-80">
                  Como ajudar
                </Link>
              </li>
              <li>
                <Link href="/contato" className="underline underline-offset-2 hover:opacity-80">
                  FAQ e contato
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contato@institutobethleite.com.br"
                  className="underline underline-offset-2 hover:opacity-80 inline-flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  contato@institutobethleite.com.br
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-yellow-400/50 py-4 text-sm">
          <p>© {year} Instituto Beth Leite. Todos os direitos reservados.</p>

          <span className="opacity-80">
            Desenvolvido por{" "}
            <a
              href="https://instagram.com/debuguei"
              target="_blank"
              rel="noreferrer"
              className="underline font-medium hover:opacity-80"
            >
              Debuguei
            </a>
          </span>

          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/institutobethleite"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram do Instituto Beth Leite"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/70 ring-1 ring-black/10 px-3 py-1 hover:bg-white transition"
            >
              <Instagram className="h-4 w-4" />
              <span className="hidden sm:inline">Instagram</span>
            </a>

            {/* Botão Admin estilizado */}
            <Link
              href="/admin"
              aria-label="Ir para o painel administrativo"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium
                         bg-gradient-to-r from-neutral-900 to-neutral-700 text-white
                         shadow-sm ring-1 ring-black/10 hover:brightness-110 active:brightness-95 transition"
            >
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 text-white px-3 py-1 hover:bg-neutral-800 transition"
              aria-label="Voltar ao topo"
            >
              <ArrowUp className="h-4 w-4" />
              <span className="hidden sm:inline">Topo</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
