import { bundle } from "@remotion/bundler";
import { renderMedia } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import os from "os";
import { v2 as cloudinary } from "cloudinary";

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, reelData, audiourl } = req.body;

    const entry = path.join(process.cwd(), 'remotion', 'Root.jsx');
    const bundled = await bundle(entry);
    const outputPath = path.join(os.tmpdir(), `${Date.now()}_output.mp4`);
    
    await renderMedia({
      serveUrl: bundled,
      composition: 'ReelVideo',
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: {
        reelData,
        audiourl
      }
    });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(outputPath, {
      resource_type: "video",
      folder: "reels",
      public_id: title.replace(/[^a-zA-Z0-9]/g, '_'),
    });
    
    fs.unlinkSync(outputPath);

    return res.status(200).json({ 
      success: true, 
      reelurl: result.secure_url 
    });

  } catch (error) {
    console.error("Render error:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
    responseLimit: false,
  },
  maxDuration: 300, // 5 minutes (if on Vercel Pro)
};