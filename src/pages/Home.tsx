import React from "react";
import "./../../src/index.css";
import {GoArrowUpRight} from 'react-icons/go'
import { useNavigate } from "react-router-dom";
import { ShootingStarsAndStarsBackgroundDemo } from "../component/starbackground";
import { motion } from "framer-motion";
import { GlowingEffect } from "../component/ui/glowing-effect";
import { TextHoverEffect } from "../component/ui/text-hover-effect";
import { AnimatedTooltipPreview } from "../component/Connect-team";
import { WavyBackground } from "../component/ui/wavy-background";
import {
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from "../component/ui/text-reveal-card";
import { HoverBorderGradient } from "../component/ui/hover-border-gradient";

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black/10 text-white">
      {/* Background */}
      <ShootingStarsAndStarsBackgroundDemo />

      {/* Wavy section */}
      <section className="relative z-10 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 pt-20">
        <div className="flex-1 space-y-6 justify-between items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl lg:text-6xl font-bold leading-tight audiowide-regular"
          >
            We Don’t Show You the Future <br />
            <div className="w-3xl m-auto border-white border-3 mt-6"></div>
            <div className="h-[15rem] flex items-center justify-center p-0">
              <TextHoverEffect text="We Built It" />
            </div>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-gray-400 text-lg max-w-lg m-auto gugi-regular"
          >
            Unlock your hidden potential. Discover skills you didn’t know you
            had. Let AI craft your roadmap to mastery.
          </motion.p>
          {/* <div className="flex items-center justify-center bg-transparent h-[10rem] rounded-2xl w-full py-15">
            Revealing card
            <TextRevealCard
              text="Empower Your Skills With"
              revealText="NEXTskills"
            >
              <TextRevealCardTitle>
              Sometimes, you just need to see it.
            </TextRevealCardTitle>
            <TextRevealCardDescription>
              This is a text reveal card. Hover over the card to reveal the
              hidden text.
            </TextRevealCardDescription> 
            </TextRevealCard>
          </div> */}
        </div>
      </section>
      <WavyBackground />

      {/* Roadmap divs */}
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

      {/* Assessment moniter */}
      <div
        className="relative h-[140vh] bg-contain bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: `url('/spacebgimage.jpg')`,
        }}
      >
        <div className="flex flex-col justify-center items-center relative z-10 mt-30">
          <div className="bg-transparent shadow-[0_0_80px_40px_rgba(0,0,0,1)]">
            <div className="pt-15 rounded-2xl px-20 bg-gradient-to-b from-black from via-black/80 via-80% to-black/30 to-100%">
              <div className="px-10 rounded-2xl bg-gradient-to-b from-white/10 from via-black/80 via-80% to-black/30 to-100%">
                <div
                  className="w-[110vh] h-[100vh] bg-gradient-to-b from-black from-70% via-black/80 via-80% to-slate-900/20 to-100% bg-contain bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url('/spacebgimage.jpg')`,
                  }}
                >
                  <div className="flex items-center justify-center bg-transparent h-[10rem] rounded-2xl w-full pt-55 pb-30">
                    <TextRevealCard
                      text="Empower Your Skills With"
                      revealText="NEXTskills"
                    >
                      <TextRevealCardTitle>
                        Sometimes, you just need to see it.
                      </TextRevealCardTitle>
                      <TextRevealCardDescription>
                        This is a text reveal card. Hover over the card to
                        reveal the hidden text.
                      </TextRevealCardDescription>
                    </TextRevealCard>
                  </div>

                  {/* button */}
                  <div className="flex justify-center items-center">
                    <HoverBorderGradient onClick={()=>{navigate("/skill")}}>
                      <div className=" bg-black flex justify-between items-center gap-4">
                        <p className="text-5xl">Get Started</p>
                        <div className="w-14 h-14 bg-blue-500 rounded-full flex justify-between items-center hover:bg-blue-700">
                          <GoArrowUpRight className="m-auto hover:scale-110" size={40}/>
                        </div>
                      </div> 
                    </HoverBorderGradient>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Whispers*/}
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

        {/* Connect with team */}
        <AnimatedTooltipPreview />
      </section>
    </div>
  );
};

export default Home;
