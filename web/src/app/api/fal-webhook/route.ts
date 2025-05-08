import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import VideoHistory from "@/models/VideoHistory";

// POST: Fal webhook callback
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const falRequestId = body.request_id;
    // const output = body.output;
    const output = body.payload;

    if (!falRequestId || !output) {
      return NextResponse.json({ error: "Missing jobId or output" }, { status: 400 });
    }

    await dbConnect();

    await VideoHistory.findOneAndUpdate(
      { falRequestId },
      {
        $set: {
          status: "completed",
          output,
          generatedVideoUrl: output.video?.url || output.video_url || null,
          completedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Fal webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

// GET: Frontend polling for job status
export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get("jobId");
  if (!jobId) return NextResponse.json({ error: "Missing jobId" }, { status: 400 });

  await dbConnect();
  const job = await VideoHistory.findById(jobId);

  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  return NextResponse.json({ status: job.status, output: job.output });
}