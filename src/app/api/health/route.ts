import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "app-ganadera-ceba",
    module: "pastures"
  });
}
