export function localDatetimeToUTC(s?: string | null) {
  if (!s) return null;
  const [date, time = "00:00"] = s.split("T");
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh ?? 0, mm ?? 0, 0));
}
