// src/app/como-ajudar/ComoAjudarClient.tsx
"use client";

import Link from "next/link";
import Container from "@/components/Container";
import {
  HeartHandshake,
  PiggyBank,
  CreditCard,
  PawPrint,
  Users,
  Home,
  Gift,
  MapPin,
  Phone,
  Mail,
  Instagram,
  CalendarDays,
  Truck,
} from "lucide-react";
import { motion } from "framer-motion";

// variantes
const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };
const list = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 380, damping: 22 } },
};

export default function ComoAjudarClient() {
  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: -30, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="
          relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]
          -mt-[var(--header-h)] pt-[calc(var(--header-h)+10px)]
          bg-gradient-to-b from-[#63ffed] via-[#CFF6F0] to-[#f1fffc]
          overflow-hidden
        "
      >
        {/* fundo “vivo” */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.16] md:opacity-[0.18] mix-blend-multiply"
          style={{
            backgroundImage: "url('/patinhas.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "clamp(240px, 65vmin, 700px) auto",
            backgroundPosition: "right -8px top -8px",
          }}
          animate={{ backgroundPositionX: ["-8px", "4px", "-8px"] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(1100px 450px at 25% 0%, rgba(255,255,255,0.28), rgba(255,255,255,0) 60%)",
          }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <Container>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="py-10 sm:py-14"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">Como Ajudar</h1>
            <p className="mt-2 max-w-2xl text-neutral-900/80">
              Existem muitas formas de transformar a vida dos nossos resgatados: doando,
              apadrinhando, sendo voluntário ou ajudando na logística. Escolha a que combina com
              você 💛
            </p>

            <motion.div
              className="mt-5 flex flex-wrap gap-3"
              variants={list}
              initial="hidden"
              animate="show"
            >
              <motion.a
                variants={item}
                href="https://wa.me/5551992545499?text=Quero%20ajudar%20o%20Instituto%20Beth%20Leite%20%F0%9F%90%BE"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-pill px-4 py-2 bg-brand-secondary text-white hover:bg-brand-secondaryHover"
              >
                <HeartHandshake size={18} />
                Falar no WhatsApp
              </motion.a>

              <motion.div variants={item}>
                <Link
                  href="/padrinhos"
                  className="inline-flex items-center gap-2 rounded-pill px-4 py-2 bg-white border border-black/10 hover:bg-neutral-50"
                >
                  <PawPrint size={18} />
                  Ver apadrinhamento
                </Link>
              </motion.div>

              <motion.div variants={item}>
                <Link
                  href="/adote"
                  className="inline-flex items-center gap-2 rounded-pill px-4 py-2 bg-brand-primary text-neutral-900 hover:bg-brand-primaryHover"
                >
                  <Home size={18} />
                  Quero adotar
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </Container>

        <svg
          className="block w-full h-[30px] sm:h-[44px] text-white"
          viewBox="0 0 1440 64"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32 C240,64 480,0 720,16 C960,32 1200,80 1440,32 L1440,64 L0,64 Z"
            fill="currentColor"
          />
        </svg>
      </motion.section>

      <Container>
        <div className="grid lg:grid-cols-3 gap-6 mt-10">
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card"
          >
            <div className="flex items-center gap-3">
              <PiggyBank className="h-5 w-5 text-neutral-700" />
              <h2 className="text-xl font-bold">Doe agora</h2>
            </div>

            <motion.div
              variants={list}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="mt-4 grid sm:grid-cols-2 gap-4"
            >
              <motion.div
                variants={item}
                className="rounded-xl border border-neutral-200 p-4 bg-neutral-50"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <CreditCard className="h-4 w-4" />
                  Pix / Transferência
                </div>
                <ul className="mt-2 text-sm text-neutral-700 space-y-1">
                  <li>
                    <span className="font-medium">Chave Pix:</span>{" "}
                    <span className="select-all">pix@institutobethleite.org</span>
                  </li>
                  <li>
                    <span className="font-medium">CNPJ:</span> 00.000.000/0001-00
                  </li>
                  <li>
                    <span className="font-medium">Banco:</span> 000 — Banco Exemplo
                  </li>
                  <li>
                    <span className="font-medium">Agência:</span> 0000 |
                    <span className="font-medium"> Conta:</span> 00000-0
                  </li>
                </ul>

                <div className="mt-3 flex flex-wrap gap-2">
                  <motion.a
                    href="https://wa.me/5551992545499?text=Enviei%20uma%20doa%C3%A7%C3%A3o%20%F0%9F%92%9A"
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 rounded-pill px-3 py-1.5 bg-brand-secondary text-white hover:bg-brand-secondaryHover text-sm"
                  >
                    <HeartHandshake size={16} />
                    Avisar no WhatsApp
                  </motion.a>
                  <motion.a
                    href="mailto:contato@institutobethleite.com.br?subject=Comprovante%20de%20doa%C3%A7%C3%A3o"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 rounded-pill px-3 py-1.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-sm"
                  >
                    <Mail size={16} />
                    Enviar comprovante por e-mail
                  </motion.a>
                </div>
              </motion.div>

              <motion.div
                variants={item}
                className="rounded-xl border border-neutral-200 p-4 bg-neutral-50"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Gift className="h-4 w-4" />
                  Itens que mais precisamos
                </div>
                <ul className="mt-2 text-sm text-neutral-700 grid grid-cols-2 gap-x-4 gap-y-1">
                  <li>Ração cães/gatos</li>
                  <li>Areia higiênica</li>
                  <li>Medicamentos básicos</li>
                  <li>Tapetes higiênicos</li>
                  <li>Produtos de limpeza</li>
                  <li>Camitas/cobertores</li>
                </ul>
                <p className="mt-2 text-xs text-neutral-600">
                  Você pode entregar nos pontos de coleta ou combinar retirada conosco.
                </p>
              </motion.div>
            </motion.div>
          </motion.section>

          <motion.aside
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="bg-white rounded-2xl p-6 shadow-card"
          >
            <h3 className="font-bold mb-3">Fale conosco</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-neutral-700" />
                <a href="https://wa.me/5551992545499" target="_blank" className="hover:underline">
                  (51) 99254-5499
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-neutral-700" />
                <a href="mailto:contato@institutobethleite.com.br" className="hover:underline">
                  contato@institutobethleite.com.br
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-neutral-700" />
                <a
                  href="https://instagram.com/institutobethleite"
                  target="_blank"
                  className="hover:underline"
                >
                  @institutobethleite
                </a>
              </li>
            </ul>

            <div className="mt-4 rounded-xl border border-neutral-200 p-4 bg-neutral-50">
              <div className="flex items-center gap-2 font-semibold">
                <CalendarDays className="h-4 w-4" />
                Quer fazer uma campanha?
              </div>
              <p className="mt-1 text-sm text-neutral-700">
                Empresas, escolas e condomínios podem organizar arrecadações e mutirões. Fale com a
                gente para combinarmos! 💬
              </p>
            </div>
          </motion.aside>
        </div>

        {/* Quadros com hover e stagger */}
        <motion.div
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatedCard
            icon={<PawPrint className="h-5 w-5" />}
            title="Apadrinhamento"
            body={
              <ul className="list-disc pl-5 text-neutral-700 space-y-1">
                <li>Ajude mensalmente um animal específico</li>
                <li>Receba notícias e fotos do afilhado</li>
                <li>Transparência dos custos</li>
              </ul>
            }
            cta={
              <Link
                href="/padrinhos"
                className="inline-flex items-center gap-2 rounded-pill px-3 py-1.5 bg-brand-primary text-neutral-900 hover:bg-brand-primaryHover"
              >
                <HeartHandshake size={16} />
                Quero apadrinhar
              </Link>
            }
          />

          <AnimatedCard
            icon={<Users className="h-5 w-5" />}
            title="Voluntariado"
            body={
              <ul className="list-disc pl-5 text-neutral-700 space-y-1">
                <li>Eventos e feirinhas de adoção</li>
                <li>Redes sociais e fotografia</li>
                <li>Lar temporário / socialização</li>
              </ul>
            }
            cta={
              <a
                href="https://wa.me/5551992545499?text=Quero%20ser%20volunt%C3%A1rio%28a%29"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-pill px-3 py-1.5 bg-white border border-neutral-200 hover:bg-neutral-50"
              >
                <Users size={16} />
                Me inscrever
              </a>
            }
          />

          <AnimatedCard
            icon={<MapPin className="h-5 w-5" />}
            title="Pontos de coleta"
            body={
              <p className="text-neutral-700">
                Em breve, lista de parceiros pela cidade para receber doações físicas. Quer ser um
                ponto? Fale conosco!
              </p>
            }
            cta={
              <a
                href="https://wa.me/5551992545499?text=Quero%20ser%20ponto%20de%20coleta"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-pill px-3 py-1.5 bg-white border border-neutral-200 hover:bg-neutral-50"
              >
                <MapPin size={16} />
                Quero ser parceiro
              </a>
            }
          />

          <AnimatedCard
            icon={<Truck className="h-5 w-5" />}
            title="Apoie a logística"
            body={
              <ul className="list-disc pl-5 text-neutral-700 space-y-1">
                <li>Transporte a clínicas e lares temporários</li>
                <li>Doação de combustível ou corridas</li>
                <li>Divulgação das ações</li>
              </ul>
            }
            cta={
              <a
                href="https://wa.me/5551992545499?text=Quero%20ajudar%20na%20log%C3%ADstica"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-pill px-3 py-1.5 bg-brand-secondary text-white hover:bg-brand-secondaryHover"
              >
                <Truck size={16} />
                Posso ajudar!
              </a>
            }
          />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className="mt-10 bg-white rounded-2xl p-6 shadow-card"
        >
          <div className="flex items-center gap-3">
            <Gift className="h-5 w-5 text-neutral-700" />
            <h3 className="text-lg font-bold">Lista rápida do mês</h3>
          </div>
          <motion.div
            variants={list}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-3 flex flex-wrap gap-2"
          >
            {[
              "Ração filhotes",
              "Areia higiênica",
              "Vermífugo",
              "Antipulgas",
              "Tapete higiênico",
              "Shampoo neutro",
              "Desinfetante pet",
              "Sachês úmidos",
            ].map((itemLabel) => (
              <motion.span
                key={itemLabel}
                variants={itemVariants}
                className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm text-neutral-800"
              >
                {itemLabel}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-8 mb-4 text-center text-sm text-neutral-600"
        >
          Obrigado por apoiar o Instituto Beth Leite. Toda contribuição vira cuidado, tratamento e
          amor aos nossos resgatados. 💛
        </motion.div>
      </Container>
    </>
  );
}

// ===== componentes =====

const itemVariants = item;

function AnimatedCard({
  icon,
  title,
  body,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
  cta?: React.ReactNode;
}) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.03, rotate: -0.6 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="bg-white rounded-2xl p-6 shadow-card"
    >
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-brand-primary/70 flex items-center justify-center">
          <span className="text-neutral-900">{icon}</span>
        </div>
        <h3 className="font-bold">{title}</h3>
      </div>
      <div className="mt-3">{body}</div>
      {cta ? <div className="mt-4">{cta}</div> : null}
    </motion.div>
  );
}
