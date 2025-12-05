// import React from "react";
// import Linkedinicon from "@/Assets/linkdeinicon.png";
// import Instagramicon from "@/Assets/instagramicon.png";
// import mailicon from "@/Assets/mailicon.png";
// import cathero from "@/Assets/cathero.png";
// import paw from "@/Assets/paw.png";
// import Image from "next/image";
// import { glikerExpanded, lexendgiga } from "@/lib/fonts";

// const Footers = () => {
//   return (
//     <div className="bg-black text-white">
//       <div className="flex justify-between pb-10">
//         <div className="ml-24">
//           <h1 className={`${glikerExpanded.className} text-3xl `}>
//             Contact Us
//           </h1>
//           <div className="flex relative">
//             <Image
//               src={Linkedinicon}
//               alt="linkedin"
//               className="absolute -bottom-60 w-[300px] h-[300px]"
//             />
//             <Image
//               src={Instagramicon}
//               alt="instagram"
//               className="absolute -bottom-60 w-[300px] h-[300px]"
//             />
//             <Image
//               src={mailicon}
//               alt="mail"
//               className="absolute -bottom-60 w-[300px] h-[300px]"
//             />
//           </div>
//         </div>

//         <div className="w-[500px] opacity-80 pl-12 pb-10">
//           <p className={`${lexendgiga.className} text-[13px] text-left pl-64 `}>
//             riko@gmail.com
//           </p>
//           <p className={`${lexendgiga.className} text-[10px] `}>
//             Made with love by Riko. We help you turn every idea, moment, <br />{" "}
//             or vibe into scroll-stopping reels in seconds. No complicated <br />{" "}
//             editing, no stress — just fast, creative content that makes your{" "}
//             <br /> feed pop. Keep creating, keep posting, and stay iconic.
//           </p>
//         </div>
//       </div>

//       <div>
//         <hr />
//         <div className="flex pt-4 relative ">
//           <div className="w-64 h-0 relative">
//             <Image
//               src={paw}
//               alt="paw"
//               width={320}
//               height={320}
//               className="absolute -top-24  right-22"
//             />
//           </div>
//           <p className={`${lexendgiga.className} text-[12px] pl-52`}>
//             © 2025 Riko. All rights reserved. Create, share, and make every reel
//             count.
//           </p>
          
//           <Image
//             src={cathero}
//             alt="cat"
//             width={320}
//             height={320}
//             className="absolute -bottom-28 -right-24"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Footers;

import React from "react";
import Linkedinicon from "@/Assets/linkdeinicon.png";
import Instagramicon from "@/Assets/instagramicon.png";
import mailicon from "@/Assets/mailicon.png";
import cathero from "@/Assets/cathero.png";
import paw from "@/Assets/paw.png";
import Image from "next/image";
import { glikerExpanded, lexendgiga } from "@/lib/fonts";

const Footers = () => {
  return (
    <div className="bg-black text-white overflow-hidden">
      <div className="flex justify-between pb-10">
        <div className="ml-24">
          <h1 className={`${glikerExpanded.className} text-3xl `}>
            Contact Us
          </h1>
          <div className="flex relative">
            <Image
              src={Linkedinicon}
              alt="linkedin"
              className="absolute -bottom-60 w-[300px] h-[300px]"
            />
            <Image
              src={Instagramicon}
              alt="instagram"
              className="absolute -bottom-60 w-[300px] h-[300px]"
            />
            <Image
              src={mailicon}
              alt="mail"
              className="absolute -bottom-60 w-[300px] h-[300px]"
            />
          </div>
        </div>

        <div className="w-[500px] opacity-80 pl-12 pb-10">
          <p className={`${lexendgiga.className} text-[13px] text-left pl-64 `}>
            riko@gmail.com
          </p>
          <p className={`${lexendgiga.className} text-[10px] `}>
            Made with love by Riko. We help you turn every idea, moment, <br />{" "}
            or vibe into scroll-stopping reels in seconds. No complicated <br />{" "}
            editing, no stress — just fast, creative content that makes your{" "}
            <br /> feed pop. Keep creating, keep posting, and stay iconic.
          </p>
        </div>
      </div>

      <div className="pb-4"> {/* Changed h-0 to pb-4 */}
        <hr />
        <div className="flex pt-4 relative">
          <div className="w-64 h-0 relative">
            <Image
              src={paw}
              alt="paw"
              width={320}
              height={320}
              className="absolute -top-24 right-22"
            />
          </div>
          <p className={`${lexendgiga.className} text-[12px] pl-52`}>
            © 2025 Riko. All rights reserved. Create, share, and make every reel
            count.
          </p>
          
          <Image
            src={cathero}
            alt="cat"
            width={320}
            height={320}
            className="absolute -bottom-28 -right-24"
          />
        </div>
      </div>
    </div>
  );
};

export default Footers;