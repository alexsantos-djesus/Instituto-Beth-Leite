import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-3xl font-extrabold">Página não encontrada</h1>
      <p className="mt-3 text-neutral-600">O conteúdo que você procura não existe ou foi movido.</p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-800"
      >
        Voltar para a página inicial
      </Link>
    </main>
  );
}
