"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { unlock } from "@/lib/achievements";

type Stage = "error" | "preng";
const PRANK_KEY = "cinn-fake-error-v1";
const TRIGGER_DELAY = 8000;

export default function FakeError() {
  const [stage, setStage] = useState<Stage | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(PRANK_KEY)) {
      setDismissed(true);
      return;
    }
    const t = setTimeout(() => {
      if (!sessionStorage.getItem(PRANK_KEY)) setStage("error");
    }, TRIGGER_DELAY);
    return () => clearTimeout(t);
  }, []);

  const handleReload = () => {
    setStage("preng");
    unlock("error");
    confetti({
      particleCount: 200,
      spread: 120,
      startVelocity: 55,
      origin: { y: 0.5 },
      colors: ["#FF8FAB", "#F0C979", "#C73E68", "#E0C9F0", "#FFF9F3"],
    });
    setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 90,
        startVelocity: 45,
        origin: { y: 0.45 },
        colors: ["#FF8FAB", "#F0C979", "#C73E68"],
      });
    }, 1000);
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 70,
        startVelocity: 40,
        origin: { y: 0.55 },
        colors: ["#FF8FAB", "#E0C9F0", "#C73E68"],
      });
    }, 2000);
    setTimeout(() => {
      sessionStorage.setItem(PRANK_KEY, "1");
      setDismissed(true);
    }, 4000);
  };

  if (dismissed || !stage) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] overflow-y-auto"
        style={{
          background: stage === "preng" ? "#000000" : "#0A0A0A",
          color: "#FFFFFF",
        }}
      >
        {stage === "error" && <ErrorScreen onReload={handleReload} />}
        {stage === "preng" && <PrengScreen />}
      </motion.div>
    </AnimatePresence>
  );
}

function ErrorScreen({ onReload }: { onReload: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col font-mono">
      <div className="border-b border-[#1f1f1f] p-4 flex items-center gap-3 bg-[#111]">
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }} transition={{ duration: 1.2, repeat: Infinity }} className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
        <span className="text-red-400 font-bold text-sm md:text-base">Build Error</span>
        <span className="text-[#555] text-xs md:text-sm truncate">— next.js 16.4.2</span>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 md:px-6 py-8 md:py-12">
        <div className="w-full max-w-2xl">
          <div className="text-xs md:text-sm mb-6">
            <p className="text-red-400 mb-3 font-bold text-sm md:text-lg leading-snug break-words">Uncaught Error: Cannot read properties of undefined (reading 'prengggg')</p>
            <p className="text-[#888] leading-relaxed text-xs md:text-sm">Component tree failed to hydrate. This can happen if a client component threw during render, or if the server responded with invalid data.</p>
          </div>

          <div className="border border-[#2a2a2a] rounded overflow-hidden mb-6 md:mb-8">
            <div className="bg-[#161616] px-3 md:px-4 py-2 border-b border-[#2a2a2a] text-[#888] text-[10px] md:text-xs truncate">./app/page.tsx:108:5</div>
            <pre className="bg-[#0D0D0D] p-3 md:p-4 text-[10px] md:text-sm overflow-x-auto text-[#666] leading-relaxed">
              {`  106 |   );
  107 | }
> 108 |   throw new Error("prengggg");
      |   ^
  109 |
  110 |   return <PrankComponent />;
  111 |`}
            </pre>
          </div>

          <div className="text-[#555] text-xs leading-relaxed mb-8 md:mb-10 hidden sm:block">
            <p className="text-[#888] mb-2">Import traces:</p>
            <p> Client Component Browser:</p>
            <p className="pl-4"> ./app/page.tsx [Client Component Browser]</p>
            <p className="pl-4"> ./app/page.tsx [Server Component]</p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={onReload}
              className="w-full max-w-sm bg-red-600 hover:bg-red-500 text-white px-6 md:px-8 py-4 rounded-lg text-base md:text-lg font-bold transition shadow-2xl shadow-red-600/40 hover:shadow-red-500/60 hover:scale-105 active:scale-95 uppercase tracking-wider"
            >
              ⟳ Reload Page
            </button>
            <p className="text-[#444] text-xs text-center px-4">Klik tombol di atas untuk reload halaman</p>
          </div>
        </div>
      </div>

      <div className="border-t border-[#1f1f1f] p-4 text-[#333] text-xs flex items-center justify-between gap-2">
        <span className="truncate">Next.js 16.4.2 (Turbopack)</span>
        <span className="text-red-400/50 whitespace-nowrap">compiled with errors</span>
      </div>
    </motion.div>
  );
}

