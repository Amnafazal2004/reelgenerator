import { renderMedia } from '@remotion/renderer';
import { getRemotionBundle } from '../../../remotion/bundleServer';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, reelData, audiourl, videoUrls } = body;

    //  Get the already bundled serveUrl
    const serveUrl = await getRemotionBundle();

    // Temp path for output
    const outputPath = path.join(os.tmpdir(), `${Date.now()}_output.mp4`);

    //  Render the video using the input props
    await renderMedia({
      serveUrl,
      composition: 'ReelVideo',
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: {
        reelData,
        audiourl,
        videoUrls,
      },
    });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(outputPath, {
      resource_type: 'video',
      folder: 'reels',
      public_id: title.replace(/[^a-zA-Z0-9]/g, '_'),
    });

    // Delete temp file
    fs.unlinkSync(outputPath);

    return NextResponse.json({ success: true, reelurl: result.secure_url });
  } catch (err) {
    console.error('Error rendering video:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
