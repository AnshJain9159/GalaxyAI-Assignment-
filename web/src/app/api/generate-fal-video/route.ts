import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

fal.config({ credentials: process.env.NEXT_FAL_KEY! });

export async function POST(req: NextRequest) {
  try {
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

    const result = await fal.run("fal-ai/hunyuan-video/video-to-video", {
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
      logs: false,
    });

    // Log the full result for debugging
    console.log("Fal API result:", result);

    // Return the full result or the correct nested properties
    return NextResponse.json(result);
    // Or, if you want only the video URL and seed:
    // return NextResponse.json({ video: result.video?.url, seed: result.seed });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}