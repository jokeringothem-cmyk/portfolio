import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  const info: Record<string, string> = {
    url_set: process.env.UPSTASH_REDIS_REST_URL ? "yes" : "NO",
    token_set: process.env.UPSTASH_REDIS_REST_TOKEN ? "yes" : "NO",
  };

  try {
    const all = await redis.hgetall("visitors");
    info.redis = "connected";
    info.keys = String(Object.keys(all || {}).length);
  } catch (e: any) {
    info.redis = "error: " + (e?.message || String(e));
  }

  return NextResponse.json(info);
}
