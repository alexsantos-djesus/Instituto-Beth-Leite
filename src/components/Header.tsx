"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Facebook, Instagram, Twitter } from "lucide-react";
import Brand from "./Brand";
import MobileMenuDrawer from "./MobileMenuDrawer";

export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const DesktopNav = () => (
    <nav className="hidden md:flex items-center gap-1">
      {[
        ["/animais", "Animais"],
        ["/como-ajudar", "Como Ajudar"],
        ["/padrinhos", "Padrinhos"],
        ["/eventos", "Eventos"],
        ["/sobre", "Sobre"],
        ["/contato", "Contato"],
      ].map(([href, label]) => (
        <Link
          key={href}
          href={href}
          className={`px-3 py-2 rounded-pill hover:bg-neutral-100 ${
            path === href ? "font-bold" : ""
          }`}
        >
          {label}
        </Link>
      ))}
      <Link
        href="/adote"
        className="ml-2 px-4 py-2 rounded-pill bg-brand-secondary text-white hover:bg-brand-secondaryHover"
      >
        Adote
      </Link>
    </nav>
  );

  return (
    <>
      <header role="banner" className="relative z-50 w-full bg-transparent">
        <div className="container max-w-6xl px-4 sm:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={() => setOpen((v) => !v)}
              className="md:hidden -ml-2 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <div
                className={`transition-transform duration-300 ease-out ${
                  open ? "rotate-90 scale-90" : ""
                }`}
              >
                {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </div>
            </button>

            <Link href="/" className="flex items-center gap-2" aria-label="Instituto Beth Leite">
              <Image
                src="/Logo.png"
                alt="Logo Instituto Beth Leite"
                width={34}
                height={34}
                className="h-8 w-8 rounded-md object-cover"
                priority
              />
              <span className="hidden md:inline-block">
                <Brand variant="header" />
              </span>
              <span className="md:hidden sr-only">Instituto Beth Leite</span>
            </Link>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <a href="#" aria-label="Facebook" className="p-2 hover:opacity-80">
              <Facebook className="h-5 w-5 text-neutral-800" />
            </a>
            <a href="#" aria-label="Instagram" className="p-2 hover:opacity-80">
              <Instagram className="h-5 w-5 text-neutral-800" />
            </a>
            <a href="#" aria-label="Twitter" className="p-2 hover:opacity-80">
              <Twitter className="h-5 w-5 text-neutral-800" />
            </a>
          </div>

          <DesktopNav />
        </div>
      </header>

      <MobileMenuDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
