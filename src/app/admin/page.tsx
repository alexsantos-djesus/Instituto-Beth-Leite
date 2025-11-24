"use client";
import Container from "@/components/Container";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Dog, Users2, CalendarDays, HandHeart, PawPrint } from "lucide-react";

type Me = {
  id: number | string;
  name: string;
  email: string;
  institution?: string | null;
  photoUrl?: string | null;
  role: "ADMIN" | "EDITOR";
  approved: boolean; // <- usado para bloquear painel até aprovação
};

export default function AdminDashboard() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  async function loadMe() {
    const r = await fetch("/api/auth/me", { headers: { Accept: "application/json" } });
    if (!r.ok) throw new Error("unauthorized");
    const { user } = await r.json();
    setMe({
      id: user.id,
      name: user.name ?? "Usuário",
      email: user.email,
      institution: user.institution ?? "",
      photoUrl: user.photoUrl ?? "",
      role: user.role,
      approved: Boolean(user.approved),
    });
  }

  useEffect(() => {
    (async () => {
      try {
        await loadMe();
      } catch {
        setMe(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Container className="py-10">
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <p className="text-neutral-700">Carregando…</p>
        </div>
      </Container>
    );
  }

  if (!me) {
    return (
      <Container className="py-10">
        <h1 className="text-2xl font-extrabold mb-4">Área Administrativa</h1>
        <div className="bg-white p-6 rounded-2xl shadow-card max-w-md">
          <p className="text-neutral-700 mb-4">
            Você precisa estar autenticado para acessar o painel.
          </p>
          <Link
            href="/login"
            className="inline-block rounded-full bg-neutral-900 text-white px-4 py-2"
          >
            Ir para o login
          </Link>
          <p className="text-xs text-neutral-500 mt-3">
            Qualquer problema, fale com a gente pelo Instagram: @Debuguei
          </p>
        </div>
      </Container>
    );
  }

  // BLOQUEIO: usuário logado porém não aprovado ainda
  if (!me.approved && String(me.id) !== "1") {
    return (
      <Container className="py-10">
        <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-amber-200/60 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-2.5 py-1 text-amber-900 text-sm ring-1 ring-amber-200">
            <PawPrint className="h-4 w-4" />
            <span>Cadastro pendente de aprovação</span>
          </div>
          <h1 className="mt-3 text-2xl font-semibold">Aguarde a autorização</h1>
          <p className="text-neutral-700 mt-1">
            Seu acesso ao painel será liberado após aprovação por um administrador. Caso demore, use
            o WhatsApp indicado na tela de login para falar com o suporte.
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              href="/"
              className="rounded-full bg-neutral-900 text-white px-4 py-2 inline-block"
            >
              Voltar ao site
            </Link>
            <button
              onClick={() => loadMe()}
              className="rounded-full bg-neutral-100 px-4 py-2 ring-1 ring-neutral-200 hover:bg-neutral-200"
            >
              Verificar novamente
            </button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      {/* Cabeçalho com badge e atalho de perfil */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 ring-1 ring-emerald-200 px-2.5 py-1 text-emerald-900 text-sm">
            <PawPrint className="h-4 w-4" />
            <span>
              Bem-vindo(a), {me.name} {me.role === "ADMIN" ? "• Admin" : ""}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-neutral-700 mt-1">Gerencie os dados do site.</p>
        </div>

        {/* Perfil (avatar + nome) clicável -> abre modal */}
        <button
          onClick={() => setProfileOpen(true)}
          className="group rounded-2xl bg-white p-3 shadow-card ring-1 ring-neutral-200/60 hover:shadow-md transition flex items-center gap-3"
          aria-label="Abrir perfil"
          title="Abrir perfil"
        >
          <img
            src={me.photoUrl || "/avatar-placeholder.png"}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-neutral-200"
            alt="Foto do perfil"
          />
          <div className="text-left">
            <div className="text-sm font-semibold leading-tight group-hover:underline">
              {me.name}
            </div>
            <div className="text-xs text-neutral-500">{me.email}</div>
          </div>
        </button>
      </div>

      {/* Cards principais */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashCard href="/admin/animals" title="Animais" desc="Cadastrar, editar e gerenciar fotos.">
          <Dog className="h-5 w-5" />
        </DashCard>

        {/* Usuários: só aparece para ADMIN ou usuário 1 */}
        {(me.role === "ADMIN" || String(me.id) === "1") && (
          <DashCard href="/admin/usuarios" title="Usuários" desc="Gerenciar perfis e permissões.">
            <Users2 className="h-5 w-5" />
          </DashCard>
        )}

        <DashCard href="/admin/partners" title="Parceiros" desc="Logos, links e ordem de exibição.">
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

      {/* Modal de Perfil (editar) */}
      {profileOpen && me && (
        <ProfileModal
          me={me}
          onClose={() => setProfileOpen(false)}
          onSaved={async () => {
            await loadMe();
            setProfileOpen(false);
          }}
        />
      )}
    </Container>
  );
}

/* -------------------- Components -------------------- */

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

function ProfileModal({
  me,
  onClose,
  onSaved,
}: {
  me: {
    id: number | string;
    name: string;
    email: string;
    institution?: string | null;
    photoUrl?: string | null;
  };
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(me.name || "");
  const [email, setEmail] = useState(me.email || "");
  const [institution, setInstitution] = useState(me.institution || "");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(me.photoUrl || null);
  const [saving, setSaving] = useState(false);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    if (f) {
      // validação básica (opcional)
      if (!f.type.startsWith("image/")) {
        alert("Envie uma imagem válida.");
        return;
      }
      if (f.size > 5 * 1024 * 1024) {
        alert("Arquivo muito grande. Máx 5MB.");
        return;
      }
    }
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : me.photoUrl || null);
  }

  // upload direto do client para o Cloudinary (unsigned preset)
  async function uploadToCloudinary(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: fd }
    );

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Cloudinary upload failed: ${res.status} ${text}`);
    }

    const data = await res.json();
    return data.secure_url as string;
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      let finalPhotoUrl = me.photoUrl || null;

      // 1) se houver novo arquivo, envia para Cloudinary
      if (file) {
        finalPhotoUrl = await uploadToCloudinary(file);
        // atualiza preview com a url real
        setPreview(finalPhotoUrl);
      }

      // 2) envia somente JSON ao backend (App Router)
      const payload: any = {
        name,
        email,
        institution,
      };
      if (password) payload.password = password;
      if (finalPhotoUrl) payload.photoUrl = finalPhotoUrl;

      const r = await fetch(`/api/admin/users/${me.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setSaving(false);

      if (!r.ok) {
        const d = await r
          .json()
          .catch(async () => ({ error: await r.text().catch(() => "unknown") }));
        alert(d.error || "Erro ao salvar perfil");
        return;
      }

      alert("Perfil atualizado!");
      onSaved();
    } catch (err: any) {
      console.error("save error:", err);
      setSaving(false);
      alert(err?.message || "Erro ao salvar perfil");
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl ring-1 ring-neutral-200">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold leading-none">Perfil</h2>
            <p className="text-sm text-neutral-600">Atualize sua foto, nome, login e senha.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full px-3 py-1.5 text-sm bg-neutral-100 hover:bg-neutral-200"
          >
            Fechar
          </button>
        </div>

        <form onSubmit={save} className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={preview || "/avatar-placeholder.png"}
              className="h-16 w-16 rounded-full object-cover ring-1 ring-neutral-200"
              alt="Foto do perfil"
            />
            <label className="inline-flex items-center gap-2 px-3 py-2 border rounded-xl cursor-pointer text-sm">
              <span>Alterar foto</span>
              <input type="file" accept="image/*" className="hidden" onChange={onFile} />
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input
                className="w-full border rounded-xl px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Login (e-mail)</label>
              <input
                className="w-full border rounded-xl px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Instituição</label>
              <input
                className="w-full border rounded-xl px-3 py-2"
                value={institution || ""}
                onChange={(e) => setInstitution(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Nova senha (opcional)</label>
              <input
                type="password"
                className="w-full border rounded-xl px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Deixe em branco para manter a atual"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-neutral-100 px-4 py-2 hover:bg-neutral-200"
            >
              Cancelar
            </button>
            <button
              disabled={saving}
              className="rounded-full bg-neutral-900 text-white px-5 py-2 disabled:opacity-60"
            >
              {saving ? "Salvando…" : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}