// src/components/HeroSection.tsx
"use client";

import Image from "next/image";
import Container from "@/components/Container";
import Brand from "@/components/Brand";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

type Props = {
  imageSrc?: string;
  imageAlt?: string;
};

function CountUp({ to, label }: { to: number; label: string }) {
  const mv = useMotionValue(0);

  // formata enquanto anima (aqui já arredonda e põe separador)
  const shown = useTransform(mv, (v) => Math.floor(v).toLocaleString("pt-BR"));

  useEffect(() => {
    const controls = animate(mv, to, {
      duration: 1.2,
      ease: "easeOut",
    });
    return controls.stop; // cleanup
  }, [to, mv]);

  return (
    <div>
      <motion.div className="text-2xl font-extrabold text-neutral-900">{shown}</motion.div>
      <div className="text-xs text-neutral-600">{label}</div>
    </div>
  );
}

export default function HeroSection({
  imageSrc = "/Logo.png",
  imageAlt = "Instituto Beth Leite",
}: Props) {
  return (
    <section className="relative overflow-hidden">
      {/* BACKDROP COM LUZES FLOTUANTES */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-soft via-white to-white" />
        <motion.div
          className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-brand-secondary/20 blur-3xl"
          animate={{ y: [0, -18, 0], x: [0, 6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-brand-primary/30 blur-3xl"
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          {/* LADO ESQUERDO */}
          <motion.div
            className="space-y-6 order-1 md:order-1 text-center md:text-left"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              className="hidden md:inline-flex items-center gap-2 rounded-full bg-brand-secondary/10 px-3 py-1 text-xs font-medium text-brand-secondary ring-1 ring-brand-secondary/20"
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              ❤️ adoção responsável
            </motion.div>

            <h1 className="leading-tight">
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.55, ease: "easeOut" }}
                className="inline-block"
              >
                <Brand variant="hero" />
              </motion.span>
            </h1>

            <div className="md:hidden flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  width={420}
                  height={420}
                  priority
                  className="w-56 sm:w-72 h-auto rounded-2xl shadow-xl"
                />
              </motion.div>
            </div>

            <motion.p
              className="text-neutral-700 text-lg"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              Adoção responsável muda histórias. Encontre seu novo melhor amigo ou torne-se padrinho
              de um animal que precisa de você.
            </motion.p>

            {/* Counters animados */}
            <motion.div
              className="grid grid-cols-3 max-w-xs mx-auto md:mx-0 gap-4 text-center"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <CountUp to={100} label="adoções" />
              <CountUp to={16000} label="Castrações" />
              <CountUp to={20} label="resgates/mês" />
            </motion.div>
          </motion.div>

          {/* LADO DIREITO (IMAGEM) */}
          <motion.div
            className="hidden md:block order-2 md:order-2 relative"
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[2rem] bg-brand-secondary/20 blur-2xl" />
            <motion.div
              whileHover={{ scale: 1.02, rotate: -0.5 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={720}
                height={720}
                priority
                sizes="(max-width: 768px) 90vw, 640px"
                className="mx-auto w-full max-w-lg rounded-3xl shadow-xl"
              />
            </motion.div>

            {/* “Patas” decorativas flutuando sutilmente (opcionais) */}
            <motion.img
              src="/patinhas.png"
              alt=""
              aria-hidden
              className="absolute -right-8 -bottom-8 w-28 opacity-25"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
