export function formatIdade(meses: number) {
  if (meses < 12) {
    return `${meses} ${meses === 1 ? "mês" : "meses"}`;
  }

  const anos = Math.floor(meses / 12);
  const restoMeses = meses % 12;

  if (restoMeses === 0) {
    return `${anos} ${anos === 1 ? "ano" : "anos"}`;
  }

  return `${anos} ${anos === 1 ? "ano" : "anos"} e ${restoMeses} ${
    restoMeses === 1 ? "mês" : "meses"
  }`;
}
