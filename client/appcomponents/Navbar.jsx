"use client";

import { glikerExpanded } from "@/lib/fonts";
import { Button } from "@/components/ui/button";
import { useReelContext } from "@/Context/ReelContext";
import { useSession } from "@/lib/auth-client";
import React, { useEffect, useState } from "react";
import Signout from "./Signout";
import Signin from "./Signin";
import Signup from "./Signup";
import Link from "next/link";

import Pricing from "./Pricing";

const Navbar = () => {
  const {
    setshowlogin,
    showlogin,
    signin,
    showpricingpopup,
    setshowpricingpopup,
  } = useReelContext();
  const { data: session, error, isPending } = useSession();

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

  // //this tells if the session is loaded
  // if (isPending) {
  //   return <div>Loading session...</div>;
  // }

  //why session failed to load
  // if (error) {
  //   console.error("Session error:", error);
  //   return <div>Session error: {error.message}</div>;
  // }

  return (
    <div className="bg-black text-white">
      <div className="flex justify-between pt-3 ">
        <Link href="/">
          <h1 className={`${glikerExpanded.className} text-2xl ml-14 `}>
            Riko
          </h1>
        </Link>
        <nav className="font-[lexendgiga] flex gap-20 text-[12px] mt-2 opacity-72">
          <a href="/">Home</a>
          <a href="#Demo">Demo</a>
          <a href="#FAQs">FAQs</a>
          <a href="#Contact Us">Contact Us</a>
        </nav>
        <div>
          <Button
            onClick={() => setshowpricingpopup(true)}
            className=" text-[10px]"
          >
            Pricing
          </Button>
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
        </div>
        {showlogin ? (
          <div className="absolute z-10 bg-[#00000090] size-full text-xs">
            <div className="absolute right-150 top-20">
              {signin ? <Signin /> : <Signup />}
            </div>
          </div>
        ) : null}
        {showpricingpopup ? (
          <>
            <Pricing />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Navbar;
