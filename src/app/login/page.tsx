"use client";
import { useState, useEffect } from "react";

const WHATS_LINK = "https://wa.me/5551992793931";
const WHATS_LABEL = "(51) 99279-3931";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<"login" | "register" | "forgot">("login");
  const [submitting, setSubmitting] = useState(false);

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return alert("Preencha e-mail e senha");
    setSubmitting(true);
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    setSubmitting(false);
    if (r.ok) window.location.href = "/admin";
    else alert("Login inválido");
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <div className="mb-4 flex gap-3">
        <button
          className={`px-3 py-1 rounded ${
            tab === "login" ? "bg-neutral-900 text-white" : "bg-neutral-100"
          }`}
          onClick={() => setTab("login")}
        >
          Entrar
        </button>
        <button
          className={`px-3 py-1 rounded ${
            tab === "register" ? "bg-neutral-900 text-white" : "bg-neutral-100"
          }`}
          onClick={() => setTab("register")}
        >
          Criar conta
        </button>
      </div>
      {tab === "login" ? (
        <form onSubmit={doLogin} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">E-mail</label>
            <input
              className="w-full border rounded-xl px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Senha</label>
            <input
              type="password"
              className="w-full border rounded-xl px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              disabled={submitting}
              className="rounded-full bg-neutral-900 text-white px-4 py-2 disabled:opacity-60"
            >
              {submitting ? "Entrando…" : "Entrar"}
            </button>

            <button
              type="button"
              onClick={() => setTab("forgot")}
              className="text-sm underline text-neutral-600"
            >
              Esqueci minha senha
            </button>
          </div>
        </form>
      ) : tab === "register" ? (
        <RegisterForm onSuccess={() => setTab("login")} />
      ) : (
        <ForgotPasswordForm onBack={() => setTab("login")} />
      )}
    </div>
  );
}

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institution, setInstitution] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview]
  );

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setPhoto(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim())
      return alert("Nome, e-mail e senha são obrigatórios");
    setSubmitting(true);
    const fd = new FormData();
    fd.append("name", name);
    fd.append("email", email);
    fd.append("password", password);
    fd.append("institution", institution);
    if (photo) fd.append("photo", photo);
    const r = await fetch("/api/auth/register", { method: "POST", body: fd });
    setSubmitting(false);
    if (r.ok) {
      setSent(true);
      setName("");
      setEmail("");
      setPassword("");
      setInstitution("");
      setPhoto(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      // Se preferir voltar automaticamente para a aba de login: onSuccess();
    } else {
      const d = await r.json().catch(() => ({}));
      alert(d.error || "Erro ao criar conta");
    }
  }

  return (
    <>
      <form onSubmit={submit} className="space-y-3">
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 px-3 py-2 border rounded-xl cursor-pointer">
            <span>Foto de perfil</span>
            <input type="file" accept="image/*" className="hidden" onChange={onFile} />
          </label>
          {preview ? (
            <img
              src={preview}
              className="h-12 w-12 rounded-full object-cover"
              alt="Prévia da foto"
            />
          ) : null}
        </div>
        <div>
          <label className="block text-sm font-medium">Nome</label>
          <input
            className="w-full border rounded-xl px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">E-mail</label>
          <input
            className="w-full border rounded-xl px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Instituição</label>
          <input
            className="w-full border rounded-xl px-3 py-2"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Senha</label>
          <input
            type="password"
            className="w-full border rounded-xl px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          disabled={submitting}
          className="rounded-full bg-neutral-900 text-white px-4 py-2 disabled:opacity-60"
        >
          {submitting ? "Enviando…" : "Criar conta"}
        </button>
      </form>

      {sent && (
        <div className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-amber-900 ring-1 ring-amber-200">
          <p className="font-medium">Solicitação enviada para o suporte.</p>
          <p className="text-sm mt-1">
            Caso demore a autorização, entre em contato no WhatsApp:{" "}
            <a href={WHATS_LINK} target="_blank" rel="noreferrer" className="underline">
              {WHATS_LABEL}
            </a>
            .
          </p>
        </div>
      )}
    </>
  );
}

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      alert("Informe o e-mail");
      return;
    }

    setSending(true);

    const r = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setSending(false);

    if (r.ok) setSent(true);
    else alert("Erro ao solicitar redefinição");
  }

  if (sent) {
    return (
      <div className="space-y-3">
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-emerald-900 ring-1 ring-emerald-200">
          <p className="font-medium">E-mail enviado</p>
          <p className="text-sm mt-1">
            Se o e-mail existir, você receberá instruções para redefinir a senha.
          </p>
        </div>

        <button onClick={onBack} className="text-sm underline text-neutral-600">
          Voltar para login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium">E-mail</label>
        <input
          className="w-full border rounded-xl px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          disabled={sending}
          className="rounded-full bg-neutral-900 text-white px-4 py-2 disabled:opacity-60"
        >
          {sending ? "Enviando…" : "Enviar link de redefinição"}
        </button>

        <button type="button" onClick={onBack} className="text-sm underline text-neutral-600">
          Voltar
        </button>
      </div>
    </form>
  );
}