

'use client';
// Cinematic & Dramatic
import "@fontsource/montserrat";
import "@fontsource/playfair-display";
import "@fontsource/oswald";
import "@fontsource/crimson-text";
import "@fontsource/libre-baskerville";
import "@fontsource/bodoni-moda";
import "@fontsource/dm-sans";
import "@fontsource/cormorant-garamond";
import "@fontsource/montserrat-alternates";
import "@fontsource/cinzel";
import "@fontsource/eb-garamond";
import "@fontsource/quicksand";

// Trendy & Aesthetic
import "@fontsource/poppins";
import "@fontsource/inter";
import "@fontsource/nunito";
import "@fontsource/source-sans-pro";
import "@fontsource/lato";

// Vintage & Vibes
import "@fontsource/merriweather";
import "@fontsource/lora";
import "@fontsource/pt-serif";
import "@fontsource/vollkorn";
import "@fontsource/alegreya";

// Modern & Minimal
import "@fontsource/roboto";
import "@fontsource/open-sans";
import "@fontsource/raleway";
import "@fontsource/work-sans";

import { useReelContext } from '@/Context/ReelContext';
import { Player } from '@remotion/player';
import { useCurrentFrame, Video, interpolate, Easing, useVideoConfig, Sequence, Audio } from 'remotion';
import React, { useEffect } from 'react';
import { spring } from 'remotion';

function getvideourls(clip, videourls) {
    const videono = parseInt(clip.replace('video', ''))
    return videourls[videono - 1]
}

