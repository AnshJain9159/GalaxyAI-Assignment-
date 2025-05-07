import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import VideoHistory from "@/models/VideoHistory";

export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get("jobId");
  if (!jobId) return NextResponse.json({ error: "Missing jobId" }, { status: 400 });

  await dbConnect();
  const job = await VideoHistory.findById(jobId);

  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  return NextResponse.json({ status: job.status, output: job.output });
}