"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const GATE_KEY = "cinn-human-check-v1";
const GATE_TRIGGER_PCT = 30;

export default function MatchaProgress() {
  const [pct, setPct] = useState(0);
  const [gateLocked, setGateLocked] = useState(false);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const real = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;

      const gateSolved = sessionStorage.getItem(GATE_KEY) === "1";
      const locked = !gateSolved && real >= GATE_TRIGGER_PCT;

      setGateLocked(locked);
      setPct(locked ? GATE_TRIGGER_PCT : real);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("gate-state-change", update);

    const interval = setInterval(update, 500);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("gate-state-change", update);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={`fixed top-5 left-5 z-40 flex items-center gap-2 rounded-full px-3 py-2 shadow-md border-2 transition ${gateLocked ? "bg-blush/95 backdrop-blur border-rose/40" : "bg-cream/90 backdrop-blur border-rose/20"}`}>
      <div className="relative w-8 h-8">
        <span className="absolute inset-0 flex items-end justify-center overflow-hidden rounded-md">
          <motion.div className={`w-full bg-gradient-to-t ${gateLocked ? "from-deep-rose to-rose" : "from-[#88B04B] to-[#A8C686]"}`} animate={{ height: `${pct * 0.72}%` }} transition={{ duration: 0.2 }} style={{ marginBottom: "12%" }} />
        </span>
        <span className="absolute inset-0 flex items-center justify-center text-lg pointer-events-none">{gateLocked ? "🔒" : "🍵"}</span>
      </div>
      <span className={`font-caveat text-sm tabular-nums w-9 transition ${gateLocked ? "text-rose font-semibold" : "text-deep-rose"}`}>{Math.round(pct)}%</span>
    </div>
  );
}
