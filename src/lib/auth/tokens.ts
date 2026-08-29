import { SignJWT, jwtVerify } from "jose";

const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET!
);

export interface JWTPayload {
  userId: string;
  role: string;
}

export async function signAccessToken(userId: string, role: string) {
  return new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .setIssuedAt()
    .sign(ACCESS_SECRET);
}

export async function signRefreshToken(userId: string) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(REFRESH_SECRET);
}

export async function verifyAccessToken(
  token: string
): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(
  token: string
): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    return { userId: payload.userId as string };
  } catch {
    return null;
  }
}
