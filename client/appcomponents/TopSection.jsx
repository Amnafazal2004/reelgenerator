"use client";

import { glikerExpanded } from "@/lib/fonts";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import cathero from "@/Assets/cathero.png";
import headerimg11 from "@/Assets/headerimg11.png";
import headerimg22 from "@/Assets/headerimg22.png";
import Link from "next/link";
import { useReelContext } from "@/Context/ReelContext";
import { useSession } from "@/lib/auth-client";
import React, { useEffect, useState } from "react";
import Signout from "./Signout";
import Signin from "./Signin";
import Signup from "./Signup";
import GoogleSignin from "./Googlesignin";
import { variantid } from "@/components/lemonsqueezyvariables";
import axios from "axios";


const TopSection = () => {
  const { setshowlogin, showlogin, email, freetiercount } = useReelContext();
  const { data: session, error, isPending } = useSession();
  const [showpricingpopup,setshowpricingpopup] = useState();
   const [subscriptionstatus, setsubscriptionstatus] = useState("free");
    const [subscriptionId, setsubscriptionId] = useState("");
    const [endat, setendat] = useState("");

  //session k ander saara data hoga of user database and session database
  //error k ander, agar koi problem hojayega to wo batayega kis wajah se
  //ispending is basically k session load hua k nhi

  // (this is optional too)
  useEffect(() => {
    console.log("Session state changed:", { session, error, isPending });
  }, [session, error, isPending]);

  // Also check cookies (marzi hai kero ya nhi kero optional)
  useEffect(() => {
    console.log("All cookies:", document.cookie);
  }, []);

  //this tells if the session is loaded
  if (isPending) {
    return <div>Loading session...</div>;
  }

  //why session failed to load
  if (error) {
    console.error("Session error:", error);
    return <div>Session error: {error.message}</div>;
  }

    const handlefreetier = async () => {
      
      console.log("in free tier");
      const { data } = await axios.post("/api/freetier", {
        email,
        subscriptionId,
        subscriptionstatus,
        endat,
        freetiercount,
      });
      if (data.success) {
        console.log(data.message);
      }
    };

    const handlePurchase = async () => {
        const { data } = await axios.post("/api/checkout", {
          variantid,
          email,
          subscriptionId,
          subscriptionstatus,
          freetiercount,
          endat,
        });
        if (data.success) {
          console.log("bro");
          window.location.href = data.url; //for external redirect
        }
      };

  return (
    <div className="bg-black text-white pb-32">
      <div className="flex justify-between pt-3 ">
        <h1 className={`${glikerExpanded.className} text-2xl ml-14 `}>Riko</h1>
        <nav className="font-[lexendgiga] flex gap-20 text-[12px] mt-2 opacity-72">
          <a href="/">Home</a>
          <a href="#Demo">Demo</a>
          <a href="#FAQs">FAQs</a>
          <a href="#Contact Us">Contact Us</a>
        </nav>
        <div>
          <Button onClick={()=>setshowpricingpopup(true)} className=" text-[10px]">Pricing</Button>
          {showpricingpopup?
           <>
           <Button onClick={handlefreetier}>Start Free trial Now</Button>
            <Button onClick={handlePurchase}>Pro Plan</Button>
          </> : 
          <>
          </>}
          {session?.user ? (
            <Signout />
          ) : (
            <>
              <Button
                onClick={() => setshowlogin(true)}
                className="mr-24 text-[10px]"
                variant="custom1"
              >
                Login
              </Button>
            </>
          )}

          {showlogin ? (
            <div>
              <p>Not signed in</p>
              <Signin />
              <GoogleSignin />
              <Signup />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

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
          <Link href="/Panel/Reelgenerator">
            <Button className=" text-[12px] mt-3 hover:bg-gray-200" size="lg">
              Start Now
            </Button>
          </Link>
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
