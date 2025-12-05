import React from "react";
import Image from "next/image";
import paw from "@/Assets/paw.png";
import { glikerExpanded } from "@/lib/fonts";
import { lexendgiga } from "@/lib/fonts";
import { bricebold } from "@/lib/fonts";
import headerimg22 from "@/Assets/headerimg22.png";
import { Button } from "@/components/ui/button";

const Methods = () => {
  return (
    <div id="Demo" className="bg-black text-white pt-7">
      <div className="flex justify-between ml-28  mr-20 pb-24 ">
        <div className="w-64 h-0 relative">
          <Image
            src={paw}
            alt="paw"
            width={320}
            height={320}
            className="absolute -top-24  right-32"
          />
        </div>
        <div>
          <p
            className={`${glikerExpanded.className} text-3xl mr-5  pl-20 mt-0 mb-0`}
          >
            Your shorcut
          </p>
          <p className={`${glikerExpanded.className} text-3xl mr-5  mt-0 mb-0`}>
            to looking creative
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="ml-24">
          <h1
            className={`${bricebold.className} absolute -bottom-18 left-32 opacity-51 text-5xl`}
          >
            01
          </h1>
          <p
            className={`${glikerExpanded.className} text-2xl pb-6 text-center`}
          >
            Add your <br /> videos/images
          </p>
          <p
            className={`${lexendgiga.className} opacity-74 text-[10px] w-64 text-center`}
          >
            Upload your photo or clip — anything you want to turn into a reel.
            Quick, easy, and ready to transform
          </p>
        </div>

        {/* Vertical Line */}
        <div className="w-px bg-white opacity-30 self-stretch"></div>

        <div className="relative">
          <p
            className={`${lexendgiga.className}  opacity-74 text-[10px] w-64 text-center pb-6`}
          >
            Tell Riko what you want! Be creative, funny, or aesthetic your words
            guide the magic. You can also add transitions, text animations like
            typewriter effects, and cool fonts to make your reel truly pop.
          </p>
          <h1
            className={`${bricebold.className} absolute text-center right-44 opacity-51 text-4xl`}
          >
            02
          </h1>
          <p className={`${glikerExpanded.className} text-center text-2xl `}>
            Write your <br /> prompt
          </p>
        </div>

        {/* Vertical Line */}
        <div className="w-px bg-white opacity-30 self-stretch"></div>

        <div className="mr-24">
          <h1
            className={`${bricebold.className} absolute -bottom-18 right-68 opacity-51 text-4xl`}
          >
            03
          </h1>
          <p
            className={`${glikerExpanded.className} text-center text-2xl pb-6`}
          >
            Click send
          </p>
          <p
            className={`${lexendgiga.className}  opacity-74 text-[10px] w-64 text-center`}
          >
            Hit that send button and let Riko work its magic. Watch as your
            image, video, and prompt come together with all the animations,
            fonts, and effects you added. Sit back, relax, and enjoy the show!
          </p>
        </div>
      </div>

      <div className="mt-24 pb-24 flex flex-col items-center ">
        <div className="flex justify-center relative pb-8">
          <h1 className={`${bricebold.className}  opacity-51 text-5xl`}>04</h1>
          <p className={`${glikerExpanded.className}  text-2xl pt-4 `}>
            Enjoy the preview and download your reel
          </p>
        </div>

        <div className="pt-8 bg-gradient-to-b from-neutral-800 to-zinc-600 w-[700px] h-[550px] rounded-3xl flex flex-col items-center">
          <p className={`${lexendgiga.className} text-[10px] pb-4`}>
            Your reel is ready!
          </p>
          <div className="w-64 h-64 ">
            <Image src={headerimg22} alt="reel image" />
          </div>
          <Button className="mt-44">Download Now</Button>
        </div>
      </div>
    </div>
  );
};

export default Methods;
