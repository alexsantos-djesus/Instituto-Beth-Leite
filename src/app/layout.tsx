import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Instituto Beth Leite — Adoção e Apadrinhamento",
  description:
    "Divulgação de animais para adoção responsável. Conheça, adote, apadrinhe e transforme vidas.",
  openGraph: {
    title: "Instituto Beth Leite",
    description: "Adoção responsável e apadrinhamento de animais. Participe!",
    type: "website",
    url: "https://instituto-beth-leite.example",
  },
  icons: { icon: "/favicon.ico" },
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preload" href="/cursors/paw-default.png" as="image" />
        <link rel="preload" href="/cursors/paw-pointer.png" as="image" />
        <link rel="preload" href="/patinhas.png" as="image" />
      </head>
      <body className={`${inter.className} min-h-[100dvh] flex flex-col bg-neutral-50 text-neutral-900`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
