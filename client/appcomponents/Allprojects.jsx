import { useReelContext } from "@/Context/ReelContext";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { glikerExpanded, lexendgiga } from "@/lib/fonts";
import novideos from "@/Assets/novideos.png";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Footers from "./Footers";

const Allprojects = () => {
  const [projecturls, setprojecturls] = useState("");
  const { userid } = useReelContext();

  const fetchproject = async () => {
    const { data } = await axios.get("/api/input", {
      params: { id: userid },
    });
    console.log(data);
    setprojecturls(data);
  };

  useEffect(() => {
    fetchproject();
  }, [userid]);

  return (
    <div className="text-white bg-black pb-36 ">
      <h1 className={`${glikerExpanded.className} text-center text-4xl pb-16`}>
        Your Projects
      </h1>
      {projecturls?.videos?.length > 0 ? (
        projecturls?.videos?.slice(0, 2).map((files, index) => {
          <video
            key={index}
            src={URL.createObjectURL(files)}
            className="w-46 h-46 rounded-lg object-cover"
            controls
            alt=""
          />;
        })
      ) : (
        <div className="flex flex-col items-center ">
            <p className={`${lexendgiga.className} text-[10px] pb-5 opacity-95`} >Looks like your creativity is still loading… start your first project!</p>
            <h1 className={`${lexendgiga.className} text-xl`}>Oops! No projects detected.</h1>
            <Image src={novideos} alt="No videos available" className="w-32 h-32"/>
            <p className={`${lexendgiga.className} text-[10px] pb-5 opacity-95 text-center`}>Looks like you haven't created any projects yet! This space is completely blank which is perfect,  <br />because it’s waiting for your ideas, your creativity, your experiments.</p>
            <a href="#Createproject">
            <Button  size="lg">Start creating</Button>
            </a>
        </div>
      )}

     
    </div>
  );
};

export default Allprojects;
