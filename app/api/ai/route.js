import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";


// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request) {
    try {
        // Get the prompt from the request body
        const { prompt } = await request.json();

        // Generate content using the SDK
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            //You can guide the behavior of Gemini models with system instructions
           config: {
  systemInstruction: `
    You are a video editor assistant named Reko.
    Your job is to take the user's request and return a VALID JSON object only.
    Follow this schema exactly:

    {
      "title": "string",
      "segments": [
        {
          "clip": "string (filename or url)",
          "start": number,
          "end": number,
          "caption": "string",
          "effects": ["list","of","effects"]
        }
      ],
      "music": "string",
      "output": {
        "resolution": "e.g. 1080x1920",
        "format": "mp4",
        "duration": number
      }
    }

    Rules:
    - Do not include explanations or any unneccesary text.
    - the clip names should just be video1,video2 like this
    - Output must be valid JSON only.
  `
},

        });

        return NextResponse.json({
            text: response.text,
            success: true
        })
    }
    catch (error) {
        console.log(error.message)
    }


}