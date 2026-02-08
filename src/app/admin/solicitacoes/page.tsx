"use client";

import { useEffect, useMemo, useState } from "react";
import Container from "@/components/Container";
import { Mail, Phone, RefreshCw, Search, User2, PawPrint, MapPin, X, Check } from "lucide-react";

const onlyDigits = (s: string) => String(s || "").replace(/\D/g, "");
function formatPhoneBR(digits: string) {
  const d = onlyDigits(digits).slice(-11);
  if (d.length !== 11) return digits;
  const ddd = d.slice(0, 2);
  const body = `${d.slice(2, 7)}-${d.slice(7)}`;
  return `+55 ${ddd} ${body}`;
}
function telHref(digits: string) {
  const d = onlyDigits(digits);
  const withDDI = d.length === 11 ? `55${d}` : d;
  return `tel:+${withDDI}`;
}
function timeAgo(iso: string) {
  const d = new Date(iso).getTime();
  const diff = Math.floor((Date.now() - d) / 1000);
  if (diff < 60) return "agora";
  const m = Math.floor(diff / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h`;
  const dd = Math.floor(h / 24);
  return `${dd} d`;
}

type Req = {
  id: number;
  status: "NOVO" | "CONTATADO" | "NAO_ELEGIVEL" | "APROVADO";
  nome: string;
  email: string;
  telefone: string;
  cep?: string | null;
  endereco?: string | null;
  numero?: string | null;
  bairro?: string | null;
  cidade: string;
  uf: string;
  mensagem: string;
  criadoEm: string;
  animal: {
    id: number;
    nome: string;
    criadoPor: {
      id: number;
      name: string;
      email: string;
    };
  };
  perfil?: any | null;
};

type StatusKey = Req["status"];

const statusLabel: Record<StatusKey, string> = {
  NOVO: "novo",
  CONTATADO: "contatado",
  NAO_ELEGIVEL: "não elegível",
  APROVADO: "aprovado",
};

const statusClass: Record<StatusKey, string> = {
  NOVO: "bg-amber-50 text-amber-700 ring-amber-200",
  CONTATADO: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  NAO_ELEGIVEL: "bg-neutral-100 text-neutral-700 ring-neutral-300",
  APROVADO: "bg-emerald-600 text-white ring-emerald-700",
};

function StatusBadge({ s }: { s: StatusKey }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ring-1 ${statusClass[s]}`}
      title={statusLabel[s]}
    >
      {statusLabel[s]}
    </span>
  );
}

const labelMap: Record<string, string> = {
  trabalhaFora: "Você trabalha fora?",
  tempoAusente: "Tempo fora de casa",
  ramoTrabalho: "Ramo de trabalho",
  alguemEmCasaDia: "Fica alguém em casa durante o dia?",
  moradoresQtd: "Pessoas na residência",
  haCriancas: "Há crianças na casa?",
  idadeResponsavel: "Idade do responsável",
  redesSociais: "Facebook / Instagram",
  moradiaTipo: "Tipo de moradia",
  casaBemFechada: "Casa bem fechada?",
  imovelTipo: "Imóvel",
  possuiOutrosAnimais: "Possui outros animais?",
  qtdCaes: "Quantidade de cães",
  qtdGatos: "Quantidade de gatos",
  castrados: "São castrados?",
  sabeImportanciaCastracao: "Sabe a importância da castração?",
  ondeVivera: "Onde viverá o animal?",
  morreuAnimalRecente: "Morreu algum animal recentemente?",
  condicoesFinanceirasVet: "Condições financeiras para veterinário?",
  verOutrosSeNaoSelecionado: "Ver outros animais se não selecionado?",
};
function fmtVal(key: string, v: any) {
  const yesNo: Record<string, string> = { SIM: "Sim", NAO: "Não" };
  if (v === "SIM" || v === "NAO") return yesNo[v];
  if (typeof v === "boolean") return v ? "Sim" : "Não";
  const maps: Record<string, Record<string, string>> = {
    tempoAusente: {
      ATE_4H: "Até 4h/dia",
      H4_8: "4–8h/dia",
      H8_12: "8–12h/dia",
      "12H_PLUS": "+12h/dia",
    },
    moradiaTipo: { CASA: "Casa", APTO: "Apartamento" },
    imovelTipo: { PROPRIO: "Próprio", ALUGADO: "Alugado" },
    ondeVivera: { DENTRO: "Dentro de casa", QUINTAL: "Quintal", MISTO: "Dentro e fora" },
  };
  if (maps[key]?.[v]) return maps[key][v];
  return String(v ?? "");
}

