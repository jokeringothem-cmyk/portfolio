import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  try {
    const raw: string[] = await redis.lrange("recent_visitors", 0, 9);
    const visitors = [];
    for (const r of raw) {
      try {
        visitors.push(JSON.parse(r));
      } catch {
        // skip malformed
      }
    }
    return NextResponse.json(visitors);
  } catch {
    return NextResponse.json([]);
  }
}
