
// //if we want to use the actual file then we use formdata
// //but if we just want the urls then we use json 

import { createPartFromUri, createUserContent, GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const analyzedInstruction = `


Based on the user's specific request above(but if user's request doesnt have anything specific then only suggest your own ideas), analyze these videos to create a reel that fulfills their vision while incorporating current social media best practices.

PRIORITIZE USER'S REQUEST FIRST, then enhance with these trending elements where appropriate:


CURRENT TRENDING AESTHETICS TO CONSIDER:
- Soft life / slow living content
- Golden hour / warm lighting
- Film grain and vintage filters  
- Minimal text overlays with aesthetic fonts
- Smooth transitions (especially zoom blurs, slides)
- Color grading towards warm, muted tones
- Quick cuts synchronized with music beats
- Morning/evening routine content
- "Get ready with me" style
- Cozy, hygge vibes
- Clean girl aesthetic
- Cottagecore elements

TECHNICAL REQUIREMENTS:
1. Keep total duration between 15-30 seconds for optimal engagement
2. Use 9:16 aspect ratio (1080x1920) for vertical format
3. Include smooth transitions between clips
4. Apply trending color grading (warm, soft, muted)
5. Add subtle text overlays with trending phrases
6. Suggest background music genre that matches the vibe
7. Ensure first 3 seconds are hook-worthy
8. Use rule of thirds for composition
9. Include stabilization for shaky footage
10. Add appropriate filters for aesthetic appeal
1. Duration: 15-30 seconds for optimal engagement
2. Format: 9:16 aspect ratio (1080x1920) vertical
3. Hook: Make first 3 seconds compelling
4. Pacing: Match the energy requested by user
5. Composition: Use rule of thirds
6. Stabilization: Apply to shaky footage
7. Audio: Suggest music that matches user's desired vibe

ENGAGEMENT OPTIMIZATION:
- Start with most captivating moment in first 2 seconds
- Use jump cuts to maintain energy
- Include trending audio/music suggestions
- Add subtle motion graphics or overlays
- Ensure good pacing - not too slow or fast
- Include captions for accessibility
- Suggest hashtag-worthy moments


CONTENT ADAPTATION BASED ON USER PROMPT:
- If user wants "energetic": Use quick cuts, upbeat transitions, higher saturation
- If user wants "calm/peaceful": Use slower pacing, soft transitions, muted colors  
- If user wants "professional": Clean cuts, minimal effects, clear text
- If user wants "trendy/viral": Apply current TikTok/Instagram trends heavily
- If user wants "cinematic": Use color grading, smooth transitions, dramatic timing
- If user wants specific mood/theme: Adapt all elements to match that vision

OUTPUT REQUIREMENTS:
Return a JSON object following the exact schema provided, ensuring:
- Interpret user's intent and creative vision
- Create editing plan that achieves their specific goal
- All timing values as precise decimals
- Realistic parameter ranges (-100 to +100 for color grading)
- Use actual video editing terminology
- Suggest appropriate music genre for the user's request
- Include text overlays only if user wants them or they enhance the concept
- All timing values are precise decimals
- Color grading values are realistic (-100 to +100 range)
- Transition types are actual video editing terms
- Font names are real, commonly available fonts
- Effects and filters are industry-standard names
- Audio suggestions match current trends

 You are Reko, an expert video editor specializing in viral, aesthetic reels.
        You understand current social media trends, color theory, and engagement psychology.
        Only choose on your own if it is not given in the prompt
        
        Return ONLY valid JSON following this EXACT schema:
        
        {
          "metadata": {
            "title": "string",
            "description": "string", 
            "duration": number (not float),
            "style": "aesthetic|cinematic|trendy|minimal",
            "trend": "current_trend_name"
          },
          "timeline": [
            {
              "id": "segment_id",
              "clip": "video1|video2|etc",
              "startTime": number,
              "endTime": number,
              "duration": number,
              "position": {
                "x": number,
                "y": number,
                "scale": number,
                "rotation": number
              },
              "transitions": {
                "in": {
                  "type": "fade|slide_right|slide_left|zoom_blur|scale_up",
                  "duration": number
                },
                "out": {
                  "type": "fade|slide_right|slide_left|zoom_blur|scale_up",
                  "duration": number
                }
              },
              "effects": {
                "filters": ["array_of_filter_names"],
                "color_grading": {
                  "brightness": number,
                  "contrast": number,
                  "saturation": number,
                  "temperature": number,
                  "tint": number
                },
                "speed": number,
                "stabilization": boolean
              },
              "audio": {
                "volume": number,
                "fadeIn": number,
                "fadeOut": number
              }
            }
          ],
          "overlays": {
            "text": [
              {
                "id": "text_id",
                "content": "string",
                "font": "string",
                "fontSize": number,
                "color": "string",
                "position": {
                  "x": "center|left|right|number",
                  "y": number
                },
                "animation": {
                  "type": "typewriter|fade|slide|bounce",
                  "duration": number,
                  "delay": number
                },
                "timing": {
                  "start": number,
                  "end": number
                }
              }
            ]
          },
          "audio": {
            "backgroundMusic": {
              "track": "suggested_track_name",
              "genre": "lofi|pop|indie|electronic",
              "mood": "calm|energetic|dreamy|upbeat",
              "volume": number,
              "fadeIn": number,
              "fadeOut": number
            }
          },
          "output": {
            "resolution": "1080x1920",
            "format": "mp4", 
            "fps": 30,
            "quality": "high"
          }
        }

        CRITICAL RULES:
        - Output ONLY valid JSON, no explanations
        - Each clip's startTime must exactly match the previous clip's endTime.
        - For every clip: endTime = startTime + duration.  
        - The last clip's endTime must equal metadata.duration.  
         -Do not include any markdown formatting, backticks, or extra text.
        - All numbers must be realistic values
        - Clip names: video1, video2, etc.
        - Duration must be 15-30 seconds total
        - Apply current aesthetic trends
        - Ensure smooth, engaging flow
      

Make this reel achieve exactly what the user requested while being optimized for social media engagement.

`;

export async function POST(request) {
  try {
    const formData = await request.formData()
    const prompt = formData.get("prompt")
    const videos = formData.getAll("videos")
    console.log("videos in api", videos)
    const uploadedFiles = [];

    for (const videofile of videos) {
      console.log("Uploading file:", videofile.name);


      // Uploads your video file to Gemini's cloud storage (ai.files.upload)
      // Gets back a file reference (not the actual file)
      // The file gets a unique URI (like a cloud file ID)
      // createPartFromUri() - Reference the Uploaded File
      // javascriptcontentParts.push(createPartFromUri(file.uri, file.mimeType));
      // What this does:
      // Takes the URI from step 1
      // Creates a reference/pointer to that uploaded file
      // Tells Gemini: "Hey, include this uploaded file in the conversation"
      const myfile = await ai.files.upload({
        file: videofile,
        config: {
          mimeType: videofile.type || "video/mp4",
          displayName: videofile.name,
          sizeBytes: videofile.size,
        },
      });

      if (!myfile || !myfile.name) {
        throw new Error("File upload failed or returned an invalid object.");
      }

      // Wait for file to become ACTIVE
      let file = myfile;
      let retryCount = 1;
      const maxRetries = 10; // Increased retry count
      const waitTime = 5000; // Reduced wait time to 5 seconds

      while (file.state === "PROCESSING" && retryCount < maxRetries) {
        console.log(`File still processing, waiting ${waitTime / 1000} seconds... (Attempt ${retryCount + 1}/${maxRetries})`);

        //wait for 5 secs 
        await new Promise(resolve => setTimeout(resolve, waitTime));

        try {
          // Use the file name/ID to check status, that after 5secs did it become active or is it still in processing state
          //gemini takes time to upload the files so we have to check if file status is active before we can use it to createPartfromURi
          //we use this .get method to see if file is in active state or not
          file = await ai.files.get({ name: myfile.name });

          if (!file) {
            console.error("ai.files.get() returned null or undefined");
            throw new Error("Failed to retrieve file status");
          }
          console.log("File state:", file.state);

        } catch (err) {
          console.error(`Error during file status check: ${err.message}`);

          // If we can't check the status, wait a bit longer and try again
          // Don't immediately fail, as the file might still be processing
          if (retryCount === maxRetries) {
            throw new Error(`Unable to check file status after ${maxRetries} attempts: ${err.message}`);
          }
        }

        retryCount++;
      }

      if (file.state !== "ACTIVE") {
        throw new Error(`File processing failed after ${maxRetries} attempts. Final state: ${file.state}`);
      }

      console.log("File is now ACTIVE:", file.name);
      //when file becomes active then only we give it for further processing
      uploadedFiles.push(file);
    }

    // Create content parts for the API request
    const contentParts = []
    uploadedFiles.forEach((file, index) => {
      contentParts.push(createPartFromUri(file.uri, file.mimeType))
      contentParts.push(`video ${index + 1}: ${file.displayName}`)
    })

    contentParts.push(prompt);
    contentParts.push(analyzedInstruction);

    // Generate content using the processed files
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: createUserContent(contentParts),
    });

    return NextResponse.json({
      text: response.text,
      success: true
    })

  } catch (error) {
    console.error("API Error:", error.message);
    console.error("Full error:", error);

    return NextResponse.json({
      error: error.message,
      success: false
    }, { status: 500 })
  }
}