import { SignJWT, jwtVerify, JWTPayload } from "jose";

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret");

export type SessionPayload = {
  id: string;
  role: "ADMIN" | "EDITOR" | "USER";
  approved?: boolean;
};

export async function signSession(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(SECRET);
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as JWTPayload & SessionPayload;
  } catch {
    return null;
  }
}
