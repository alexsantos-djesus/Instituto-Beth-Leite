// NADA de "use client" aqui
import type { Metadata } from "next";
import ComoAjudarClient from "./ComoAjudarClient";

export const metadata: Metadata = {
  title: "Como Ajudar — Instituto Beth Leite",
  description:
    "Doe via Pix, apadrinhe um animal, seja voluntário ou entregue itens nos pontos de coleta. Toda ajuda muda vidas por aqui.",
};

export default function Page() {
  return <ComoAjudarClient />;
}
