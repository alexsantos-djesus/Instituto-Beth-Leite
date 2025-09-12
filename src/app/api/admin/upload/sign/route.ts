// src/app/api/admin/upload/sign/route.ts
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function GET() {
  // Cloudinary espera timestamp em SEGUNDOS, não ms
  const timestamp = Math.round(Date.now() / 1000);

  // Se quiser fixar uma pasta padrão, inclua aqui e também no form data do client
  // const paramsToSign = { timestamp, folder: "ibl" };
  const paramsToSign = { timestamp };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return NextResponse.json({
    cloud: process.env.CLOUDINARY_CLOUD_NAME,
    key: process.env.CLOUDINARY_API_KEY,
    timestamp,
    signature,
    // Se for usar UNSIGNED uploads, informe o preset aqui (opcional para signed)
    preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? null,
    // folder: "ibl"
  });
}
