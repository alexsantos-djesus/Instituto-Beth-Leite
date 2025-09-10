export type IdadeFmtOptions = {
  zeroLabel?: string;
  round?: "floor" | "ceil" | "nearest";
  short?: boolean;
};

export function idadeEmTexto(meses: number, opt: IdadeFmtOptions = {}): string {
  const { zeroLabel = "recém-nascido", round = "floor", short = false } = opt;

  if (meses == null || !Number.isFinite(meses) || meses < 0) return "idade indeterminada";

  const m =
    round === "ceil" ? Math.ceil(meses) :
    round === "nearest" ? Math.round(meses) :
    Math.floor(meses);

  const anos = Math.floor(m / 12);
  const rest = m % 12;

  if (m === 0) return zeroLabel;

  if (short) {
    const pa = anos > 0 ? `${anos}a` : "";
    const pm = rest > 0 ? `${rest}m` : "";
    return [pa, pm].filter(Boolean).join(" ") || zeroLabel;
  }

  const pa = anos > 0 ? `${anos} ${anos === 1 ? "ano" : "anos"}` : "";
  const pm = rest > 0 ? `${rest} ${rest === 1 ? "mês" : "meses"}` : "";
  return [pa, pm].filter(Boolean).join(" e ") || zeroLabel;
}

export function dataPt(
  date?: Date | string | null,
  options: Intl.DateTimeFormatOptions = {}
): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";

  const base: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...options,
  };

  return new Intl.DateTimeFormat("pt-BR", base).format(d);
}