function PrengScreen() {
  const text = "PRENGGGG";
  return (
    <motion.div
      animate={{
        x: [0, -30, 30, -25, 25, -18, 18, -12, 12, -6, 6, 0],
        y: [0, 25, -25, 20, -20, 15, -15, 10, -10, 5, -5, 0],
        rotate: [0, -2, 2, -1.5, 1.5, -1, 1, 0],
      }}
      transition={{
        duration: 1.1,
        times: [0, 0.08, 0.16, 0.24, 0.32, 0.4, 0.48, 0.56, 0.64, 0.72, 0.8, 1],
      }}
      className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 4, opacity: 0 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full border-[6px] border-pink-500 pointer-events-none"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 1.6, delay: 0.12, ease: "easeOut" }}
        className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full border-[6px] border-yellow-400 pointer-events-none"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 2.5, opacity: 0 }}
        transition={{ duration: 1.4, delay: 0.24, ease: "easeOut" }}
        className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full border-[6px] border-rose-300 pointer-events-none"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 2], opacity: [0, 0.8, 0] }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,143,171,0.9) 0%, rgba(199,62,104,0.4) 40%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center px-4 w-full">
        <div className="flex flex-col items-center justify-center relative">
          <motion.h1
            initial={{ scale: 0.2, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 11 }}
            className="font-fredoka font-bold text-[clamp(2.5rem,17vw,14rem)] text-pink-400 leading-[0.85] tracking-tight text-center absolute"
            style={{
              textShadow: "0 0 20px rgba(255,143,171,1), 0 0 40px rgba(255,143,171,0.9), 0 0 80px rgba(199,62,104,0.8), 0 0 150px rgba(199,62,104,0.5)",
            }}
          >
            {text}
          </motion.h1>
          <motion.h1
            initial={{ scale: 0.2, opacity: 0, rotate: -15 }}
            animate={{ scale: 0.7, opacity: 0.55, rotate: 0 }}
            transition={{ delay: 1, type: "spring", stiffness: 250, damping: 12 }}
            className="font-fredoka font-bold text-[clamp(2.5rem,17vw,14rem)] text-yellow-300 leading-[0.85] tracking-tight text-center absolute"
            style={{
              textShadow: "0 0 15px rgba(240,201,121,1), 0 0 30px rgba(240,201,121,0.7), 0 0 60px rgba(199,62,104,0.4)",
            }}
          >
            {text}
          </motion.h1>
          <motion.h1
            initial={{ scale: 0.2, opacity: 0, rotate: -10 }}
            animate={{ scale: 0.45, opacity: 0.35, rotate: 0 }}
            transition={{ delay: 2, type: "spring", stiffness: 220, damping: 14 }}
            className="font-fredoka font-bold text-[clamp(2.5rem,17vw,14rem)] text-rose-300 leading-[0.85] tracking-tight text-center absolute"
            style={{
              textShadow: "0 0 10px rgba(255,143,171,0.8), 0 0 25px rgba(199,62,104,0.5)",
            }}
          >
            {text}
          </motion.h1>
        </div>
        <div className="font-fredoka font-bold text-[clamp(2.5rem,17vw,14rem)] leading-[0.85] tracking-tight invisible select-none" aria-hidden>
          {text}
        </div>
        <motion.p initial={{ opacity: 0, y: 20, scale: 0.5 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.5, type: "spring", stiffness: 200 }} className="text-5xl sm:text-7xl md:text-9xl mt-4 md:mt-6">
          🤪
        </motion.p>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
        <div className="flex justify-center items-center px-2">
          {text.split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ y: 0, rotate: 0 }}
              animate={{
                y: [0, -10, 6, -8, 4, 0],
                rotate: [0, -8, 10, -6, 8, 0],
                scale: [1, 1.08, 0.96, 1.06, 0.98, 1],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatType: "loop",
                delay: i * 0.06,
                ease: "easeInOut",
              }}
              className="font-fredoka font-bold text-[clamp(2.5rem,17vw,14rem)] leading-[0.85] tracking-tight inline-block"
              style={{
                color: "transparent",
                WebkitTextStroke: "2px rgba(255,143,171,0.7)",
                textShadow: "0 0 15px rgba(255,143,171,0.6), 0 0 30px rgba(199,62,104,0.4)",
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
