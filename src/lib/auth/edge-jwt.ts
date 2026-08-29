import { jwtVerify } from "jose";

const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);

export async function verifyAccessTokenEdge(token: string) {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    return payload;
  } catch {
    return null;
  }
}
