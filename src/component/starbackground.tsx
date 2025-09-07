// import React from "react";
// import { ShootingStars } from "./ui/shooting-stars";
// import { StarsBackground } from "./ui/stars-background";

// export function ShootingStarsAndStarsBackgroundDemo() {
//   return (
//     <div className="fixed inset-0 -z-10 w-full min-h-screen bg-neutral-900 overflow-hidden">
//       {/* Background */}
//       <StarsBackground className="pointer-events-none" />
//       <ShootingStars className="pointer-events-none" />
//     </div>
//   );
// }


// component/starbackground.tsx
import React from "react";
import { ShootingStars } from "./ui/shooting-stars";
import { StarsBackground } from "./ui/stars-background";

export function ShootingStarsAndStarsBackgroundDemo() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none bg-black">
      {/* canvases render but never catch input */}
      <StarsBackground />
      <ShootingStars />
    </div>
  );
}

