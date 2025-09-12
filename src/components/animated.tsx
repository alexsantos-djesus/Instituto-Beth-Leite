// src/components/animated.tsx
"use client";

import { motion, type MotionProps } from "framer-motion";
import type { PropsWithChildren, ReactNode, HTMLAttributes } from "react";

/* =========================
 * Variants
 * ========================= */
export const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

export const list = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

export const item = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 380, damping: 22 } },
};

/* =========================
 * Helpers simples
 * ========================= */
export function FadeIn({
  children,
  delay = 0,
  y = 10,
  ...rest
}: PropsWithChildren<{ delay?: number; y?: number } & MotionProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function GrowIn({
  children,
  delay = 0,
  ...rest
}: PropsWithChildren<{ delay?: number } & MotionProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  delay = 0,
  gap = 0.06,
  ...rest
}: PropsWithChildren<{ delay?: number; gap?: number } & HTMLAttributes<HTMLDivElement>>) {
  const items = Array.isArray(children) ? children : [children];
  return (
    <div {...rest}>
      {items.map((c, i) => (
        <FadeIn key={i} delay={delay + i * gap}>
          {c}
        </FadeIn>
      ))}
    </div>
  );
}

/* =========================
 * Wrappers/Blocos prontos
 * ========================= */

// Hero
export function AnimatedHero({ children, ...rest }: PropsWithChildren<MotionProps>) {
  return (
    <motion.section
      initial={{ opacity: 0, y: -30, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      {...rest}
    >
      {children}
    </motion.section>
  );
}

// KPI pronto (casa com o uso na página)
export function KpiAnimated({
  icon,
  label,
  value,
  delay = 0,
  ...rest
}: {
  icon: ReactNode;
  label: string;
  value: number | string;
  delay?: number;
} & MotionProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
      className="bg-white rounded-2xl p-5 shadow-card"
      {...rest}
    >
      <div className="flex items-center gap-2 text-neutral-700">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight">{value}</div>
    </motion.div>
  );
}

// Progress bar (aceita percent OU current/goal)
export function ProgressAnimated({
  percent,
  current,
  goal,
  className,
}: {
  percent?: number;
  current?: number;
  goal?: number;
  className?: string;
}) {
  const p =
    typeof percent === "number"
      ? percent
      : typeof current === "number" && typeof goal === "number" && goal > 0
      ? Math.round((current / goal) * 100)
      : 0;

  const clamp = Math.max(0, Math.min(100, p));

  return (
    <div className={className}>
      <div className="mt-3 h-3 rounded-full bg-neutral-100 overflow-hidden ring-1 ring-black/5">
        <motion.div
          className="h-3 bg-brand-secondary"
          initial={{ width: 0 }}
          whileInView={{ width: `${clamp}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
      <motion.div
        className="mt-1 text-right text-sm font-semibold text-neutral-700"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ delay: 0.2 }}
      >
        {clamp}%
      </motion.div>
    </div>
  );
}

// Stagger container
export function GridStagger({ children, ...rest }: PropsWithChildren<MotionProps>) {
  return (
    <motion.div
      variants={list}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid gap-6 md:grid-cols-3"
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// Card de plano com hover; intercepta 'featured' para não ir ao DOM
export function PlanoCardAnimated({
  children,
  featured, // eslint-disable-line @typescript-eslint/no-unused-vars
  className,
  ...rest
}: PropsWithChildren<{ featured?: boolean } & MotionProps & { className?: string }>) {
  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.03, rotate: -0.6 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={["rounded-2xl p-6 shadow-card", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// FAQ pronto (q/a) – casa com o uso na página
export function FaqAnimated({ q, a }: { q: string; a: string }) {
  return (
    <motion.details
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.4 }}
      className="group bg-white rounded-2xl p-5 shadow-card border border-black/5"
    >
      <summary className="cursor-pointer list-none font-semibold flex items-center justify-between">
        {q}
        <motion.span
          initial={{ rotate: 0 }}
          whileInView={{ rotate: 0 }}
          whileHover={{ rotate: 90 }}
          className="inline-block"
        >
          ▸
        </motion.span>
      </summary>
      <p className="mt-2 text-neutral-700">{a}</p>
    </motion.details>
  );
}

// Wrapper genérico para hovers de cards
export function CardHover({ children, ...rest }: PropsWithChildren<MotionProps>) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-3"
      {...rest}
    >
      {children}
    </motion.div>
  );
}
