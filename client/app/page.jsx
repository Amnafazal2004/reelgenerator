"use client";
import FAQs from "@/appcomponents/FAQs";
import Methods from "@/appcomponents/Methods";
import TopSection from "@/appcomponents/TopSection";
import Footers from "@/appcomponents/Footers";

export default function Home() {
  return (
    <div className="scroll-smooth">
      <>
        <TopSection />
        <Methods />
        <FAQs />
        <Footers></Footers>
      </>
    </div>
  );
}
