import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  const ua = request.headers.get("user-agent") || "";

  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,countryCode,city,regionName,isp`
    );
    const data = await res.json();

    if (data.status === "success") {
      const code = data.countryCode.toLowerCase();

      // 1. increment counter
      await redis.hincrby("visitors", code, 1);

      // 2. store detailed record (keep last ~50)
      const record = {
        ip,
        country: data.country,
        countryCode: code,
        city: data.city || "",
        region: data.regionName || "",
        isp: data.isp || "",
        ua: ua.slice(0, 200),
        time: new Date().toISOString(),
      };
      await redis.lpush("recent_visitors", JSON.stringify(record));
      await redis.ltrim("recent_visitors", 0, 49);
    }
  } catch {
    // silently ignore
  }

  return NextResponse.json({ ok: true });
}
