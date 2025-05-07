import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import dbConnect from "@/lib/dbConnect";
import VideoHistory from "@/models/VideoHistory";
import { auth } from "@clerk/nextjs/server";

fal.config({ credentials: process.env.NEXT_FAL_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      prompt,
      video_url,
      num_inference_steps,
      aspect_ratio,
      resolution,
      num_frames,
      strength,
      seed,
      pro_mode,
      enable_safety_checker,
    } = body;

    if (!prompt || !video_url) {
      return NextResponse.json({ error: "Prompt and video_url are required" }, { status: 400 });
    }

    await dbConnect();
    // Create a pending job in MongoDB
    const job = await VideoHistory.create({
      userId,
      sourceVideoUrl: video_url,
      generatedVideoUrl: null,
      parameters: {
        prompt,
        num_inference_steps,
        aspect_ratio,
        resolution,
        num_frames,
        strength,
        seed,
        pro_mode,
        enable_safety_checker,
      },
      status: "pending",
      createdAt: new Date(),
    });

    // Webhook URL for Fal to call when done
    const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/fal-webhook`;

    // Submit job to Fal with webhook
    await fal.queue.submit("fal-ai/hunyuan-video/video-to-video", {
      input: {
        prompt,
        video_url,
        num_inference_steps,
        aspect_ratio,
        resolution,
        num_frames,
        strength,
        seed: seed ? Number(seed) : undefined,
        pro_mode,
        enable_safety_checker,
      },
      webhookUrl,
      jobId: job._id.toString(), // Pass jobId for tracking
      userId,
    });

    // Return jobId so frontend can poll for status
    return NextResponse.json({ jobId: job._id });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}