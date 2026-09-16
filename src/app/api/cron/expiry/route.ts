import { NextResponse } from "next/server";
import { expirePendingOrders } from "@/lib/order";

function getCronSecret(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }

  const { searchParams } = new URL(request.url);
  return searchParams.get("secret");
}

export async function GET(request: Request) {
  try {
    const secret = getCronSecret(request);

    if (!secret || secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const expiredCount = await expirePendingOrders();

    return NextResponse.json({ ok: true, expired: expiredCount });
  } catch (error) {
    console.error("[cron-expiry]", error);
    return NextResponse.json(
      { error: "Error al procesar reservas vencidas" },
      { status: 500 }
    );
  }
}
