import { NextResponse } from "next/server"
import fs from "fs"; //This lets us read/write files on your computer.
import https from "https"; //built-in Node.js module that lets us make secure web requests (to download stuff from the internet).


export async function downloadvideo(url, path){
    return new Promise((resolve, reject)=>{
        const file = fs.createWriteStream(path) //tells Node: "Open a new file called video.mp4" ,"Get ready to write data into it (stream it piece by piece)."
        https.get(url,(response)=>{
            response.pipe(file)
            file.on("finish", ()=>{
                file.close(resolve)
            })
        }).on("error", reject)
    })

}

// https.get → makes a GET request to the given URL.
// url → the video link we defined earlier.
// (response) => { ... } → a callback function.
// When the server replies with the video data, Node gives it to you as response.
// response → the video data coming in from the internet.
// .pipe(file) → instead of waiting for the whole thing, we pipe (send) the incoming data directly into file.
//  This means: "Take the video chunks you download and write them straight into video.mp4."

export async function POST(request) {
    try {
      
        const formData = await request.formData()
        const videosurl = formData.getAll("videosurl")
        console.log("videos in api", videosurl)

        let videono = 1;
        for(let i=0;i<videosurl.length;i++){
            let localpath = `./public/video${videono}.mp4`
            console.log("han", videosurl.length)
            await downloadvideo(videosurl[i], localpath)
            console.log("yess", i)
            videono++;
        }
 
        return NextResponse.json({ success: true })
    }
    catch (error) {
        console.error("Full error:", error);
        return NextResponse.json({ success: false })
    }


}
