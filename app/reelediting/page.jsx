"use client"

import { useReelContext } from '@/Context/ReelContext';
import { Player } from '@remotion/player';
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import axios from "axios"
import { ReelVideo } from './ReelVideo';


export default function VideoPlayer() {
    const { reelData, audiourl, videoUrls } = useReelContext()
    const duration = Math.round(reelData.metadata.duration)
    const [playerRef, setPlayerRef] = React.useState(null);
    const title = reelData.metadata.title
    const audioRef = React.useRef(null);

    const handleDownload = async () => {
        const response = await axios.post(`/api/rendervideo?title=${encodeURIComponent(title)}`,{
            reelData,
            audiourl, 
            videoUrls
        }, {
            responseType: "blob",
        })
       
      if (response.data.success) {
            const videoUrl = response.data.reelurl;
            
            // Step 2: Fetch video as blob
            const videoResponse = await fetch(videoUrl);
            const blob = await videoResponse.blob();
            
            // Step 3: Trigger download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title}.mp4`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        }

}

// Sync audio with video player
useEffect(() => {
    if (!playerRef || !audioRef.current) return;

    const audio = audioRef.current;

    const handlePlay = () => {
        audio.currentTime = 0; // restart audio from beginning
        audio.play().catch(() => { }); // ignore autoplay errors
    };

    const handlePause = () => {
        audio.pause();
    };

    const handleSeek = () => {
        audio.currentTime = playerRef.current?.getCurrentFrame() / 30; // sync position to frame
    };

    const handleEnded = () => {
        audio.pause();
        audio.currentTime = 0; // reset after ending
    };

    playerRef.addEventListener?.('play', handlePlay);
    playerRef.addEventListener?.('pause', handlePause);
    playerRef.addEventListener?.('seeked', handleSeek);
    playerRef.addEventListener?.('ended', handleEnded);

    return () => {
        playerRef.removeEventListener?.('play', handlePlay);
        playerRef.removeEventListener?.('pause', handlePause);
        playerRef.removeEventListener?.('seeked', handleSeek);
        playerRef.removeEventListener?.('ended', handleEnded);
    };
}, [playerRef]);

return (
    <div>


        {/* Hidden audio element as backup */}
        {audiourl && !audioRef.current && (
            <audio ref={audioRef} src={audiourl} preload="auto" style={{ display: 'none' }} />
        )}


        <Player
            ref={setPlayerRef}
            component={ReelVideo}
            inputProps={{reelData,audiourl,videoUrls}}
            durationInFrames={(duration * 30)}
            compositionWidth={1080}
            compositionHeight={1920}
            fps={30}
            controls
            clickToPlay
            autoPlay={false}
            style={{
                width: 300,
                height: 500
            }}
        />
        <Button onClick={handleDownload} >Download</Button>
    </div>
);
}


// What is ref?
// ref is like a sticky note that you attach to an element so you can find it and control it later.

// Normal variable - Gets reset on every render
//let myAudio = null;  //  This gets reset to null every time component re-renders

// useRef - Persists across renders
//const audioRef = useRef(null);  // ✅ =This keeps its value even when component re-renders

// const [playerRef, setPlayerRef] = useState(null);
// // playerRef = null

// const audioRef = useRef(null);
// // audioRef = { current: null }


//sab se pehlay audioref aur player-ref dono null hain
//wo jb return main ghussa to usne Html ka audio element dekha where ref={audioref} to ref ne sticky note lagadia audio element per
//so ab audioref.current=<audio> (ye useRef currently kia horaha ye batata hai through current)
//(aur audio components k saarey elements audioref use kersakta)
//jesay hi wo Player component main ayega ref={setPlayerref} hogaya to matlab ref ne sticky note lagadia Playercomponent per
//ab jo playerref=<Player>  (iska matlab <Player> ye component k ander jo bhi functionalities hain wo player-ref use kersakta jesay k eventlisteners)
//now kyun k player-ref change hua aur use effect player ref per depend kerta hai to ab useeffect chalay ga foran
//playerref.addeventlistener?.('play',handleplay) ye event listeners chalyeingy
//agar play hai to handleplay ka function chalayga
//werna pause



//audio component k ander ye built in methods hotay hain

// // Ye sab methods HTML5 Audio API ke hain (browser provides)
// audio.play()           // Audio shuru karo
// audio.pause()          // Audio roko
// audio.load()           // Audio reload karo
// audio.fastSeek(time)   // Specific time pe jao (fast)

// // Aur properties bhi:
// audio.currentTime      // Current playback position (seconds me)
// audio.duration         // Total length (seconds me)
// audio.volume           // Volume (0.0 to 1.0)
// audio.playbackRate     // Speed (1.0 = normal, 2.0 = 2x speed)
// audio.paused           // true/false - paused hai ya nahi?
// audio.ended            // true/false - khatam hua ya nahi?

