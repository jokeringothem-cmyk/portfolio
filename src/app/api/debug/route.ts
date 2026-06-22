import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  const info: Record<string, unknown> = {
    url_set: !!process.env.UPSTASH_REDIS_REST_URL,
    token_set: !!process.env.UPSTASH_REDIS_REST_TOKEN,
  };

  try {
    // check visitors hash
    const visitors = await redis.hgetall("visitors");
    info.visitors = visitors || {};

    // check recent list
    const recentLen = await redis.llen("recent_visitors");
    info.recent_count = recentLen;

    if (recentLen > 0) {
      const raw = await redis.lrange("recent_visitors", 0, 2);
      info.recent_sample = raw.map((r: any) => {
        try { return JSON.parse(r); } catch { return r; }
      });
    }

    // list all keys
    const keys: string[] = [];
    for await (const key of redis.scanIterator()) {
      keys.push(key);
    }
    info.all_keys = keys;

    info.redis = "connected";
  } catch (e: any) {
    info.redis = "error: " + (e?.message || String(e));
  }

  return NextResponse.json(info);
}
