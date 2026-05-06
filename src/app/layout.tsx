import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import type { Viewport } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://instituto-beth-leite.example"),
  title: {
    default: "Instituto Beth Leite - Adoção e Apadrinhamento",
    template: "%s | Instituto Beth Leite",
  },
  description:
    "Divulgação de animais para adoção responsável. Conheça, adote, apadrinhe e transforme vidas.",
  applicationName: "Instituto Beth Leite",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Beth Leite",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Instituto Beth Leite",
    description: "Adoção responsável e apadrinhamento de animais. Participe!",
    type: "website",
    url: "/",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#2F855A",
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
        <ServiceWorkerRegister />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
