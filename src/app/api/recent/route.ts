import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  try {
    const raw: any[] = await redis.lrange("recent_visitors", 0, 19);
    const visitors = raw.map((r: any) => {
      try { return JSON.parse(r); } catch { return r; }
    });
    return NextResponse.json(visitors);
  } catch {
    return NextResponse.json([]);
  }
}
