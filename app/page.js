"use client"
import Checker from "@/appcomponents/Checker";
import Signin from "@/appcomponents/Signin";
import Signout from "@/appcomponents/Signout";
import Signup from "@/appcomponents/Signup";

import Header from "@/appcomponents/Header";
import { useReelContext } from '@/Context/ReelContext'
import { Button } from "@/components/ui/button";

export default function Home() {
  const { showlogin } = useReelContext();
  return (
    <div >
      {showlogin ?
      <>
        <Header />
         <Checker />
            </>
          :
        <Checker />
      }
        
    
     
    </div>
  );
}
