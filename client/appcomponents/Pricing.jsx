import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useReelContext } from "@/Context/ReelContext";
import { variantid } from "@/components/lemonsqueezyvariables";
import axios from "axios";

const Pricing = () => {
  const { email, freetiercount, showpricingpopup, setshowpricingpopup } =
    useReelContext();
  const { data: session } = useSession();
  const [subscriptionstatus, setsubscriptionstatus] = useState("free");
  const [subscriptionId, setsubscriptionId] = useState("");
  const [endat, setendat] = useState("");
  const [notsignedin, setnotsignedin] = useState(false);
  const [infreetier, setinfreetier] = useState(false);
  const handlefreetier = async () => {
    setshowpricingpopup(false)
    setinfreetier(false)
    if (!session?.user) {
      setnotsignedin(true);
      return;
    }
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
    if (!session?.user) {
      setnotsignedin(true);
      return;
    }
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
    <div>
      <Dialog open={showpricingpopup} onOpenChange={setshowpricingpopup}>
        <DialogContent className="sm:max-w-[700px] h-120 max-w-[90%] bg-black text-white ">
          <DialogHeader>
            <DialogTitle className={` text-center text-2xl pt-4`}>
              Choose your plan, unleash your creativity.
            </DialogTitle>
            <DialogDescription className={` text-[10px] text-center`}>
              Whether you're experimenting or building an empire, we got you.
              Unlock the tools <br /> that make your content hit different
            </DialogDescription>
            <div className="flex justify-around mt-6 ">
              <div className="border  rounded-3xl p-7">
                <h3 className={`text-2xl mb-3`}>Free Plan</h3>
                <ul className={`font-[poppins] text-[12px]`}>
                  <li>✔️ Create unlimited reel previews</li>
                  <li>✔️ 7 free downloads</li>
                  <li>✔️ Preview reels without any limit</li>
                  <li>✔️ Access to all basic editing tools</li>
                  <li>✔️ No credit card required</li>
                </ul>
                <AlertDialog>
                  <AlertDialogTrigger onClick={()=>setinfreetier(true)} className="mt-6 h-9 rounded-3xl px-16 bg-white text-black shadow-xs hover:bg-gray-200 font-[poppins] text-sm">
                      Start Free Now
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Confirming this action will start your free trial
                        immediately. This cannot be undone, and your current
                        progress or settings may be affected.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction  onClick={handlefreetier}
                      >Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="border  rounded-3xl p-7">
                <h3 className={`text-2xl mb-3`}>Pro Plan</h3>
                <ul className={`font-[poppins] text-[12px]`}>
                  <li>✔️ 14-day free trial</li>
                  <li>✔️ Unlimited reel downloads</li>
                  <li>✔️ Automatic billing after trial</li>
                  <li>✔️ Full aesthetic control</li>
                  <li>✔️ Zero watermark</li>
                </ul>
                <Button onClick={handlePurchase} size="lg" className="mt-6 font-[poppins]">
                  Purchase Pro
                </Button>
              </div>
            </div>
          </DialogHeader>
          {notsignedin ? (
            <div className="text-red-700 text-center text-[12px] font-semibold">
              Not signed in, You need to login to Continue
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {infreetier ? (
        <Dialog>
          <DialogContent className=" bg-black text-white ">
            <DialogHeader>
              <DialogTitle className={` text-center text-2xl pt-4`}>
                Free Trial
              </DialogTitle>
              <DialogDescription className={` text-[10px] text-center`}>
                Your free trial has started
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
};

export default Pricing;
