import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const authed = cookies().get("ibl_admin")?.value === "1";
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const setAdotado = Boolean(body?.adotado);

  const updated = await prisma.animal.update({
    where: { id },
    data: setAdotado
      ? { adotado: true,  adotadoEm: new Date() }
      : { adotado: false, adotadoEm: null },
    select: { id: true, adotado: true, adotadoEm: true },
  });

  return NextResponse.json(updated, { headers: { "cache-control": "no-store" } });
}
