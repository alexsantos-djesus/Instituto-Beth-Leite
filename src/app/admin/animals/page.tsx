import Container from "@/components/Container";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { PawPrint } from "lucide-react";

export const revalidate = 0;

async function toggleAdotado(formData: FormData) {
  "use server";

  const cookie = cookies().get("ibl_admin")?.value;
  if (cookie !== "1") throw new Error("Unauthorized");

  const id = Number(formData.get("id"));
  const adotado = String(formData.get("adotado")) === "true";
  if (!id) return;

  await prisma.animal.update({
    where: { id },
    data: adotado ? { adotado: false, adotadoEm: null } : { adotado: true, adotadoEm: new Date() },
  });

  revalidatePath("/admin/animals");
  revalidatePath("/animais");
}

export default async function AnimalsAdminList() {
  const animals = await prisma.animal.findMany({
    orderBy: { atualizadoEm: "desc" },
    include: {
      photos: {
        where: { isCover: true },
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
    },
  });

  return (
    <Container className="py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold">Animais</h1>
        <Link
          href="/admin/animals/new"
          className="rounded-full bg-neutral-900 text-white px-4 py-2 hover:bg-neutral-800"
        >
          + Novo animal
        </Link>
      </div>

      {animals.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-neutral-200/60">
          Nenhum animal cadastrado ainda.
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {animals.map((a) => {
            const cover = a.photos[0];
            return (
              <li
                key={a.id}
                className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-neutral-200/60"
              >
                <div className="flex gap-3">
                  <div className="relative h-20 w-28 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                    {cover ? (
                      <Image src={cover.url} alt={cover.alt} fill className="object-cover" />
                    ) : null}
                  </div>

                  <div className="min-w-0">
                    <div className="font-semibold leading-tight line-clamp-1">{a.nome}</div>
                    <div className="text-sm text-neutral-600">
                      {a.especie} • {a.sexo} • {a.porte}
                    </div>
                    <div className="text-xs text-neutral-500">Idade: {a.idadeMeses} meses</div>

                    {a.adotado && (
                      <span className="mt-1 inline-flex items-center gap-1 text-[11px] rounded-full px-2 py-0.5 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                        <PawPrint size={12} /> Adotado
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-neutral-500">
                    Atualizado {new Date(a.atualizadoEm).toLocaleString()}
                  </div>

                  <div className="flex gap-1">
                    <Link
                      href={`/admin/animals/${a.id}`}
                      className="rounded-full px-3 py-1.5 text-sm bg-neutral-100 hover:bg-neutral-200"
                    >
                      Editar
                    </Link>

                    <form action={toggleAdotado}>
                      <input type="hidden" name="id" value={a.id} />
                      <input type="hidden" name="adotado" value={String(a.adotado)} />
                      <button
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ring-1 transition
                          ${
                            a.adotado
                              ? "bg-emerald-600 text-white ring-emerald-600 hover:bg-emerald-700"
                              : "bg-white text-neutral-700 ring-neutral-200 hover:bg-neutral-100"
                          }`}
                        title={a.adotado ? "Desfazer adotado" : "Marcar como adotado"}
                      >
                        <PawPrint size={14} />
                        <span className="hidden sm:inline">
                          {a.adotado ? "Adotado ✓" : "Marcar adotado"}
                        </span>
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}
