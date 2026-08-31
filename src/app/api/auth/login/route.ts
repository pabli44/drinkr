import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL ?? "admin@drinkr.co";
    const adminPassword = process.env.ADMIN_PASSWORD ?? "drinkr2025";

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Payload simple (sin JWT real para evitar dependencia de librerías)
    const payload = { email, role: "ADMIN" };
    const token = Buffer.from(JSON.stringify(payload)).toString("base64");

    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 horas
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
