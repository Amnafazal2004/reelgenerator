import React from "react";
import { glikerExpanded } from "@/lib/fonts";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import cathero from "@/Assets/cathero.png";
import headerimg11 from "@/Assets/headerimg11.png";
import headerimg22 from "@/Assets/headerimg22.png";

const TopSection = () => {
  return (
    <div className="bg-black text-white">
      <div className="flex justify-between pt-3 ">
        <h1 className={`${glikerExpanded.className} text-2xl ml-14 `}>Riko</h1>
        <ul className="font-[lexendgiga] flex gap-20 text-[12px] mt-2 opacity-72">
          <li>Home</li>
          <li>Demo</li>
          <li>FAQs</li>
          <li>Contact Us</li>
        </ul>
        <div>
          <Button className=" text-[10px]">Pricing</Button>
          <Button className="mr-24 text-[10px]" variant="custom1">
            Login
          </Button>
        </div>
      </div>

      <div className="flex justify-between  ml-20 ">
        <div className="mt-24">
          <div className="relative inline-block">
            <h1
              className={`${glikerExpanded.className} text-[150px] leading-none`}
            >
              Riko
            </h1>
            <div className="absolute w-64 h-64">
              <Image
                src={cathero}
                alt="catimage"
                width={320}
                height={320}
                className="top-0 left-[50%] "
              />
            </div>
          </div>

          <p className="opacity-66 font-[lexendgiga] text-[12px]">
            Hey, I'm Riko, your new reel-maker. I take your random ideas,
            half-baked thoughts, and “should I post this?” moments and turn them
            into clean, aesthetic,  <br /> scroll stopping reels in seconds.
             I make sure
            your content looks polished, on-brand, and ready to grab
            attention without    you stressing over editing apps, <br /> music syncing, or
            awkward transitions. Whether it’s a quirky snippet from your day, a
            viral challenge, or that  “oops, I didn’t plan this” moment.
            
          </p>
          <Button className=" text-[12px] mt-3" size="lg">
            Start Now
          </Button>
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
