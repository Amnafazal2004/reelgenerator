import { glikerExpanded, lexendgiga } from "@/lib/fonts";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQs = () => {
  const questions = [
    "What is Riko Reel Generator?",
    "How long does it take to generate a reel?",
    " What's the maximum length for a reel?",
    "How does the free trial work?",
    "Can I use my own audio/music?",
    " What makes a good prompt?",
  ];

  const answers = [
    "Riko is an AI-powered tool that transforms your images and videos into engaging, professional-looking reels. Just upload your content, write a creative prompt, and let Riko handle the rest with automatic animations, transitions, and effects.",
    "Reel generation typically takes 1-2 minutes depending on the complexity of your content and the effects you've requested.",
    "Currently, you can create reels up to 30 seconds long - perfect for Instagram Reels, TikTok, and YouTube Shorts!",
    "New users get 7 free reel downloads to try out Riko! After your 7 downloads, you'll need to upgrade to a paid plan to continue creating and downloading reels.",
    "Absolutely! Upload your own audio file to make your reel truly unique and on-brand.",
    "Be specific and creative! Instead of `make it cool`, try `add a smooth fade-in transition with bold white text, and an aesthetic vibe` The more details you provide, the better Riko understands your vision.",
  ];
  let count = 0;
  return (
    <div className="text-white bg-black  pb-24">
      <h1 className={`${glikerExpanded.className} text-center text-3xl pb-16`}>
        FAQs
      </h1>
      <div className="w-[600px] h-[400px] mx-auto">
          <Accordion type="single" collapsible>
        {questions.map((question, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionTrigger className={`${lexendgiga.className}`} >{question}</AccordionTrigger>
            <AccordionContent className={`${lexendgiga.className} opacity-80 text-[12px]`} >{answers[index]}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      </div>
    
    </div>
  );
};

export default FAQs;
