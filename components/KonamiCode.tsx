"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const SEQUENCE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export default function KonamiCode() {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === SEQUENCE[idx]) {
        const next = idx + 1;
        if (next === SEQUENCE.length) {
          setShow(true);
          confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 }, colors: ["#FF8FAB", "#F0C979", "#E0C9F0", "#C73E68"] });
          setTimeout(() => setShow(false), 5000);
          setIdx(0);
        } else setIdx(next);
      } else setIdx(0);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] bg-deep-rose/90 backdrop-blur flex items-center justify-center px-6 pointer-events-none">
          <motion.div initial={{ scale: 0.7, y: 30 }} animate={{ scale: 1, y: 0 }} className="text-center max-w-md">
            <p className="text-6xl mb-6">🎮</p>
            <p className="font-pacifico text-3xl md:text-4xl text-cream mb-3">Easter egg!</p>
            <p className="font-caveat text-2xl text-cream/90">kamu nemu kode rahasianya. tanda kamu harus sempro dengan tenang ✨</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
