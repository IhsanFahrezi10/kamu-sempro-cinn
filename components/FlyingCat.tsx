"use client";
import { motion } from "framer-motion";

export default function FlyingCat() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden" aria-hidden>
      <motion.div
        className="absolute select-none"
        style={{ left: "-10vw", top: 0 }}
        animate={{
          x: ["0vw", "20vw", "45vw", "70vw", "95vw", "110vw", "95vw", "70vw", "45vw", "20vw", "0vw"],
          y: ["50vh", "30vh", "15vh", "20vh", "40vh", "55vh", "70vh", "75vh", "65vh", "58vh", "50vh"],
          rotate: [0, -12, -18, -8, 8, 15, 20, 18, 10, -5, 0],
        }}
        transition={{ duration: 38, repeat: Infinity, ease: "easeInOut", times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }}
      >
        <div className="relative flex items-center">
          <motion.span animate={{ scaleX: [1, -1, 1], y: [0, -4, 0] }} transition={{ duration: 0.55, repeat: Infinity }} className="text-2xl md:text-3xl opacity-75 -mr-2 md:-mr-3">
            🦋
          </motion.span>
          <span className="text-4xl md:text-5xl relative z-10 drop-shadow-md">🐱</span>
          <motion.span animate={{ scaleX: [1, -1, 1], y: [0, -4, 0] }} transition={{ duration: 0.55, repeat: Infinity }} className="text-2xl md:text-3xl opacity-75 -ml-2 md:-ml-3">
            🦋
          </motion.span>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 flex gap-3 mt-1">
          {[0, 1, 2].map((i) => (
            <motion.span key={i} animate={{ opacity: [0, 0.7, 0], scale: [0.5, 1, 0.5], y: [0, -6, -12] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }} className="text-sm md:text-base">
              ✨
            </motion.span>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="absolute select-none"
        style={{ right: "-8vw", top: 0 }}
        animate={{
          x: ["0vw", "-15vw", "-35vw", "-55vw", "-75vw", "-95vw", "-75vw", "-55vw", "-35vw", "-15vw", "0vw"],
          y: ["25vh", "40vh", "55vh", "45vh", "30vh", "20vh", "35vh", "50vh", "60vh", "40vh", "25vh"],
          rotate: [0, 10, 15, 8, -5, -12, -18, -12, -6, 4, 0],
        }}
        transition={{ duration: 45, repeat: Infinity, ease: "easeInOut", times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }}
      >
        <div className="relative flex items-center">
          <motion.span animate={{ scaleX: [1, -1, 1] }} transition={{ duration: 0.7, repeat: Infinity, delay: 0.35 }} className="text-xl md:text-2xl opacity-60 -mr-1">
            🦋
          </motion.span>
          <span className="text-2xl md:text-3xl relative z-10 drop-shadow-sm">😺</span>
        </div>
      </motion.div>
    </div>
  );
}
