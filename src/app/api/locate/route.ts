import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city,lat,lon`);
    const data = await res.json();

    if (data.status === "success") {
      return NextResponse.json({
        ip,
        country: data.country,
        countryCode: data.countryCode,
        city: data.city,
        lat: data.lat,
        lon: data.lon,
      });
    }
  } catch {
    // fall through
  }

  return NextResponse.json({ ip, country: null });
}
