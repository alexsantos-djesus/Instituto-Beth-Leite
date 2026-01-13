"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!token) {
    return <p>Token inválido ou ausente.</p>;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!password || password !== confirm) {
      alert("As senhas não conferem");
      return;
    }

    setLoading(true);

    const r = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    setLoading(false);

    if (r.ok) setDone(true);
    else alert("Erro ao redefinir senha");
  }

  if (done) {
    return (
      <div className="text-center">
        <h1 className="text-lg font-semibold">Senha redefinida</h1>
        <p className="mt-2 text-sm text-neutral-600">Você já pode fazer login com a nova senha.</p>
        <a
          href="/login"
          className="inline-block mt-4 rounded-full bg-neutral-900 text-white px-5 py-2"
        >
          Ir para login
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto space-y-3">
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
        disabled={loading}
        className="rounded-full bg-neutral-900 text-white px-4 py-2 disabled:opacity-60"
      >
        {loading ? "Salvando…" : "Redefinir senha"}
      </button>
    </form>
  );
}
