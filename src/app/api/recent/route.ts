import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  try {
    const raw = await redis.lrange("recent_visitors", 0, 9);
    const visitors = raw.map((r) => {
      try { return JSON.parse(r as string); } catch { return null; }
    }).filter(Boolean);
    return NextResponse.json(visitors);
  } catch {
    return NextResponse.json([]);
  }
}
