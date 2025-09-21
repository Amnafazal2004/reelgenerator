"use client"
import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { toast } from 'sonner';
import { useReelContext } from '@/Context/ReelContext';
//we are uploading to cloud first and then sending the urls to backhend so it will reduce upload time

const Checker = () => {

    const [prompt, setprompt] = useState([])
    const [thevideos, setthevideos] = useState([]);
    const { setshowlogin, userid } = useReelContext();
    const [input, setinput] = useState([])
    const [existingdata, setexistingdata] = useState(false);
    const [dataid,setdataid]= useState("");
    let uploadResults ;

        const fetchinputdata = async () => {
            const { data } = await axios.get('/api/input');
            console.log("got it")
            setinput(data.input);
            console.log(data.input);
        }
//   useEffect(() => {
//             if (userid) {
//                 fetchinputdata();
//             }
//         }, [userid])
  
            const openaihandler = async () => {
        try {
            //    const data = {
            //     prompt : prompt,
            //     videos: thevideos,
            //    }
            const formData = new FormData();
            formData.append("prompt", prompt)
            thevideos.forEach((video) => formData.append("videos", video))
            const result = await axios.post('api/ai', formData)
            if (result.data.success) {
                console.log(result.data.text)
            }
        }
        catch (error) {
            console.log("Response error: ", error.message)
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        console.log("userid from context:", userid);

        if (!userid) {
            toast("User not logged in");
            return;
        }


        //uploading videos on cloudinary
        uploadResults = await Promise.all(
            thevideos.map(async (file) => {
                const formData1 = new FormData();
                formData1.append("file", file);
                //the preset is used if uploading from "use client" , if we do in backhend then api secret key is used
                formData1.append("upload_preset", "reelsgenerator");
                const res = await axios.post(
                    "https://api.cloudinary.com/v1_1/dpzq24rxs/video/upload",
                    formData1
                );
                return res.data.secure_url // Get the video URL 
                //the urls would be stored in uploadresults
            })
        );

        const uploadingdata = {
            prompt: prompt,
            userid: userid,
            videos: uploadResults,

        }
        console.log(uploadResults)

        fetchinputdata();

        input.forEach((data) => {
            console.log("hi me here")
            console.log("data user id", data.userid)
            console.log("userid", userid)
            if (data.userid === userid) {
                console.log("true")
                setexistingdata(true)
                console.log("true as weelll")
                setdataid(data._id);
            }
            else{ 
                setexistingdata(false) 
            }

        })

        if (existingdata) {
            await axios.put('/api/input', {
                id: dataid,
                prompt: prompt,
                videos: uploadResults,
            });

        }
        else {
            try {
                const { data } = await axios.post("/api/input", uploadingdata)
                console.log("here")
                if (data.success) {
                    toast(data.message)
                    openaihandler();
                }
            }
            catch (error) {
                toast("Not uploaded")
            }
        }

       


}
    //FormData for files, JSON for URLs/text!
    const handlefileselect = (e) => {
        const selectedfiles = Array.from(e.target.files);
        //now since multiple files can be selected so we change the slectedfiles we get into array and put it into slectedfiles array
        setthevideos((prevVideos) => {
            const remainingslots = 10 - prevVideos.length;
            return [...prevVideos, ...selectedfiles.slice(0, remainingslots)]
            //spreads the old array and the new array into one single array.
            //only max of 10 can be uploaded

        }
        )
    }
     


    return (
        <div>
            <Button onClick={() => setshowlogin(true)}>Profile</Button>
            <h1 className='font-bold text-center text-4xl'>Reels Generator</h1>
            <form onSubmit={submitHandler}>
                <h2>Prompts</h2>
                <Input value={prompt} onChange={(e) => setprompt(e.target.value)} placeholder="write the prompt"
                    type="text"></Input>
                <label className="block text-sm font-semibold text-[#3c5e78] mb-1">Upload videos </label>

                <div>
                    <Input onChange={handlefileselect} accept="video/*" type='file' multiple />
                    {thevideos.length < 10 && thevideos.length >= 1 ?
                        <>
                            <label htmlFor="fileInput">Choose more files</label>
                            <Input onChange={handlefileselect}


                                accept="video/*" type='file' multiple id="fileInput" hidden></Input>
                        </> : <></>
                    }

                    {thevideos.map((files, index) => (
                        <video
                            key={index}
                            src={
                                URL.createObjectURL(files)
                            }
                            width={140}
                            height={70}
                            controls
                            alt=''
                        />
                    ))}

                </div>
                <Button type="submit" size="lg" className="rounded-4xl">Click me</Button>
            </form>
        </div>
    )

}
export default Checker


// Cloudinary Upload (FormData needed):

// Input: Actual file objects from user's device
// Purpose: Upload binary file data
// Method: FormData (handles binary data)
// Output: Gets back URL strings

// Database Save (JSON better):

// Input: URL strings from Cloudinary
// Purpose: Save metadata and references
// Method: JSON (simple text data)
// Output: Database record created