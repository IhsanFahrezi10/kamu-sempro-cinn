"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EditorialSection from "./EditorialSection";
import { unlock } from "@/lib/achievements";

export default function MatchaFortune() {
  const [flips, setFlips] = useState(0);
  const [splashKey, setSplashKey] = useState(0);

  const flip = () => {
    setFlips((f) => f + 1);
    setSplashKey((k) => k + 1);
    if (flips === 0) unlock("fortune");
  };

  const message =
    flips === 0 ? "cangkirnya masih diem. klik buat mulai" : flips < 3 ? "aduh, tumpah dikit" : flips < 8 ? "mulai rame nih" : flips < 15 ? "kecanduan ya?" : flips < 30 ? "mejanya udah jadi kolam matcha" : "serius deh, tisu-nya abis";

  return (
    <EditorialSection
      number="01"
      sideLabel="Chapter One — Flip"
      title={
        <>
          Main <em className="italic">matcha.</em>
        </>
      }
      subtitle="Flip the cupp euyy"
      meta={
        <div className="hidden md:flex flex-col items-end gap-1">
          <span className="stamp">Flip ✦</span>
          <span className="font-caveat text-xs text-ink/40 mt-2 tabular-nums">{flips}x flip</span>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center text-center py-8 min-h-[520px] md:min-h-[600px]">
        {/* Cup + splash wrapper */}
        <div className="relative" style={{ perspective: 1400 }}>
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-sage/40 blur-3xl pointer-events-none scale-150" />

          {/* SPLASH — muncul tiap klik */}
          {splashKey > 0 && (
            <div key={splashKey} className="absolute inset-0 pointer-events-none z-20" style={{ top: "10%", left: "0", right: "0", bottom: "0" }}>
              {/* Matcha droplets — CSS circles hijau */}
              {Array.from({ length: 22 }).map((_, i) => {
                const angle = (i / 22) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
                const distance = 100 + Math.random() * 220;
                const dx = Math.cos(angle) * distance;
                const dy = Math.sin(angle) * distance - 120;
                const size = 8 + Math.random() * 16;
                return (
                  <motion.span
                    key={`dot-${splashKey}-${i}`}
                    initial={{ x: 0, y: 0, scale: 0.2, opacity: 1 }}
                    animate={{
                      x: dx,
                      y: dy,
                      scale: [0.2, 1.4, 0.5],
                      opacity: [1, 0.95, 0],
                    }}
                    transition={{
                      duration: 1.2 + Math.random() * 0.6,
                      ease: "easeOut",
                    }}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      top: "25%",
                      left: "50%",
                      width: `${size}px`,
                      height: `${size}px`,
                      background: "radial-gradient(circle, #88B04B 0%, #5A7A2E 100%)",
                      boxShadow: "0 0 8px rgba(136,176,75,0.6)",
                    }}
                  />
                );
              })}

              {/* Emoji splash — untuk karakter */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.6;
                const distance = 140 + Math.random() * 180;
                const dx = Math.cos(angle) * distance;
                const dy = Math.sin(angle) * distance - 100;
                return (
                  <motion.span
                    key={`emoji-${splashKey}-${i}`}
                    initial={{
                      x: 0,
                      y: 0,
                      scale: 0.3,
                      opacity: 1,
                      rotate: 0,
                    }}
                    animate={{
                      x: dx,
                      y: dy,
                      scale: [0.3, 1.3, 0.7],
                      opacity: [1, 0.9, 0],
                      rotate: Math.random() * 720 - 360,
                    }}
                    transition={{
                      duration: 1.4 + Math.random() * 0.4,
                      ease: "easeOut",
                    }}
                    className="absolute text-2xl md:text-3xl pointer-events-none"
                    style={{ top: "25%", left: "50%" }}
                  >
                    {["🍃", "💚", "✨"][i % 3]}
                  </motion.span>
                );
              })}
            </div>
          )}

          {/* CUP */}
          <motion.button
            onClick={flip}
            animate={{
              rotateY: flips * 360,
              scaleY: [1, 0.92, 1.05, 1],
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-[160px] md:text-[280px] select-none leading-none block relative z-10 drop-shadow-2xl"
            aria-label="Flip cangkir matcha"
          >
            🍵
          </motion.button>

          {/* PUDDLE — muncul setelah flip pertama */}
          <AnimatePresence>
            {flips > 0 && (
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 0.55 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute left-1/2 -translate-x-1/2 rounded-[50%] bg-sage/50 blur-md pointer-events-none"
                style={{
                  bottom: "-10px",
                  width: "60%",
                  height: "18px",
                }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Counter & message di bawah cup */}
        <div className="mt-16 md:mt-20">
          <div className="flex items-baseline gap-2 justify-center mb-3">
            <span className="font-pacifico text-6xl md:text-8xl text-deep-rose tabular-nums drop-shadow-sm">{flips}</span>
            <span className="font-caveat text-2xl md:text-3xl text-rose/60">kali</span>
          </div>
          <p className="font-caveat text-xl md:text-2xl text-rose max-w-md mx-auto px-4">{message}</p>
        </div>
      </div>
    </EditorialSection>
  );
}
