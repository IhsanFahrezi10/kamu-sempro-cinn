"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const messages = ["Wrapping kadonya... 🎀", "Nyempetin pita gold-nya... ✨", "Writing a non-nonchalant message... 😐", "Here it is!"];

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (idx >= messages.length - 1) {
      const t = setTimeout(onDone, 1400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIdx((i) => i + 1), 1600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blush via-pink to-lavender overflow-hidden"
    >
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute w-72 h-72 pointer-events-none">
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-xl">✨</span>
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xl">⭐</span>
        <span className="absolute top-1/2 -left-2 -translate-y-1/2 text-xl">💫</span>
        <span className="absolute top-1/2 -right-2 -translate-y-1/2 text-xl">✨</span>
      </motion.div>
      <motion.div animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.15, 1] }} transition={{ duration: 1.4, repeat: Infinity }} className="text-7xl mb-8 drop-shadow-lg">
        🎁
      </motion.div>
      <motion.p key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} className="font-caveat text-3xl text-deep-rose px-6 text-center font-semibold">
        {messages[idx]}
      </motion.p>
      <div className="mt-10 w-64 h-2 bg-cream/50 rounded-full overflow-hidden">
        <motion.div className="h-full bg-deep-rose rounded-full" animate={{ width: `${((idx + 1) / messages.length) * 100}%` }} transition={{ duration: 0.8 }} />
      </div>
    </motion.div>
  );
}
