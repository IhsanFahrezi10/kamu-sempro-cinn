"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const STRIPS = 12;
const LOADING_DURATION = 5000;

export default function CurtainLanding({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"landing" | "curtain">("landing");

  useEffect(() => {
    const t = setTimeout(() => {
      confetti({ particleCount: 100, spread: 80, startVelocity: 42, origin: { y: 0.7 }, colors: ["#FF8FAB", "#FFC1D5", "#F0C979", "#E0C9F0", "#C73E68"] });
    }, 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "landing") return;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / LOADING_DURATION) * 100);
      setProgress(pct);
      if (pct >= 100) {
        setPhase("curtain");
        return;
      }
      requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  useEffect(() => {
    if (phase !== "curtain") return;
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [phase, onDone]);

  const liquidY = 113 - 83 * (progress / 100);

  return (
    <motion.div className="fixed inset-0 z-50 overflow-hidden" style={{ background: "linear-gradient(180deg, #FFE5EC 0%, #FFF9F3 100%)" }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <AnimatePresence>
        {phase === "landing" && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute w-[500px] h-[500px] opacity-30 pointer-events-none">
              <span className="absolute -top-2 left-1/2 text-3xl">✨</span>
              <span className="absolute -bottom-2 left-1/2 text-3xl">⭐</span>
              <span className="absolute top-1/2 -left-2 text-3xl">💫</span>
              <span className="absolute top-1/2 -right-2 text-3xl">✨</span>
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-caveat text-2xl md:text-3xl text-rose mb-3">
              ahh finally...
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="font-pacifico text-4xl md:text-6xl text-deep-rose leading-tight mb-3 drop-shadow-sm">
              Congratss, Cinn! 🎉
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="font-pacifico text-xl md:text-3xl text-rose mb-10">
              Sempro kamu udah kelar
            </motion.p>

            <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, type: "spring", stiffness: 150 }} className="flex flex-col items-center gap-4">
              <div className="relative">
                {progress > 15 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none">
                    {[0, 1, 2].map((i) => (
                      <motion.div key={i} animate={{ y: [0, -14, -28], opacity: [0, 0.7, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }} className="w-1.5 h-1.5 rounded-full bg-[#A8C686]" />
                    ))}
                  </div>
                )}
                <svg width="100" height="140" viewBox="0 0 100 130" className="drop-shadow-md">
                  <defs>
                    <linearGradient id="matchaLiquid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A8C686" />
                      <stop offset="100%" stopColor="#88B04B" />
                    </linearGradient>
                    <clipPath id="cupShape">
                      <path d="M18 30 L25 105 Q25 113 33 113 L67 113 Q75 113 75 105 L82 30 Z" />
                    </clipPath>
                  </defs>
                  <g clipPath="url(#cupShape)">
                    <rect x="0" y={liquidY} width="100" height="130" fill="url(#matchaLiquid)" />
                    <ellipse cx="50" cy={liquidY} rx="30" ry="4.5" fill="#B5D19A" opacity={progress > 8 ? 0.95 : 0} />
                    <circle cx="38" cy="95" r="2" fill="#FFF" opacity="0.35" />
                    <circle cx="58" cy="80" r="1.5" fill="#FFF" opacity="0.35" />
                    <circle cx="48" cy="60" r="2" fill="#FFF" opacity="0.3" />
                  </g>
                  <path d="M18 30 L25 105 Q25 113 33 113 L67 113 Q75 113 75 105 L82 30" fill="none" stroke="#C73E68" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <ellipse cx="50" cy="30" rx="32" ry="7" fill="none" stroke="#C73E68" strokeWidth="2.5" />
                </svg>
                <span className="absolute top-1 right-2 text-lg rotate-12 select-none">🍃</span>
              </div>
              <div className="w-72 md:w-96 relative h-2.5 bg-rose/20 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-rose via-deep-rose to-rose rounded-full" style={{ width: `${progress}%` }} />
                <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "curtain" && (
        <div className="absolute inset-0 flex">
          {Array.from({ length: STRIPS }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 0 }}
              animate={{ y: "-115%" }}
              transition={{ duration: 1.4, delay: 0.15 + i * 0.04, ease: [0.76, 0, 0.24, 1] }}
              className="flex-1 h-full relative"
              style={{
                background: "linear-gradient(90deg, #5A1E32 0%, #7A2E45 20%, #C73E68 40%, #FF8FAB 50%, #C73E68 60%, #7A2E45 80%, #5A1E32 100%)",
                boxShadow: "inset -4px 0 14px rgba(0,0,0,0.3), inset 4px 0 14px rgba(255,255,255,0.06)",
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-8" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)" }} />
              <div className="absolute bottom-0 left-0 right-0 h-4" style={{ background: "linear-gradient(180deg, #4A1F2E 0%, #2B0F1A 100%)", boxShadow: "0 -2px 8px rgba(0,0,0,0.4)" }} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
