"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useReelContext } from "@/Context/ReelContext";
import { useRouter } from "next/navigation";
import Navbar from "@/appcomponents/Navbar";
import { glikerExpanded, lexendgiga } from "@/lib/fonts";
import plus from "@/Assets/plus.png";
import send from "@/Assets/send.png"
import catpanel from "@/Assets/catpanel.png";
import audioicon from "@/Assets/audio.png";
import Image from "next/image";
import Allprojects from "@/appcomponents/Allprojects";
import Footers from "@/appcomponents/Footers";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

//we are uploading to cloud first and then sending the urls to backhend so it will reduce upload time

const Checker = () => {
  let count = 4;
  const [prompt, setprompt] = useState("");
  const [sent,setsent] = useState(false)
  const [endat, setendat] = useState("");
  const [freetierended, setfreetierended] = useState(false);
  const [proplanactive, setproplanactive] = useState(false);
  const [updateproplan, setupdateproplan] = useState(false);
  const [cancelproplan, setcancelproplan] = useState(false);

  const [thevideos, setthevideos] = useState([]);
   const [thepreviews, setthepreviews] = useState([]);
  const { userid, setreelData, setvideoUrls, setaudiourl, setfreetiercount } =
    useReelContext();
  const router = useRouter();
  const [audio, setaudio] = useState();

  let uploadResults, getSubscription, openaireply;

  const [projecturls, setprojecturls] = useState("");

  const fetchsubsdata = async () => {
    const { data } = await axios.get("/api/freetier");
    console.log("got it");
    //get subscription is an array because it the find method sends an array back
    getSubscription = data.subscription;
    console.log("getsub", getSubscription);
    console.log(data.subscription);
  };

  const getVideoDuration = (file) => {
    return new Promise((resolve) => {
      //We’re making an invisible <video> element purely for reading metadata. It’s not displayed — just exists in memory.
      const video = document.createElement("video");
      //This means the browser won’t load the full video (which could be huge) —it will only read header info, like:duration ,width/height, codec info
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        //We clean up (revokeObjectURL) the temporary file URL.Then we resolve(video.duration) which gives duration in seconds (e.g. 12.34).
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };

      video.onerror = () => {
        resolve(10); // Default to 10 seconds if can't read duration
      };
      //This line converts the File object (from <input type="file" />)into a temporary blob URL — so the browser can read it.
      video.src = URL.createObjectURL(file);
    });
  };

  //Every video file is passed to getVideoDuration.All are processed in parallel using Promise.all.You get an array like [5.43, 12.12, 7.89].
  //and then u just send the videodurations to formdata

  const openaihandler = async () => {
    try {
      const formData = new FormData();
      formData.append("prompt", prompt);

      // Get durations for all videos
      const videoDurations = await Promise.all(
        thevideos.map((video) => getVideoDuration(video))
      );
      // Add videos and their durations
      thevideos.forEach((video, index) => {
        formData.append("videos", video);
        formData.append(`duration_${index}`, videoDurations[index].toFixed(2));
      });

      const result = await axios.post("/api/ai", formData);
      if (result.data.success) {
        console.log(result.data.text);
        openaireply = result.data.text;
        const cleanjsonRaw = openaireply
          .replace("```json", "")
          .replace("```", "");
        const openaireply2 = JSON.parse(cleanjsonRaw);
        setreelData(openaireply2);
        router.push("/reelediting");
      }
    } catch (error) {
      console.log("Response error: ", error.message);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setsent(true)

    console.log("userid from context:", userid);

    if (!userid) {
      toast("User not logged in");
      return;
    }

    await fetchsubsdata();
    if (
      getSubscription[0].subscriptionstatus === "free" &&
      getSubscription[0].freetiercount < 7
    ) {
      console.log("free");
      console.log(getSubscription[0].freetiercount);
      setfreetiercount(getSubscription[0].freetiercount);
      // setfreetier(true);
    } else if (
      getSubscription[0].subscriptionstatus === "free" &&
      getSubscription[0].freetiercount === 7
    ) {
      console.log("free ended");
      setfreetierended(true);
      return;
    } else if (
      getSubscription[0].subscriptionstatus === "active" ||
      getSubscription[0].subscriptionstatus === "on_trial"
    ) {
      console.log("pro");
      setproplanactive(true);
    } else if (
      getSubscription[0].subscriptionstatus === "expired" &&
      getSubscription[0].freetiercount === 7
    ) {
      console.log("pro ended");
      setupdateproplan(true);
      return;
    } else if (
      getSubscription[0].subscriptionstatus === "expired" &&
      getSubscription[0].freetiercount < 7
    ) {
      console.log("free started again");
      setfreetiercount(getSubscription[0].freetiercount);
      setfreetier(true);
    } else if (getSubscription[0].subscriptionstatus === "cancelled") {
      setcancelproplan(true);
      setendat(getSubscription[0].endat);
    }
    //jb cancel aye to bs reminder de do k apki subscription is time per band hojayegi

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
        return res.data.secure_url; // Get the video URL
        //the urls would be stored in uploadresults
      })
    );

    setvideoUrls(uploadResults);

    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("userid", userid);
      formData.append("audio", audio);

      const { data } = await axios.post("/api/input", formData);
      console.log("here", data);
      if (data.success) {
        toast(" prompt added");
        console.log(data.audio);
        setaudiourl(data.audio);
        await openaihandler().catch((err) => console.error("AI Error:", err));
      }
    } catch (error) {
      toast("Not uploaded");
    }
    // }
  };

  //FormData for files, JSON for URLs/text!
  const handlefileselect = (e) => {
    const selectedfiles = Array.from(e.target.files);
    const forpreviews = selectedfiles.map((item)=> URL.createObjectURL(item) )
    //now since multiple files can be selected so we change the slectedfiles we get into array and put it into slectedfiles array
    setthevideos((prevVideos) => {
      const remainingslots = 10 - prevVideos.length;
      return [...prevVideos, ...selectedfiles.slice(0, remainingslots)];
      //spreads the old array and the new array into one single array.
      //only max of 10 can be uploaded
    });

    setthepreviews((prevPreview)=>{
      const remainingslots = 10 - prevPreview.length;
      return [...prevPreview, ...forpreviews.slice(0, remainingslots)];
    })
   
  };

  //will work only when it is live
  const handlerCustomerPortal = () => {
    window.location.href = " https://reelgenerator.lemonsqueezy.com/billing";
  };

  return (
    <div id="Createproject" className="bg-black text-white">
      <Navbar />
      {/* <Button onClick={handlerCustomerPortal}>Customer Portal</Button> */}
      <div className="mt-8 pb-24 flex flex-col items-center">
        <div className="pt-8 bg-gradient-to-b from-neutral-800 to-zinc-600 w-[700px] h-[550px] rounded-3xl flex flex-col items-center text-center">
          <p className={`${glikerExpanded.className} text-4xl pb-4 pt-12`}>
            Got an idea? <br /> Drop it here and we'll turn <br /> it into magic
          </p>

          <div className="flex flex-col">
            <div className="absolute top-18.5 left-[340px]">
              <Image src={catpanel} alt="cat" width={430} height={430} />
            </div>

            <form onSubmit={submitHandler} className="flex relative mt-10">
              <label htmlFor="audio">
                <Image
                  src={audioicon}
                  alt="audio"
                  width={16}
                  height={16}
                  className="absolute left-3 top-2 cursor-pointer"
                  required
                />
              </label>
              <Input
                onChange={(e) => setaudio(e.target.files[0])}
                accept="video/*"
                type="file"
                id="audio"
                hidden
              />

              <label htmlFor="videos">
                <Image
                  src={plus}
                  alt="add videos"
                  width={16}
                  height={16}
                  className="absolute left-9 top-2 cursor-pointer"
                />
              </label>

              {thevideos.length < 10 ? (
                <>
                  <Input
                    onChange={handlefileselect}
                    accept="video/*"
                    type="file"
                    id="videos"
                    multiple
                    hidden
                    disabled={thevideos.length >= 10}
                  ></Input>
                </>
              ) : (
                <></>
              )}

              <Input
                value={prompt}
                onChange={(e) => setprompt(e.target.value)}
                type="text"
                placeholder="Write your prompt"
                className="text-black pl-16"
              />

              <Button
                type="submit"
                size="sm"
                className="rounded-4xl absolute right-1 cursor-pointer"
              >
                <Image src={send} alt="send" width={16} height={16} />
              </Button>
            </form>
            {sent?
            <p className="pt-3 text-[10px]">Your reel is in process <br /> It may take a few minutes...</p>
            : null}
          </div>
          
           
              <Dialog open={freetierended} onOpenChange={setfreetierended}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Your Free tier has ended</DialogTitle>
                    <DialogDescription>
                      You’ve reached the limit of your free plan. To continue
                      enjoying all features, please upgrade to a premium plan.
                      Don’t worry — it’s quick and easy!
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            
         
          <div className="flex mt-7 mr-12">
            {thepreviews.map((files, index) =>
              index < 3 ? (
                <video
                  key={index}
                  src={files}
                  className="w-46 h-46 rounded-lg object-cover"
                  controls
                  alt=""
                />
              ) : null
            )}

            {thevideos.length > 3 ? (
              <p className={`${lexendgiga.className} pt-16 pl-5 text-2xl `}>
                +{thevideos.length - 3}
              </p>
            ) : null}
          </div>
        </div>
      </div>
      <Allprojects />
      <Footers />
    </div>
  );
};
export default Checker;

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
