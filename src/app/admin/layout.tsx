"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Container from "@/components/Container";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/animals", label: "Animais" },
  { href: "/admin/partners", label: "Parceiros" },
  { href: "/admin/events", label: "Eventos" },
  { href: "/admin/como-ajudar", label: "Como Ajudar" },
  { href: "/admin/solicitacoes", label: "Solicitações" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    router.replace("/admin");
    router.refresh();
  }

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
              {links.map((l) => {
                const active =
                  pathname === l.href || (l.href !== "/admin" && pathname.startsWith(l.href));
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full px-2.5 py-1.5 text-xs sm:px-3 sm:text-sm transition
                      ${
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
