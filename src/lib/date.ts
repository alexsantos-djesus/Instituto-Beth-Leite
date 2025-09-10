// utils/date.ts
export function localDatetimeToUTC(s?: string | null) {
  if (!s) return null;                     // aceita vazio
  // s: "2025-09-13T10:00"
  const [date, time = "00:00"] = s.split("T");
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  // cria um Date em UTC SEM aplicar offset local
  return new Date(Date.UTC(y, m - 1, d, hh ?? 0, mm ?? 0, 0));
}
