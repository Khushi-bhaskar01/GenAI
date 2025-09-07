// import React from "react";
// import { useState } from "react";
// import { ShootingStarsAndStarsBackgroundDemo } from "../component/starbackground";
// import Navbar from "../component/Navbar";
// import Navbar2 from "../component/Navbar2";
// import Footer from "../component/Footer";
// import ProfilePanel2 from "../component/Dahsboard";
// // import Home from "../component/Home";
// // import Home from "../component/Homecopy";
// import Home from "../component/Homecopy2";
// import {  useEffect } from "react";

// const HomePage: React.FC = () => {
//   const [isProfileOpen, setIsProfileOpen] = useState(false);

//   return (
//     <div>
//       <ShootingStarsAndStarsBackgroundDemo />
//       {/* <div className="h-[62px] w-full bg-white/20 fixed inset-0"></div> */}
//       <div className="relative w-full min-h-screen">
//         {/* <Navbar /> */}
//         <Navbar2 onProfileClick={() => setIsProfileOpen(true)} />
//         <ProfilePanel2
//           isOpen={isProfileOpen}
//           onClose={() => setIsProfileOpen(false)}
//         />
//         <Home />

//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default HomePage;

import React from "react";
import { useState, useEffect } from "react";
import { ShootingStarsAndStarsBackgroundDemo } from "../component/starbackground";
import Navbar from "../component/Navbar";
import Navbar2 from "../component/Navbar2";
import Home from "../component/Homecopy2";
// import Home from "../component/Home";
// import Home from "../component/Homecopy";
import Dashboard from "../component/Dahsboard";
import Footer from "../component/Footer";

const HomePage: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const loggedin = true;
  const [showVideo, setShowVideo] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(false);
    }, 2000); // <-- duration of your video (ms)

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-screen">
      {showVideo ? (
        <video
          className="w-full h-full object-cover"
          src="/Nextskill.mp4"
          autoPlay
          muted
          playsInline
          onEnded={() => setShowVideo(false)} // also hides after video ends
        />
      ) : (
        <>
          <ShootingStarsAndStarsBackgroundDemo />
          <div className="relative w-full min-h-screen">
            {/* <Navbar /> */}
            {loggedin ? (
              <Navbar2 onProfileClick={() => setIsProfileOpen(true)} />
            ) : (
              <Navbar />
            )}
            <Dashboard
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
            />
            <Home />

            <Footer />
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
