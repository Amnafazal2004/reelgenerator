"use client";

import { glikerExpanded } from "@/lib/fonts";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import cathero from "@/Assets/cathero.png";
import headerimg11 from "@/Assets/headerimg11.png";
import headerimg22 from "@/Assets/headerimg22.png";
import Link from "next/link";
import React from "react";
import Navbar from "./Navbar";
import { useSession } from "@/lib/auth-client";

const TopSection = () => {
  const { data: session } = useSession();;

  return (
    <div className="bg-black text-white pb-32">
      <Navbar />

      <div className="flex justify-between  ml-28  mr-60">
        <div className="mt-28">
          <div className="relative inline-block">
            <h1
              className={`${glikerExpanded.className} text-[150px] leading-none`}
            >
              Riko
            </h1>
            <div className="absolute -top-22.5 left-36 w-64 h-64">
              <Image src={cathero} alt="catimage" width={320} height={320} />
            </div>
          </div>

          <p className="opacity-66 font-[lexendgiga] text-[12px]">
            Hey, I'm Riko, your new reel-maker. I take your random ideas,
            half-baked thoughts, <br /> and “should I post this?” moments and
            turn them into clean, aesthetic,scroll stopping reels <br /> in
            seconds. I make sure your content looks polished, on-brand, and
            ready to grab attention <br /> without you stressing over editing
            apps, music syncing, or awkward transitions.
          </p>
          {session?.user ? (
            <Link href="/Panel/Reelgenerator">
              <Button className=" text-[12px] mt-3 hover:bg-gray-200" size="lg">
                Start Now
              </Button>
            </Link>
          ) : (
            <Button className=" text-[12px] mt-3 hover:bg-gray-200" size="lg">
                Start Now
              </Button>
            
          )}
        </div>
        <div className="mt-8">
          <div className="relative w-80 h-80 flex">
            <Image
              src={headerimg11}
              alt="Background"
              width={200}
              height={200}
              className="absolute"
            />
            <Image
              src={headerimg22}
              alt="Overlay"
              width={256}
              height={256}
              className="absolute left-44 top-7"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSection;
