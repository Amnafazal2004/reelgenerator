
import connectDB from "@/config/db"
import { NextResponse } from "next/server"
import InputModel from "@/models/InputModel"

export async function POST(reqeust) {
   console.log('API route hit');
    try{
        const formData = await reqeust.formData()
         console.log('Form data received');
        const prompt = formData.get("prompt")   
        const videos = formData.getAll("videos")

        if(!videos || videos.length === 0) {
            return NextResponse.json({success: false, message: "video not uploaded"})
        }

   
    await connectDB()
    const newinput = await InputModel.create({
       prompt,videos

    })
    console.log(newinput)
    return NextResponse.json({ success: true, message: "input added", newinput })
  }
  catch(error){
     return NextResponse.json({ success: false, message: error.message })
  }
  }


    
