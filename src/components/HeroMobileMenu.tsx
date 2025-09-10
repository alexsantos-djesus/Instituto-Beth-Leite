"use client";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import MobileMenuDrawer from "./MobileMenuDrawer";

export default function HeroMobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        aria-label="Abrir menu"
        onClick={() => setOpen(true)}
        className="md:hidden absolute right-4 top-4 p-2 rounded-lg bg-white/90 shadow hover:bg-white"
      >
        <Menu />
      </button>
      <MobileMenuDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
