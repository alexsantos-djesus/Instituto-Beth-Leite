"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Container from "@/components/Container";
import { PawPrint } from "lucide-react";

const WHATS_LINK = "https://wa.me/5599999999999"; // ajuste
const WHATS_LABEL = "(99) 99999-9999"; // ajuste

type Me = {
  id: number | string;
  name: string;
  email: string;
  role: "ADMIN" | "EDITOR" | "USER";
  approved: boolean;
};

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/usuarios", label: "Usuários" },
  { href: "/admin/animals", label: "Animais" },
  { href: "/admin/partners", label: "Parceiros" },
  { href: "/admin/events", label: "Eventos" },
  { href: "/admin/como-ajudar", label: "Como Ajudar" },
  { href: "/admin/solicitacoes", label: "Solicitações" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        fetch("/api/db/ping", { cache: "no-store" }).catch(() => {});
        const r = await fetch("/api/auth/me", { headers: { Accept: "application/json" } });
        if (!r.ok) throw new Error();
        const d = await r.json();
        setMe(d.user);
      } catch {
        setMe(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
    // zera estado do app
    router.replace("/login");
    router.refresh();
  }

  // Carregando: evita flicker
  if (loading) {
    return (
      <Container className="py-10">
        <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-neutral-200/60">
          Carregando…
        </div>
      </Container>
    );
  }

  // Não logado: empurra pro login (ou mostra CTA simples)
  if (!me) {
    return (
      <Container className="py-10">
        <div className="bg-white p-6 rounded-2xl shadow-card ring-1 ring-neutral-200/60 max-w-md">
          <p className="mb-4">Você precisa estar autenticado para acessar o painel.</p>
          <Link
            href="/login"
            className="inline-block rounded-full bg-neutral-900 text-white px-4 py-2"
          >
            Ir para login
          </Link>
        </div>
      </Container>
    );
  }

  // BLOQUEIO: sem aprovação (e não é o superadmin id=1) → não mostra NAV, só o aviso
  if (!me.approved && String(me.id) !== "1") {
    return (
      <Container className="py-10">
        <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-amber-200/60 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-2.5 py-1 text-amber-900 text-sm ring-1 ring-amber-200">
            <PawPrint className="h-4 w-4" />
            <span>Cadastro pendente de aprovação</span>
          </div>
          <h1 className="mt-3 text-2xl font-semibold">Aguarde a autorização</h1>
          <p className="text-neutral-700 mt-1">
            Seu acesso ao painel será liberado após aprovação por um administrador. Caso demore,
            fale com a gente no WhatsApp:&nbsp;
            <a href={WHATS_LINK} className="underline" target="_blank" rel="noreferrer">
              {WHATS_LABEL}
            </a>
            .
          </p>
          <div className="mt-4 flex gap-2">
            <Link href="/" className="rounded-full bg-neutral-900 text-white px-4 py-2">
              Voltar ao site
            </Link>
            <button
              onClick={() => location.reload()}
              className="rounded-full bg-neutral-100 px-4 py-2 ring-1 ring-neutral-200 hover:bg-neutral-200"
            >
              Verificar novamente
            </button>
            <button
              onClick={logout}
              className="rounded-full bg-neutral-100 px-4 py-2 ring-1 ring-neutral-200 hover:bg-neutral-200 ml-auto"
            >
              Sair
            </button>
          </div>
        </div>
      </Container>
    );
  }

  // APROVADO (ou superadmin id=1): mostra NAV + conteúdo
  return (
    <>
      <div className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <Container className="py-2 sm:py-3">
          <div className="grid grid-cols-2 items-center gap-2 sm:flex sm:items-center sm:justify-between">
            <div className="font-extrabold tracking-tight">Painel • IBL</div>

            <button
              onClick={logout}
              className="justify-self-end rounded-full bg-neutral-800 text-white px-3 py-1.5 text-sm hover:bg-neutral-900 sm:hidden"
            >
              Sair
            </button>

            <nav
              className="col-span-2 -mx-2 px-2 sm:mx-0 sm:px-0 mt-2 sm:mt-0 flex gap-2 overflow-x-auto whitespace-nowrap"
              aria-label="Navegação do painel"
            >
              {LINKS.filter((l) => {
                // "Usuários" só para ADMIN/EDITOR ou superadmin
                if ( l.href === "/admin/usuarios" && !(me.role === "ADMIN" || String(me.id) === "1")) {
                  return false;
                }
                return true;
              }).map((l) => {
                const active =
                  pathname === l.href || (l.href !== "/admin" && pathname.startsWith(l.href));
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full px-2.5 py-1.5 text-xs sm:px-3 sm:text-sm transition ${
                      active ? "bg-neutral-900 text-white" : "bg-neutral-100 hover:bg-neutral-200"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={logout}
              className="hidden sm:inline-flex rounded-full bg-neutral-800 text-white px-3 py-1.5 text-sm hover:bg-neutral-900"
            >
              Sair
            </button>
          </div>
        </Container>
      </div>

      <main>{children}</main>
    </>
  );
}
