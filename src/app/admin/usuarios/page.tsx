"use client";
import Container from "@/components/Container";
import { useEffect, useState } from "react";

type Role = "ADMIN" | "EDITOR" | "USER";

type User = {
  id: number;
  name: string;
  email: string;
  institution?: string | null;
  photoUrl?: string | null;
  role: Role;
  approved: boolean;
  active: boolean;
};

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [me, setMe] = useState<User | null>(null);
  const [editing, setEditing] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const meRes = await fetch("/api/auth/me");
    if (meRes.ok) {
      const j = await meRes.json();
      setMe(j.user);
    }

    const r = await fetch("/api/admin/users");
    if (r.ok) {
      const j = await r.json();
      const list: User[] = (j.users || []).sort(
        (a: User, b: User) => Number(a.approved) - Number(b.approved)
      );
      setUsers(list);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function open(u: User) {
    setEditing(u);
  }

  async function save(fd: FormData) {
    if (!editing) return;
    const r = await fetch(`/api/admin/users/${editing.id}`, { method: "PATCH", body: fd });
    if (r.ok) {
      setEditing(null);
      load();
    } else {
      const d = await r.json().catch(() => ({}));
      alert(d.error || "Erro ao salvar");
    }
  }

  async function approve(u: User) {
    const r = await fetch(`/api/admin/users/${u.id}/approve`, { method: "POST" });
    if (r.ok) load();
    else {
      const d = await r.json().catch(() => ({}));
      alert(d.error || "Erro ao aprovar");
    }
  }

  async function toggleAdmin(u: User) {
    if (me?.id !== 1) return alert("Somente o Usuário 1 pode alterar papéis.");
    if (u.id === 1) return alert("Você não pode alterar o seu próprio papel.");
    const role: Role = u.role === "ADMIN" ? "EDITOR" : "ADMIN";
    const r = await fetch(`/api/admin/users/${u.id}/role`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (r.ok) load();
    else {
      const d = await r.json().catch(() => ({}));
      alert(d.error || "Erro ao alterar papel");
    }
  }

  if (loading) {
    return (
      <Container className="py-10">
        <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-neutral-200/60">
          Carregando…
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Usuários</h1>
        <span className="text-sm text-neutral-600">
          {users.filter((u) => !u.approved).length} pendente(s)
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u) => (
          <div
            key={u.id}
            className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-neutral-200/60"
          >
            <div className="flex items-center gap-3">
              <img
                src={u.photoUrl || "/avatar-placeholder.png"}
                alt={u.name}
                className="h-10 w-10 rounded-full object-cover ring-1 ring-neutral-200"
              />
              <div className="min-w-0">
                <div className="font-medium truncate">{u.name}</div>
                <div className="text-xs text-neutral-500 truncate">{u.email}</div>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-neutral-500 truncate">{u.institution || "—"}</span>
              <div className="flex items-center gap-2">
                {!u.approved && (
                  <span className="text-[10px] rounded-full bg-amber-100 text-amber-900 px-2 py-0.5 ring-1 ring-amber-200">
                    Pendente
                  </span>
                )}
                <span className="text-[10px] rounded-full px-2 py-0.5 ring-1">{u.role}</span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button className="rounded-full bg-neutral-100 px-3 py-1" onClick={() => open(u)}>
                Editar
              </button>

              {(me?.role === "ADMIN" || me?.id === 1) && !u.approved && (
                <>
                  <button
                    className="rounded-full bg-emerald-600 text-white px-3 py-1"
                    onClick={() => approve(u)}
                  >
                    Aprovar
                  </button>

                  <button
                    className="rounded-full bg-red-600 text-white px-3 py-1"
                    onClick={async () => {
                      if (!confirm("Recusar este usuário?")) return;
                      const r = await fetch(`/api/admin/users/${u.id}/reject`, {
                        method: "POST",
                      });
                      if (r.ok) load();
                      else alert("Erro ao recusar");
                    }}
                  >
                    Recusar
                  </button>
                </>
              )}

              {me?.id === 1 && u.id !== 1 && (
                <button
                  className="rounded-full bg-neutral-900 text-white px-3 py-1"
                  onClick={() => toggleAdmin(u)}
                >
                  {u.role === "ADMIN" ? "Remover admin" : "Dar admin"}
                </button>
              )}
              {u.approved && u.active && me?.id === 1 && (
                <button
                  className="rounded-full bg-red-700 text-white px-3 py-1"
                  onClick={async () => {
                    if (!confirm("Desativar este usuário?")) return;
                    const r = await fetch(`/api/admin/users/${u.id}/deactivate`, {
                      method: "POST",
                    });
                    if (r.ok) load();
                    else alert("Erro ao desativar");
                  }}
                >
                  Desativar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {editing ? <EditModal user={editing} onClose={() => setEditing(null)} onSave={save} /> : null}
    </Container>
  );
}

function EditModal({
  user,
  onClose,
  onSave,
}: {
  user: User;
  onClose: () => void;
  onSave: (fd: FormData) => void;
}) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [institution, setInstitution] = useState(user.institution || "");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(user.photoUrl || null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : preview);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", name);
    fd.append("email", email);
    fd.append("institution", institution);
    if (password) fd.append("password", password);
    if (file) fd.append("photo", file);
    onSave(fd);
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/40">
      <div className="absolute inset-0 overflow-y-auto">
        <div className="min-h-full p-4 flex items-start justify-center">
          <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl ring-1 ring-neutral-200">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold leading-none">Editar usuário</h2>
                <p className="text-sm text-neutral-600">Atualize dados e foto do perfil.</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full px-3 py-1.5 text-sm bg-neutral-100 hover:bg-neutral-200"
              >
                Fechar
              </button>
            </div>

            <form onSubmit={submit} className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={preview || "/avatar-placeholder.png"}
                  alt={name}
                  className="h-14 w-14 rounded-full object-cover ring-1 ring-neutral-200"
                />
                <label className="inline-flex items-center gap-2 px-3 py-2 border rounded-xl cursor-pointer">
                  <span>Alterar foto</span>
                  <input type="file" accept="image/*" className="hidden" onChange={onFile} />
                </label>
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
                <label className="block text-sm font-medium">Nova senha (opcional)</label>
                <input
                  type="password"
                  className="w-full border rounded-xl px-3 py-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Deixe em branco para manter"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-full bg-neutral-100 px-4 py-2"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button className="rounded-full bg-neutral-900 text-white px-4 py-2">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