// Yeh component JSON ke hisab se video banayega
export function ReelVideo({ reelData, audiourl }) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig()
    const { videoUrls } = useReelContext()
    const currentTime = frame / fps; // 30 FPS

    // Current text find karo
    const currentTexts = reelData.overlays.text.filter(text =>
        currentTime >= text.timing.start && currentTime < text.timing.end
    );

    return (
        <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            backgroundColor: reelData.metadata.backgroundcolor
        }}>
            {/* Video scenes */}
            {reelData.timeline.map((scene, index) => {
                const video = getvideourls(scene.clip, videoUrls)

                let sceneStyle = {
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    filter: `
                        brightness(${1 + (scene.effects.color_grading.brightness / 100)})
                        contrast(${1 + (scene.effects.color_grading.contrast / 100)})
                        saturate(${1 + (scene.effects.color_grading.saturation / 100)})
                    `,
                };

                // Zoom_in effect as transform
                if (scene.transitions?.type === "zoom_in") {
                    const startFrame = scene.transitions.startTime * fps;
                    const endFrame = scene.transitions.endTime * fps;
                    const scale = interpolate(frame, [startFrame, endFrame], [0.5, 1], { easing: Easing.easeOut, extrapolateRight: 'clamp' });
                    sceneStyle.transform = `scale(${scale})`;
                }
                if (scene.transitions?.type === "fadein") {
                    const startFrame = scene.transitions.startTime * fps;
                    const endFrame = scene.transitions.endTime * fps;
                    const opacity = interpolate(frame, [startFrame, endFrame], [0, 1], { easing: Easing.easeIn, extrapolateRight: "clamp" });
                    sceneStyle.opacity = opacity;
                }
                if (scene.transitions?.type === "fadeout") {
                    const startFrame = scene.transitions.startTime * fps;
                    const endFrame = scene.transitions.endTime * fps;
                    const opacity = interpolate(frame, [startFrame, endFrame], [1, 0], { easing: Easing.easeOut, extrapolateRight: "clamp" });
                    sceneStyle.opacity = opacity;
                }
                if (scene.transitions?.type === "slide_left") {
                    const startFrame = scene.transitions.startTime * fps;
                    const endFrame = scene.transitions.endTime * fps;
                    const translateX = interpolate(
                        frame,
                        [startFrame, endFrame],
                        [-1920, 0],
                        { easing: Easing.outExpo, extrapolateRight: "clamp" }
                    );
                    sceneStyle.transform = `translateX(${translateX}px)`;
                }
                if (scene.transitions?.type === "slide_right") {
                    const startFrame = scene.transitions.startTime * fps;
                    const endFrame = scene.transitions.endTime * fps;
                    const translateX = interpolate(
                        frame,
                        [startFrame, endFrame],
                        [1920, 0],
                        { easing: Easing.outExpo, extrapolateRight: "clamp" }
                    );
                    sceneStyle.transform = `translateX(${translateX}px)`;
                }
                if (scene.transitions?.type === "slide_bottom") {
                    const startFrame = scene.transitions.startTime * fps;
                    const endFrame = scene.transitions.endTime * fps;
                    const translateY = interpolate(
                        frame,
                        [startFrame, endFrame],
                        [1920, 0],
                        { easing: Easing.outExpo, extrapolateRight: "clamp" }
                    );
                    sceneStyle.transform = `translateY(${translateY}px)`;
                }
                if (scene.transitions?.type === "slide_up") {
                    const startFrame = scene.transitions.startTime * fps;
                    const endFrame = scene.transitions.endTime * fps;
                    const translateY = interpolate(
                        frame,
                        [startFrame, endFrame],
                        [-1920, 0],
                        { easing: Easing.outExpo, extrapolateRight: "clamp" }
                    );
                    sceneStyle.transform = `translateY(${translateY}px)`;
                }

                const overlapFrames = scene.transitions.type === 'none' ? 8 : 4
                const startFrame = index === 0 ? 0 : (scene.startTime * fps) - overlapFrames;
                const durationFrames = (scene.duration * fps) + (index === reelData.timeline.length - 1 ? 0 : overlapFrames);

                return (
                    <div key={index} style={sceneStyle}>
                        <Sequence
                            from={startFrame}
                            durationInFrames={durationFrames}
                        >
                            <Video
                                src={video}
                                style={sceneStyle}
                                pauseWhenBuffering={false}
                                muted
                            />
                        </Sequence>
                    </div>
                );
            })}
            {audiourl && (
                <Audio
                    src={audiourl}
                     volume={1}
                />
            )}

            {/* Text overlays */}
            {currentTexts.map((writing, index) => {
                let Textstyle = {
                    position: 'absolute',
                    left: writing.position.x === 'center' ? '50%' : writing.position.x,
                    top: writing.position.y,
                    transform: writing.position.x === 'center' ? 'translateX(-50%)' : 'none',
                    fontFamily: writing.font,
                    fontSize: writing.fontSize,
                    fontWeight: writing.fontWeight,
                    lineHeight: '1.3',
                    textAlign: 'center',
                    maxWidth: '85%',
                    color: writing.color,
                    textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.4)',
                    zIndex: 10,
                    wordWrap: 'break-word'
                };

                if (writing.animation?.type === "fadein") {
                    const opacity = interpolate(
                        frame,
                        [writing.animation.startTime * fps, (writing.animation.endTime) * fps],
                        [0, 1],
                        { easing: Easing.easeIn, extrapolateRight: "clamp" }
                    );
                    Textstyle.opacity = opacity;
                }
                if (writing.animation?.type === "fadeout") {
                    const opacity = interpolate(
                        frame,
                        [writing.animation.startTime * fps, (writing.animation.endTime) * fps],
                        [1, 0],
                        { easing: Easing.easeOut, extrapolateRight: "clamp" }
                    );
                    Textstyle.opacity = opacity;
                }
                if (writing.animation?.type === "bounce") {
                    const scale = spring({
                        fps,
                        frame: frame - writing.animation.startTime * fps,
                        config: {
                            damping: 6,
                            stiffness: 120,
                        },
                    });
                    Textstyle.transform += ` scale(${scale})`;
                }

                const textContent = writing.animation?.type === "typewriter"
                    ? writing.content.slice(0, Math.max(0, frame - writing.animation.startTime * fps))
                    : writing.content;

                return (
                    <div key={index} style={Textstyle}>
                        {textContent}
                    </div>
                );
            })}
        </div>
    );
}

export default function VideoPlayer() {
    const { reelData, audiourl } = useReelContext()
    const duration = Math.round(reelData.metadata.duration)
    const [playerRef, setPlayerRef] = React.useState(null);
    const audioRef = React.useRef(null);

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
                component={() => <ReelVideo reelData={reelData} audiourl={audiourl} />}
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

