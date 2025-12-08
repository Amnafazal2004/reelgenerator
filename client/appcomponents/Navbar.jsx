"use client";

import { glikerExpanded } from "@/lib/fonts";
import { Button } from "@/components/ui/button";
import { useReelContext } from "@/Context/ReelContext";
import { useSession } from "@/lib/auth-client";
import React, { useEffect, useState } from "react";
import Signout from "./Signout";
import Signin from "./Signin";
import Signup from "./Signup";
import GoogleSignin from "./Googlesignin";
import { variantid } from "@/components/lemonsqueezyvariables";
import axios from "axios";

const Navbar = () => {
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
    <div className="bg-black text-white">
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
    </div>
  )
}

export default Navbar