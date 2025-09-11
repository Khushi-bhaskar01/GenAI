import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Navbar"; // logged-in navbar
import NavbarLogin from "./NavbarLogin"; // guest navbar
import Dashboard from "./Dahsboard";
import Footer from "./Footer";
import { ShootingStarsAndStarsBackgroundDemo } from "./starbackground";
import { useAuth } from "../context/authContext"; // ✅ use auth context

const Layout = () => {
  const { user, loading } = useAuth(); // get Firebase auth state
  const [showVideo, setShowVideo] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Intro video
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

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
            {user ? ( // ✅ logged-in user
              <Navbar onProfileClick={() => setIsProfileOpen(true)} />
            ) : (
              <NavbarLogin /> // ✅ guest view
            )}

            <Dashboard
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
            />

            <main>
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
