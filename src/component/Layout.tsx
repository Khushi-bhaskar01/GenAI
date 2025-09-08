import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./NavbarLogin";
import NavbarLogin from "./Navbar";
import Dashboard from "./Dahsboard";
import Footer from "./Footer";
import { ShootingStarsAndStarsBackgroundDemo } from "./starbackground";

const Layout = () => {
  const loggedin = true;
  const [showVideo, setShowVideo] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // For intro video at just starting of the page
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-screen">
      {showVideo ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/Nextskill.mp4"
          autoPlay
          muted
          playsInline
          onEnded={() => setShowVideo(false)}
        />
      ) : (
        <>
          <ShootingStarsAndStarsBackgroundDemo />
          <div className="relative w-full min-h-screen">
            {loggedin ? (
              <NavbarLogin onProfileClick={() => setIsProfileOpen(true)} />
            ) : (
              <Navbar />
            )}
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
