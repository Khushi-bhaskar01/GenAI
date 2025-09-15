// "use client";
// import React from "react";
// import { AnimatedTooltip } from "../component/ui/animated-tooltip";
// const people = [
//   {
//     id: 1,
//     name: "Akshat Chaudhary",
//     designation: "The AI guy",
//     image:
//       "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
//   },
//   {
//     id: 2,
//     name: "Hritik Kumar",
//     designation: "He Knows Everything",
//     image:
//       "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
//   },
//   {
//     id: 3,
//     name: "Khushi Bhasker",
//     designation: "The Champ",
//     image:
//       "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
//   },
//   {
//     id: 4,
//     name: "Prapti Gupta",
//     designation: "Sweet Kido",
//     image:
//       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
//   },
//   {
//     id: 5,
//     name: "Aditya Singh",
//     designation: "You'll Never Know",
//     image:
//       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
//   },
// ];

// export function AnimatedTooltipPreview() {
//   return (
//     <div className="flex flex-row items-center justify-center mb-10 w-full">
//       <AnimatedTooltip items={people} />
//     </div>
//   );
// }



"use client";
import React from "react";
import { AnimatedTooltip } from "../component/ui/animated-tooltip";

const people = [
  {
    id: 1,
    name: "Akshat Chaudhary",
    designation: "The AI guy",
    image:
      "/akshat_img.jpg",
    linkedinUrl: "https://www.linkedin.com/in/akshat-chowdhary?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
  },
  {
    id: 2,
    name: "Hritik Kumar",
    designation: "He Knows Everything",
    image:
      "/hritik_img.jpg",
    linkedinUrl: "https://www.linkedin.com/in/hritik-kumar-a369ba228?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
  },
  {
    id: 3,
    name: "Khushi Bhasker",
    designation: "The Champ",
    image:
      "/khushi_img.jpg",
    linkedinUrl: "https://www.linkedin.com/in/khushi-bhaskar-b00586324?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
  },
  {
    id: 4,
    name: "Prapti Gupta",
    designation: "Knows What She's doing",
    image:
      "/prapti_img.jpg",
    linkedinUrl: "https://www.linkedin.com/in/prapti-gupta?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
  },
  {
    id: 5,
    name: "Aditya Singh",
    designation: "You'll Never Know",
    image:
      "/Aditya_img.jpg",
    linkedinUrl: "https://www.linkedin.com/in/aditya-singh-4aa4a5304?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
  },
];

export function AnimatedTooltipPreview() {
  return (
    <div className="flex flex-row items-center justify-center mb-10 w-full">
      <AnimatedTooltip items={people} />
    </div>
  );
}