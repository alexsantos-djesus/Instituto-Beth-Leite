import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME!;
  const key   = process.env.CLOUDINARY_API_KEY!;
  const secret= process.env.CLOUDINARY_API_SECRET!;
  const timestamp = Math.floor(Date.now() / 1000);

  const toSign = `timestamp=${timestamp}`;
  const signature = crypto.createHash("sha1").update(toSign + secret).digest("hex");

  return NextResponse.json({ cloud, key, timestamp, signature });
}
