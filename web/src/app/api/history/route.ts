/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import VideoHistory from "@/models/VideoHistory";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    await dbConnect();
    const history = await VideoHistory.find({ userId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ history });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}