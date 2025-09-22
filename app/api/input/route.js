
import connectDB from "@/config/db"
import { NextResponse } from "next/server"
import InputModel from "@/models/InputModel"

export async function POST(request) {
   console.log('API route hit');
   try {
      const { prompt, userid, videos } = await request.json()

      console.log(prompt,userid, videos)

      if (!videos || videos.length === 0) {
         return NextResponse.json({ success: false, message: "video not uploaded" })
      }


      await connectDB()
      console.log("connected")
      const newinput = await InputModel.create({
         prompt, userid, videos

      })
      console.log(newinput)
      return NextResponse.json({ success: true, message: "input added" })
   }
   catch (error) {
      return NextResponse.json({ success: false, message: error.message })
   }
}

export async function GET() {
   await connectDB();

   const input = await InputModel.find({});
   return NextResponse.json({ input })

}

export async function PUT(request) {
  await connectDB();

  const { id, prompt, videos } = await request.json();

  const input = await InputModel.findByIdAndUpdate(
    id,
    { 
    $push: { 
      prompt: prompt,
      videos: { $each: videos } // ensures array merge instead of replacing
    } 
  },
    { new: true }
  );

  return NextResponse.json({success: true, input});
}