export default function AdminSolicitacoes() {
  const [data, setData] = useState<Req[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"TODAS" | StatusKey>("TODAS");
  const [openReq, setOpenReq] = useState<Req | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/requests", { headers: { Accept: "application/json" } });
      if (r.ok) setData(await r.json());
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: number, status: StatusKey) {
    setData((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)));
    if (openReq?.id === id) setOpenReq({ ...openReq, status });
    await fetch("/api/admin/requests", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    }).catch(() => load());
  }

  useEffect(() => {
    if (openReq) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openReq]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return data.filter((r) => {
      const matchTab = tab === "TODAS" ? true : r.status === tab;
      const endStr = [
        r.endereco || "",
        r.numero || "",
        r.bairro || "",
        r.cidade || "",
        r.uf || "",
        r.cep || "",
      ]
        .filter(Boolean)
        .join(" ");
      const matchQ =
        !term ||
        r.nome.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term) ||
        formatPhoneBR(r.telefone).toLowerCase().includes(term) ||
        r.animal.nome.toLowerCase().includes(term) ||
        `${r.cidade}/${r.uf}`.toLowerCase().includes(term) ||
        r.mensagem.toLowerCase().includes(term) ||
        endStr.toLowerCase().includes(term);
      return matchTab && matchQ;
    });
  }, [data, q, tab]);

  return (
    <Container className="py-6 md:py-8">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Solicitações de Adoção</h1>
          <p className="text-neutral-600 text-sm">
            {loading ? "Carregando…" : `${filtered.length} resultado(s)`} • total: {data.length}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nome, animal, endereço…"
              className="w-full sm:w-[280px] rounded-xl border px-8 py-2 text-sm placeholder:text-neutral-400"
            />
          </div>

          <button
            onClick={load}
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 text-white px-3 py-2 text-sm hover:bg-neutral-800 active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(["TODAS", "NOVO", "CONTATADO", "NAO_ELEGIVEL"] as const).map((k) => {
          const active = tab === k;
          const label = k === "TODAS" ? "todas" : statusLabel[k];
          return (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`rounded-full px-3 py-1.5 text-sm ring-1 transition ${
                active
                  ? "bg-neutral-900 text-white ring-neutral-900"
                  : "bg-white ring-neutral-200 hover:bg-neutral-50"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="grid gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl bg-white p-5 ring-1 ring-neutral-200/60 shadow-card"
            >
              <div className="h-4 w-40 bg-neutral-200 rounded mb-2" />
              <div className="h-3 w-72 bg-neutral-200 rounded mb-4" />
              <div className="h-20 w-full bg-neutral-100 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-neutral-200/60 shadow-card">
          <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full bg-neutral-100">
            <PawPrint className="h-5 w-5 text-neutral-500" />
          </div>
          <p className="text-neutral-700">Nenhuma solicitação encontrada.</p>
          <p className="text-neutral-500 text-sm">Tente alterar o filtro ou a busca.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => {
            const fone = formatPhoneBR(r.telefone);
            const enderecoLinha = [
              r.endereco,
              r.numero ? `, ${r.numero}` : "",
              r.bairro ? ` • ${r.bairro}` : "",
              " • ",
              `${r.cidade}/${r.uf}`,
              r.cep ? ` • CEP ${r.cep}` : "",
            ]
              .filter(Boolean)
              .join("");

            return (
              <button
                key={r.id}
                onClick={() => setOpenReq(r)}
                className="text-left w-full bg-white p-5 rounded-2xl shadow-card ring-1 ring-neutral-200/60 hover:ring-neutral-300 transition"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 font-semibold">
                        <User2 className="h-4 w-4 text-neutral-500" />
                        {r.nome}
                      </span>
                      <span className="text-neutral-400">•</span>
                      <span className="truncate">
                        Animal: <span className="font-medium">{r.animal.nome}</span>
                      </span>
                      <span className="text-neutral-400">•</span>
                      <StatusBadge s={r.status} />
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-700">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {r.email}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {fone}
                      </span>
                      <span className="inline-flex items-center gap-1 text-neutral-600 truncate">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate" title={enderecoLinha}>
                          {enderecoLinha}
                        </span>
                      </span>
                      <span className="text-neutral-400">•</span>
                      <span
                        className="text-neutral-500"
                        title={new Date(r.criadoEm).toLocaleString()}
                      >
                        há {timeAgo(r.criadoEm)}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <label className="sr-only">Status</label>
                    <select
                      className="rounded-xl border px-3 py-2 text-sm bg-white"
                      value={r.status}
                      onChange={(e) => setStatus(r.id, e.target.value as StatusKey)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="NOVO">novo</option>
                      <option value="CONTATADO">contatado</option>
                      <option value="NAO_ELEGIVEL">não elegível</option>
                    </select>
                  </div>
                </div>

                {r.mensagem ? (
                  <p className="mt-3 text-neutral-800 line-clamp-3">{r.mensagem}</p>
                ) : null}
              </button>
            );
          })}
        </div>
      )}

      {openReq && (
        <div
          className="fixed inset-0 z-[60]"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpenReq(null)}
        >
          <div className="absolute inset-0 bg-black/40" />

          <div
            className="absolute left-1/2 top-6 -translate-x-1/2 w-[min(100vw,900px)] px-4 md:px-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-black/10 overflow-hidden flex flex-col max-h-[86vh]">
              <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b bg-white/95 backdrop-blur">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 font-semibold text-lg">
                      <User2 className="h-5 w-5 text-neutral-500" />
                      {openReq.nome}
                    </span>
                    <span className="text-neutral-400">•</span>
                    <span>
                      Animal: <span className="font-medium">{openReq.animal.nome}</span>
                    </span>
                    <span className="text-neutral-400">•</span>
                    <StatusBadge s={openReq.status} />
                  </div>

                  <div className="mt-1 text-sm text-neutral-600">
                    <strong>Responsável:</strong> {openReq.animal.criadoPor.name}
                    {" • "}
                    <a
                      href={`mailto:${openReq.animal.criadoPor.email}`}
                      className="underline hover:text-neutral-800"
                    >
                      {openReq.animal.criadoPor.email}
                    </a>
                  </div>

                  <div className="text-xs text-neutral-500">
                    enviada há {timeAgo(openReq.criadoEm)} —{" "}
                    {new Date(openReq.criadoEm).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    className="rounded-xl border px-3 py-2 text-sm bg-white"
                    value={openReq.status}
                    onChange={(e) => setStatus(openReq.id, e.target.value as StatusKey)}
                  >
                    <option value="NOVO">novo</option>
                    <option value="CONTATADO">contatado</option>
                    <option value="NAO_ELEGIVEL">não elegível</option>
                  </select>

                  {openReq.status !== "APROVADO" && (
                    <button
                      onClick={() =>
                        fetch(`/api/admin/requests/${openReq.id}/approve`, { method: "POST" }).then(
                          () => {
                            setOpenReq(null);
                            load();
                          }
                        )
                      }
                      className="rounded-full bg-emerald-600 text-white px-4 py-2 text-sm"
                    >
                      Aprovar adoção
                    </button>
                  )}

                  <button
                    className="inline-grid place-items-center h-9 w-9 rounded-full hover:bg-neutral-100"
                    onClick={() => setOpenReq(null)}
                    aria-label="Fechar"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="px-5">
                <div className="overflow-y-auto max-h-[74vh] py-5 pr-1">
                  <div className="grid md:grid-cols-2 gap-6">
                    <section>
                      <h3 className="font-semibold text-neutral-800 mb-3">Contato</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-neutral-500" />
                          <a href={`mailto:${openReq.email}`} className="hover:underline">
                            {openReq.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-neutral-500" />
                          <a href={telHref(openReq.telefone)} className="hover:underline">
                            {formatPhoneBR(openReq.telefone)}
                          </a>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="font-semibold text-neutral-800 mb-3">Endereço</h3>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="text-neutral-500">Logradouro: </span>
                          <span>{openReq.endereco || "—"}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <span className="text-neutral-500">Número: </span>
                            <span>{openReq.numero || "—"}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-neutral-500">Bairro: </span>
                            <span>{openReq.bairro || "—"}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="col-span-2">
                            <span className="text-neutral-500">Cidade/UF: </span>
                            <span>
                              {openReq.cidade}/{openReq.uf}
                            </span>
                          </div>
                          <div>
                            <span className="text-neutral-500">CEP: </span>
                            <span>{openReq.cep || "—"}</span>
                          </div>
                        </div>
                      </div>
                    </section>

                    {openReq.mensagem ? (
                      <section className="md:col-span-2">
                        <h3 className="font-semibold text-neutral-800 mb-3">Mensagem</h3>
                        <p className="whitespace-pre-line text-neutral-800 bg-neutral-50 rounded-xl p-3 ring-1 ring-neutral-200/60">
                          {openReq.mensagem}
                        </p>
                      </section>
                    ) : null}

                    <section className="md:col-span-2">
                      <h3 className="font-semibold text-neutral-800 mb-3">Seu perfil</h3>
                      {openReq.perfil ? (
                        <div className="grid md:grid-cols-2 gap-3">
                          {Object.entries(openReq.perfil as Record<string, any>)
                            .filter(([, v]) => v !== undefined && v !== null && v !== "")
                            .map(([k, v]) => (
                              <div
                                key={k}
                                className="rounded-xl ring-1 ring-neutral-200/60 bg-white p-3 text-sm flex items-start gap-2"
                              >
                                <Check className="h-4 w-4 mt-0.5 text-emerald-600" />
                                <div>
                                  <div className="text-neutral-500">{labelMap[k] ?? k}</div>
                                  <div className="font-medium text-neutral-800">{fmtVal(k, v)}</div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-neutral-500 text-sm">Sem informações adicionais.</p>
                      )}
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
