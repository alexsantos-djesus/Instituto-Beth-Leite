import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import bcrypt from "bcryptjs";
export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const token = (await import("next/headers")).cookies().get("ibl_user")?.value || "";
  const s = await verifySession(token);
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const form = await _req.formData();
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "")
    .toLowerCase()
    .trim();
  const institution = String(form.get("institution") || "").trim();
  const password = String(form.get("password") || "");
  const file = form.get("photo") as File | null;
  let photoUrl: string | undefined;
  if (file && file.size > 0) {
    const fs = await import("fs/promises");
    const bytes = Buffer.from(await file.arrayBuffer());
    const fname = `${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, "_")}`;
    await fs.mkdir(process.cwd() + "/public/uploads", { recursive: true });
    await fs.writeFile(process.cwd() + "/public/uploads/" + fname, bytes);
    photoUrl = "/uploads/" + fname;
  }
  const data: any = {};
  if (name) data.name = name;
  if (email) data.email = email;
  if (institution) data.institution = institution;
  if (photoUrl) data.photoUrl = photoUrl;
  if (password) data.password = await bcrypt.hash(password, 10);
  const user = await prisma.user.update({ where: { id: Number(params.id) }, data });
  return NextResponse.json({ ok: true, user });
}
