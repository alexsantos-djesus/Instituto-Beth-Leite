"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!token) return alert("Token inválido");
    if (password.length < 6) return alert("Senha muito curta");
    if (password !== confirm) return alert("Senhas não conferem");

    setSending(true);

    const r = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    setSending(false);

    if (r.ok) setDone(true);
    else alert("Erro ao redefinir senha");
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto py-10 text-center">
        <h1 className="text-lg font-semibold">Senha redefinida</h1>
        <p className="mt-2 text-sm text-neutral-600">Você já pode fazer login com a nova senha.</p>

        <a
          href="/login"
          className="inline-block mt-6 rounded-full bg-neutral-900 text-white px-5 py-2"
        >
          Ir para login
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-lg font-semibold mb-4">Redefinir senha</h1>

      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Nova senha</label>
          <input
            type="password"
            className="w-full border rounded-xl px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Confirmar senha</label>
          <input
            type="password"
            className="w-full border rounded-xl px-3 py-2"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <button
          disabled={sending}
          className="rounded-full bg-neutral-900 text-white px-4 py-2 disabled:opacity-60"
        >
          {sending ? "Salvando…" : "Redefinir senha"}
        </button>
      </form>
    </div>
  );
}
