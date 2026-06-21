import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  try {
    const all = await redis.hgetall("visitors");
    if (!all || Object.keys(all).length === 0) {
      return NextResponse.json([]);
    }

    const entries = Object.entries(all)
      .map(([code, count]) => ({ country: code, value: Number(count) }))
      .sort((a, b) => b.value - a.value);

    return NextResponse.json(entries);
  } catch {
    return NextResponse.json([]);
  }
}
