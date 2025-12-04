"use client"
import Checker from "@/appcomponents/Checker";
import Header from "@/appcomponents/Header";
import TopSection from "@/appcomponents/TopSection";
import { useReelContext } from '@/Context/ReelContext'


export default function Home() {
  const { showlogin } = useReelContext();
  return (
    <div>
      {showlogin ?
      <>
        <Header />
         <TopSection />
            </>
          :
        <TopSection />
      }
        
    
     
    </div>
  );
}
