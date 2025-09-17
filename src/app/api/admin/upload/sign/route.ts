import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function GET() {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME!;
  const key = process.env.CLOUDINARY_API_KEY!;
  const secret = process.env.CLOUDINARY_API_SECRET!;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || undefined;
  const timestamp = Math.floor(Date.now() / 1000);

  const paramsToSign: Record<string, string | number | boolean> = { timestamp };
  if (preset) paramsToSign.upload_preset = preset;

  const signature = cloudinary.utils.api_sign_request(paramsToSign, secret);

  return NextResponse.json({
    cloud,
    key,
    timestamp,
    signature,
    upload_preset: preset ?? null,
  });
}
