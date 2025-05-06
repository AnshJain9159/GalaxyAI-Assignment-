import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return new NextResponse("Missing url", { status: 400 });
  }
  const videoRes = await fetch(url);
  const headers = new Headers(videoRes.headers);
  // Remove headers that are not allowed to be set by browsers
  headers.delete("content-encoding");
  headers.delete("content-length");
  headers.delete("transfer-encoding");
  headers.delete("connection");
  return new NextResponse(videoRes.body, {
    status: videoRes.status,
    headers,
  });
}