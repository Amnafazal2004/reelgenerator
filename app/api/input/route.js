
import connectDB from "@/config/db"
import { NextResponse } from "next/server"
import InputModel from "@/models/InputModel"

export async function POST(request) {
   console.log('API route hit');
    try{
        const formData = await request.formData()
         console.log('Form data received');
        const prompt = formData.get("prompt") 
        const userid = formData.get("userid")  
        const videos = formData.getAll("videos")

        if(!videos || videos.length === 0) {
            return NextResponse.json({success: false, message: "video not uploaded"})
        }

   
    await connectDB()
    console.log("connected")
    const newinput = await InputModel.create({
       prompt,userid,videos

    })
    console.log(newinput)
    return NextResponse.json({ success: true, message: "input added" })
  }
  catch(error){
     return NextResponse.json({ success: false, message: error.message })
  }
  }


