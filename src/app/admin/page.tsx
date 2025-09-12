"use client";
import Container from "@/components/Container";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Dog, Users2, CalendarDays, HandHeart, PawPrint } from "lucide-react";

function toast(msg: string, type: "success" | "error" = "success") {
  const el = document.createElement("div");
  el.textContent = msg;
  el.className =
    "fixed top-4 right-4 z-[9999] rounded-lg px-4 py-2 shadow-md text-white " +
    (type === "success" ? "bg-emerald-600" : "bg-rose-600");
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.transition = "opacity .3s";
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 300);
  }, 2200);
}

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");

  async function check() {
    try {
      const r = await fetch("/api/admin/requests", { headers: { Accept: "application/json" } });
      const ok = r.ok && (r.headers.get("content-type") || "").includes("application/json");
      setAuthed(ok);
    } catch {
      setAuthed(false);
    }
  }
  useEffect(() => {
    check();
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    if (!pwd.trim()) return toast("Digite a senha.", "error");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pwd }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return toast(data?.error || "Senha inválida", "error");
    }
    toast("Login realizado!", "success");
    setTimeout(() => window.location.reload(), 400);
  }

  if (!authed) {
    return (
      <Container className="py-10">
        <h1 className="text-2xl font-extrabold mb-4">Área Administrativa</h1>
        <div className="bg-white p-6 rounded-2xl shadow-card max-w-md">
          <p className="text-neutral-700 mb-4">
            Bem-vindo(a) ao painel do Instituto Beth Leite.
            <br />
            Entre com a senha do administrador para continuar.
          </p>
          <form onSubmit={login}>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input
              className="w-full border rounded-xl px-3 py-2 mb-3"
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="••••••••"
            />
            <button className="rounded-full bg-neutral-900 text-white px-4 py-2">Entrar</button>
          </form>
          <p className="text-xs text-neutral-500 mt-3">
            Qualquer problema, fale com a gente pelo Instagram: @Debuguei
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 ring-1 ring-emerald-200 px-2.5 py-1 text-emerald-900 text-sm">
          <PawPrint className="h-4 w-4" />
          <span>Bem-vindo(a) ao painel admin</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Dashboard</h1>
        <p className="text-neutral-700 mt-1">
          Gerencie os dados do site. Em caso de dúvidas, fale com a equipe no Instagram.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashCard href="/admin/animals" title="Animais" desc="Cadastrar, editar e gerenciar fotos.">
          <Dog className="h-5 w-5" />
        </DashCard>
        <DashCard
          href="/admin/partners"
          title="Parceiros"
          desc="Logos, links e ordem de exibição."
        >
          <Users2 className="h-5 w-5" />
        </DashCard>
        <DashCard href="/admin/events" title="Eventos" desc="Feiras e ações do instituto.">
          <CalendarDays className="h-5 w-5" />
        </DashCard>
        <DashCard
          href="/admin/como-ajudar"
          title="Como Ajudar"
          desc="Pix, itens, pontos de coleta."
        >
          <HandHeart className="h-5 w-5" />
        </DashCard>
        <DashCard href="/admin/solicitacoes" title="Solicitações" desc="Formulários de interesse.">
          <PawPrint className="h-5 w-5" />
        </DashCard>
      </div>
    </Container>
  );
}

function DashCard({
  href,
  title,
  desc,
  children,
}: {
  href: string;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl bg-white p-5 shadow-card ring-1 ring-neutral-200/60 hover:shadow-md transition"
    >
      <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-2.5 py-1 text-sm">
        {children}
        <span className="font-semibold">{title}</span>
      </div>
      <p className="mt-2 text-neutral-700">{desc}</p>
      <div className="mt-3 text-sm text-neutral-500 group-hover:text-neutral-700">Abrir →</div>
    </Link>
  );
}
