import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode`);
    const data = await res.json();

    if (data.status === "success" && data.countryCode) {
      await redis.hincrby("visitors", data.countryCode.toLowerCase(), 1);
    }
  } catch {
    // silently ignore — Redis may not be configured yet
  }

  return NextResponse.json({ ok: true });
}
