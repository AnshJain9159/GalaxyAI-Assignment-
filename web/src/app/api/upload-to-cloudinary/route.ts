/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest,NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  const { userId } = await auth()

    if(!userId) {
            return NextResponse.json({error: 'Not authorized'},{status: 401});
    }

  try {
    if(
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET
  ){
      return NextResponse.json({error: 'Cloudinary configuration missing'},{status:500});
  }
    const { cdnUrl } = await req.json();
    if (!cdnUrl) {
      return NextResponse.json({ error: "cdnUrl is required" }, { status: 400 });
    }

    // Upload to Cloudinary using the remote URL
    const result = await cloudinary.uploader.upload(cdnUrl, {
      resource_type: "video",
      folder: "video-to-video-uploads", // Optional: change as needed
    });
    console.log("Cloudinary upload result:", result.secure_url);
    return NextResponse.json({ url: result.secure_url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}