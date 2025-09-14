"use client";

import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import MobileMenuDrawer from "./MobileMenuDrawer";

export default function HeroMobileMenu() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const pathname = usePathname();
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : prev || "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setOpen(false);
      btnRef.current?.focus();
    }
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <AnimatePresence initial={false}>
        {!open && (
          <motion.button
            key="menu-btn"
            ref={btnRef}
            aria-label="Abrir menu"
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="md:hidden absolute right-4 top-4 p-2 rounded-lg bg-white/90 shadow hover:bg-white"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Menu />
          </motion.button>
        )}
      </AnimatePresence>

      <MobileMenuDrawer
        open={open}
        onClose={() => {
          setOpen(false);
          btnRef.current?.focus();
        }}
        // @ts-expect-error – id vai para o container root do drawer
        id="mobile-menu"
      />
    </>
  );
}
