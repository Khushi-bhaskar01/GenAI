import React from "react";
import { ShootingStarsAndStarsBackgroundDemo } from "./starbackground";
import Navbar2 from "./Navbar2";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { GlowingEffectDemo } from "./glowing-effect";
import { GlowingEffect } from "./ui/glowing-effect";
import Spline from "@splinetool/react-spline";
import { SparklesPreview } from "./sparkles";
import { TextHoverEffect } from "./ui/text-hover-effect";
import { AnimatedTooltipPreview } from "./Connect-team";
import { WavyBackground } from "./ui/wavy-background";
import {
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from "./ui/text-reveal-card";
const Home: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black/10 text-white">
      {/* Background */}
      <ShootingStarsAndStarsBackgroundDemo />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 pt-20">
        {/* Left - Text */}
        <div className="flex-1 space-y-6 justify-between items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl lg:text-6xl font-bold leading-tight"
          >
            We Don’t Show You the Future <br />
            <div className="w-3xl m-auto border-white border-3 mt-6"></div>
            <div className="h-[15rem] flex items-center justify-center p-0">
              <TextHoverEffect text="We Built It" />
            </div>
          </motion.h1>
          {/* <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-gray-400 text-lg max-w-lg m-auto"
          >
            Unlock your hidden potential. Discover skills you didn’t know you
            had. Let AI craft your roadmap to mastery.
          </motion.p> */}
          <div className="flex items-center justify-center bg-transparent h-[10rem] rounded-2xl w-full py-15">
            <TextRevealCard
              text="Empower Your Skills With"
              revealText="NEXTskills"
            >
              {/* <TextRevealCardTitle>
              Sometimes, you just need to see it.
            </TextRevealCardTitle>
            <TextRevealCardDescription>
              This is a text reveal card. Hover over the card to reveal the
              hidden text.
            </TextRevealCardDescription>  */}
            </TextRevealCard>
          </div>
        </div>
      </section>
      {/* <WavyBackground /> */}

      <div
        className="relative h-[140vh] bg-contain bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: `url('/spacebgimage.jpg')`,
        }}
      >
        <div className="flex justify-center items-center relative z-10 p-10 bg-black/90">
          {/* Screen Frame */}
          <div className="relative w-full max-w-4xl bg-gradient-to-br from-gray-800 via-gray-900 to-black border-4 border-gray-700 rounded-3xl p-8 shadow-2xl">
            {/* Screen Bezel */}
            <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-gray-800 rounded-2xl overflow-hidden">
              {/* Subtle Scanlines Effect */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-gradient-to-b from-transparent via-blue-500/5 to-transparent animate-pulse"></div>
              </div>

              {/* Screen Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-12 text-center">
                {/* Main Text */}
                <div className="mb-12 space-y-6">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
                    Unlock your{" "}
                    <span className="text-blue-400 font-medium">
                      hidden potential
                    </span>
                    .
                  </h1>

                  <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-2xl">
                    Discover skills you didn't know you had.
                  </p>

                  <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl">
                    Let AI craft your roadmap to mastery.
                  </p>
                </div>

                {/* Terminal-style Cursor */}
                <div className="mb-8">
                  <span className="inline-block w-3 h-6 bg-blue-400 animate-pulse"></span>
                </div>

                {/* Get Started Button */}
                <button className="group relative px-12 py-4 bg-transparent border-2 border-gray-600 text-white font-medium text-lg rounded-lg transition-all duration-300 hover:border-gray-400 hover:bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
                  <span className="relative z-10">Get Started</span>

                  {/* Button Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800/0 via-gray-700/20 to-gray-800/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                {/* Bottom Status Bar */}
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>System Ready</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span>AI Engine: Active</span>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Corner Details */}
              <div className="absolute top-4 right-4 text-xs text-gray-600 font-mono">
                v2.1.0
              </div>

              <div className="absolute top-4 left-4 text-xs text-gray-600 font-mono">
                NEXTskill
              </div>
            </div>

            {/* Screen Stand */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-gradient-to-b from-gray-700 to-gray-900 rounded-b-lg"></div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-48 h-4 bg-gradient-to-b from-gray-800 to-gray-900 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* AI Whispers Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-14 text-center space-y-8">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl font-semibold text-blue-500"
        >
          AI is Watching...
        </motion.h2>
        <div className="space-y-4 text-gray-400 italic">
          <p>“Do you really know your strengths?”</p>
          <p>“The market waits… are you ready?”</p>
          <p>“Skills are just the beginning.”</p>
        </div>
        <div className="w-2xs m-auto border-wh ite border-3 my-8"></div>
        <h2>Connect With Team</h2>
        <AnimatedTooltipPreview />
      </section>

      {/* Roadmap Teaser */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-14">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { step: "Step 1", label: "Unlock Potential" },
              { step: "Step 2", label: "Face The Test" },
              { step: "Step 3", label: "The Path Revealed" },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-blue-500">{item.step}</h3>
                <p className="text-gray-400 mt-2">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
