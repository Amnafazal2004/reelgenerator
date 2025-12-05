"use client"
import FAQs from "@/appcomponents/FAQs";
import Header from "@/appcomponents/Header";
import Methods from "@/appcomponents/Methods";
import TopSection from "@/appcomponents/TopSection";
import Footers from "@/appcomponents/Footers";
import Checker from "@/app/Panel/Reelgenerator/page";
import { useReelContext } from '@/Context/ReelContext'


export default function Home() {
  const { showlogin } = useReelContext();
  return (
    <div className="scroll-smooth">
      
      <>
       
         
        <TopSection />
         <Methods/>
          <FAQs/>
          <Footers></Footers>
          {/* <Checker></Checker> */}
         
         </>

        
        
    
        
    
     
    </div>
  );
}
