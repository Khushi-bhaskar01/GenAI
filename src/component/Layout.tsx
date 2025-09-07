import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Navbar2 from "./Navbar2";
import Dashboard from "./Dahsboard";
import { ShootingStarsAndStarsBackgroundDemo } from "./starbackground";
import { Divide } from "lucide-react";

const Layout = () => {
  const loggedin = false;
  const [showVideo, setShowVideo] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
            {loggedin ? <Navbar2 /> : <Navbar />}
            <Dashboard
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
            />
            <main className="">
              <Outlet />
            </main>
            <Footer />
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;
