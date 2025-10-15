
import express from 'express';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cache bundle
let bundleCache = null;

app.post('/render', async (req, res) => {
  try {
    const { title, reelData, audiourl, videoUrls } = req.body;

    // Bundle once
    if (!bundleCache) {
      const entry = path.join(process.cwd(), '../remotion/Root.jsx');
      bundleCache = await bundle(entry, () => {}, {
        webpackOverride: (config) => config,
      });
    }

    // Get composition
    const composition = await selectComposition({
      serveUrl: bundleCache,
      id: 'ReelVideo',
      inputProps: { reelData, audiourl, videoUrls },
    });

    // Temp output path
    const outputPath = path.join(os.tmpdir(), `${Date.now()}_${title}.mp4`);

    // Render
    await renderMedia({
      composition,
      serveUrl: bundleCache,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: { reelData, audiourl, videoUrls },
    });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(outputPath, {
      resource_type: 'video',
      folder: 'reels',
      public_id: title.replace(/[^a-zA-Z0-9]/g, '_'),
    });

    // Cleanup
    fs.unlinkSync(outputPath);

    res.json({ success: true, reelurl: result.secure_url });
  } catch (error) {
    console.error('Render error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Render server running on port ${PORT}`);
});