

'use client';

import { useReelContext } from '@/Context/ReelContext';
import { Player } from '@remotion/player';
import { useCurrentFrame, Video } from 'remotion';
import React, { useEffect } from 'react'


// Yeh component JSON ke hisab se video banayega
export function ReelVideo({ reelData }) {
    const frame = useCurrentFrame();
    const currentTime = frame / 30; // 30 FPS

    // Current scene find karo
    const currentScene = reelData.timeline.find(scene =>
        currentTime >= scene.startTime && currentTime < scene.endTime
    );

    // Current text find karo
    const currentTexts = reelData.overlays.text.filter(text =>
        currentTime >= text.timing.start && currentTime <= text.timing.end
    );

    return (
         
        <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transition: 'background-color 0.5s'
        }}>
            
          {currentScene?
            <Video
             src={`/${currentScene.clip}.mp4`} // public folder se video
            
             style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                filter: currentScene ? `
            brightness(${100 + currentScene.effects.color_grading.brightness}%)
            contrast(${100 + currentScene.effects.color_grading.contrast}%)
            saturate(${100 + currentScene.effects.color_grading.saturation}%)
            ` : 'none'
            }}>

                {/* Center content
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50%',
                    paddingTop: '200px'
                }}>
                    <h1 style={{
                        color: 'white',
                        fontSize: 60,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                    }}>
                        {currentScene ? currentScene.id : 'Loading...'}
                    </h1>
                </div> */}
            </Video>
           : <></>}

            {/* Text overlays */}
            {currentTexts.map((text, index) => (
                <div
                    key={index}
                    style={{
                        position: 'absolute',
                        left: text.position.x === 'center' ? '50%' : text.position.x,
                        top: text.position.y,
                        transform: text.position.x === 'center' ? 'translateX(-50%)' : 'none',
                        color: text.color,
                        fontSize: text.fontSize,
                        fontWeight: 'bold',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        zIndex: 10
                    }}
                >
                    {text.content}
                </div>
            ))}
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
            <h2>JSON se Banay Gi Video:</h2>
            <Player
                component={() => <ReelVideo reelData={reelData} />}
                durationInFrames={(reelData.metadata.duration)* 30} // 6 seconds
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
