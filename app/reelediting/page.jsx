

'use client';

import { useReelContext } from '@/Context/ReelContext';
import { Player } from '@remotion/player';
import { useCurrentFrame, Video, interpolate, Easing, useVideoConfig } from 'remotion';
import React, { useEffect } from 'react'
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { none } from "@remotion/transitions/none";
import { fade } from "@remotion/transitions/fade";

const getTransitions = (currentScene) => {
    const transition = currentScene.transitions.in.type
    switch (transition) {
        case "fade":
            return fade()
        case "slide_right":
            return slide({ direction: 'from-right' })
        case "slide_left":
            return slide({ direction: 'from-left' })
        case "slide_bottom":
            return slide({ direction: 'from-bottom' })
        case "slide_up":
            return slide({ direction: 'from-top' })
        default:
            return none()
    }
}



// Yeh component JSON ke hisab se video banayega
export function ReelVideo({ reelData }) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig()
    const currentTime = frame / 30; // 30 FPS


    // Current scene find karo
    const currentScene = reelData.timeline.find(scene =>
        currentTime >= scene.startTime && currentTime < scene.endTime
    );

    // Current text find karo
    const currentTexts = reelData.overlays.text.filter(text =>
        currentTime >= text.timing.start && currentTime < text.timing.end
    );
    console.log("currentScene", currentScene)
    console.log("currentTexts", currentTexts)
    let Videostyle = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        filter: currentScene ? `
            brightness(${100 + currentScene.effects.color_grading.brightness}%)
            contrast(${100 + currentScene.effects.color_grading.contrast}%)
            saturate(${100 + currentScene.effects.color_grading.saturation}%)
            `
            : 'none',
    }
    if (currentScene.transitions.in.type === "zoom_in") {
        const scale = interpolate(
            frame,
            [(currentScene.transitions.in.startTime) * 30, (currentScene.transitions.in.endTime) * 30],   // keyframes
            [0.5, 1],      // opacity values
            { easing: Easing.easeOut, extrapolateRight: "clamp" }
        );
        Videostyle.transform = `scale(${scale})`
    }

    return (

        <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transition: 'background-color 0.5s'
        }}>

          <TransitionSeries>
                {reelData.timeline.map((scene, index) => {
                    const sceneFrames = scene.duration * fps;
                    let sceneStyle = {
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        filter: `
                            brightness(${100 + scene.effects.color_grading.brightness}%)
                            contrast(${100 + scene.effects.color_grading.contrast}%)
                            saturate(${100 + scene.effects.color_grading.saturation}%)
                        `,
                    };

                    // Zoom_in effect as transform
                    if (scene.transitions?.in?.type === "zoom_in") {
                        const startFrame = scene.transitions.in.startTime * fps;
                        const endFrame = scene.transitions.in.endTime * fps;
                        const scale = interpolate(frame, [startFrame, endFrame], [0.5, 1], { easing: Easing.easeOut, extrapolateRight: 'clamp' });
                        sceneStyle.transform = `scale(${scale})`;
                    }

                    return (
                        <React.Fragment key={index}>
                            <TransitionSeries.Sequence durationInFrames={sceneFrames}>
                                <Video src={`/${scene.clip}.mp4`} style={sceneStyle} />
                            </TransitionSeries.Sequence>

                            <TransitionSeries.Transition
                                presentation={getTransitions(scene)}
                                timing={linearTiming({ durationInFrames: 30 })} // transition 1 sec
                            />
                        </React.Fragment>
                    );
                })}
            </TransitionSeries>
            

            {/* Text overlays */}
            {currentTexts.map((writing, index) => {
                let Textstyle = {
                    position: 'absolute',
                    left: writing.position.x === 'center' ? '50%' : writing.position.x,
                    top: writing.position.y,
                    transform: writing.position.x === 'center' ? 'translateX(-50%)' : 'none',
                    color: writing.color,
                    fontSize: writing.fontSize,
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                    zIndex: 10
                };

                // fade animation
                if (writing.animation?.type === "fade") {
                    const opacity = interpolate(
                        frame,
                        [writing.timing.start * fps, (writing.timing.start + writing.animation.duration) * fps],
                        [0, 1],
                        { easing: Easing.easeIn, extrapolateRight: "clamp" }
                    );
                    Textstyle.opacity = opacity;
                }

                // bounce animation
                if (writing.animation?.type === "bounce") {
                    const scale = spring({
                        fps,
                        frame: frame - writing.timing.start * fps,
                        config: {
                            damping: 6,
                            stiffness: 120,
                        },
                    });
                    Textstyle.transform += ` scale(${scale})`;
                }

                // typewriter animation
                const textContent = writing.animation?.type === "typewriter"
                    ? writing.content.slice(0, Math.max(0, frame - writing.timing.start * fps))
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

//Player is used so it can preview
export default function VideoPlayer() {
    const { reelData } = useReelContext()
    //  const cleanjsonRaw = reelData.replace("```json", "").replace("```", "")
    // const openaireply = JSON.parse(cleanjsonRaw)
    console.log("reelData in VideoPlayer:", reelData);
    return (
        <div>
            <Player
                component={() => <ReelVideo reelData={reelData} />}
                durationInFrames={(reelData.metadata.duration) * 30} // 6 seconds
                compositionWidth={1080}
                compositionHeight={1920}
                fps={30}
                controls
                style={{
                    width: 300,
                    height: 500
                }}
            />
        </div>
    );
}
