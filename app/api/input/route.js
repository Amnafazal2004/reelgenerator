
import connectDB from "@/config/db"
import { NextResponse } from "next/server"
import InputModel from "@/models/InputModel"
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
const ffmpegPath = "ffmpeg";
//right now we are using ffmpeg that is installed locally in our computer
//so to use it in production we need to use install it in docker too
//make sure to add this command in docker RUN apt-get update && apt-get install -y ffmpeg



export async function POST(request) {
   console.log('API route hit');
   try {
      const formData = await request.formData()

      const prompt = formData.get("prompt");
      const userid = formData.get("userid");
      const videos = formData.getAll("videos");
      const audio = formData.get("audio"); // file

      console.log(prompt, userid, videos, audio)

      if (!videos || videos.length === 0) {
         return NextResponse.json({ success: false, message: "video not uploaded" })
      }

      const audioURL = await audioeditor(audio)
      console.log(audioURL)


      await connectDB()
      console.log("connected")
      const newinput = await InputModel.create({
         prompt, userid, videos, audioURL

      })
      console.log(newinput)
      return NextResponse.json({ success: true, message: "input added", audio: audioURL })
   }
   catch (error) {
      return NextResponse.json({ success: false, message: error.message })
   }
}

export async function GET() {
   await connectDB();
   try {
      const input = await InputModel.find({});
      return NextResponse.json({ input })
   }
   catch (error) {
      console.log(error)
   }


}
async function audioeditor(audio) {
   console.log("baaji")
   const arrayBuffer = await audio.arrayBuffer();
   const buffer = Buffer.from(arrayBuffer);
   //it creates a temp file 
   const inputPath = path.join(os.tmpdir(), `${Date.now()}_input.mp4`);
   const outputPath = path.join(os.tmpdir(), `${Date.now()}_output.mp3`);
   //the videofile of the audio is saved in the inputPath
   fs.writeFileSync(inputPath, buffer);

   //We wrap this in a Promise so it waits until FFmpeg finishes or errors.
   await new Promise((resolve, reject) => {
      const ff = spawn(ffmpegPath , [
         "-i", inputPath,       // input file
         "-vn",                 // no video
         "-acodec", "libmp3lame", // use mp3 encoder
         "-b:a", "192k",        // bitrate
         outputPath,            // output file
      ]);

      ff.on("error", reject);
      ff.on("close", (code) => (code === 0 ? resolve() : reject(new Error("FFmpeg failed"))));
   });

   //Read the MP3 file into memory.Convert it to a base64 data URL → which can be used directly in <audio> or Remotion:
   const audioBuffer = fs.readFileSync(outputPath);
   const audioBase64 = `data:audio/mp3;base64,${audioBuffer.toString("base64")}`;

   //Deletes temporary input/output files to free up disk space.
   fs.unlinkSync(inputPath);
   fs.unlinkSync(outputPath);

   console.log("baaji going")
   return audioBase64

}

export async function PUT(request) {
   await connectDB();

   const formData = await request.formData();

   const id = formData.get("id");
   const prompt = formData.get("prompt");
   const videos = formData.getAll("videos");
   const audio = formData.get("audio");

   const audioURL = await audioeditor(audio)
   const input = await InputModel.findByIdAndUpdate(
      id,
      {
         $push: {
            prompt: prompt,
            videos: { $each: videos },// ensures array merge instead of replacing
            audio: audioURL
         }
      },
      { new: true }
   );

   return NextResponse.json({ success: true, input });
}