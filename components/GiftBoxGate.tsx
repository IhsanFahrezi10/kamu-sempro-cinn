"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { unlock } from "@/lib/achievements";

const STAGES = ["ada titipan nih", "hampir...", "cekidot!", "dibuka ya!"];

export default function GiftBoxGate({ onOpen }: { onOpen: () => void }) {
  const [layers, setLayers] = useState(0);

  const clickGift = () => {
    if (layers < 3) setLayers(layers + 1);
    else {
      unlock("gift");
      onOpen();
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
      transition={{ duration: 0.7 }}
      className="relative z-10 min-h-[100svh] w-full flex flex-col items-center justify-center px-6 text-center"
    >
      <motion.p key={`stage-${layers}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="font-caveat text-2xl text-deep-rose mb-2">
        {STAGES[layers]}
      </motion.p>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="font-pacifico text-4xl md:text-6xl text-deep-rose leading-tight mb-16 drop-shadow-sm">
        Nihh E-GiftBox Buat Kamuu
      </motion.h1>

      <motion.div initial={{ opacity: 0, scale: 0.3, y: 60 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.4, type: "spring", stiffness: 90, damping: 15 }} className="relative">
        <div className="absolute inset-0 rounded-full bg-rose/40 blur-3xl pointer-events-none" style={{ animation: "glow-pulse 3s ease-in-out infinite" }} />
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} className="absolute inset-0 pointer-events-none">
          <span className="absolute -top-14 left-1/2 -translate-x-1/2 text-2xl">✨</span>
          <span className="absolute -bottom-14 left-1/2 -translate-x-1/2 text-2xl">⭐</span>
          <span className="absolute top-1/2 -left-20 -translate-y-1/2 text-2xl">💫</span>
          <span className="absolute top-1/2 -right-20 -translate-y-1/2 text-2xl">✨</span>
        </motion.div>
        <motion.button
          onClick={clickGift}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ y: [0, -12, 0], rotate: [0, -2, 2, -2, 0] }}
          transition={{ y: { duration: 3, repeat: Infinity }, rotate: { duration: 3, repeat: Infinity } }}
          className="relative"
          aria-label="Buka kado"
        >
          <svg width="280" height="280" viewBox="0 0 240 240">
            <ellipse cx="120" cy="228" rx="80" ry="8" fill="#C73E68" opacity="0.22" />
            <rect x="50" y="110" width="140" height="110" rx="10" fill="#FF8FAB" />
            <rect x="110" y="110" width="20" height="110" fill="#F0C979" />
            <rect x="50" y="158" width="140" height="14" fill="#F0C979" />
            {layers < 1 && <rect x="38" y="84" width="164" height="32" rx="8" fill="#C73E68" />}
            {layers < 2 && <rect x="110" y="84" width="20" height="32" fill="#F0C979" />}
            {layers < 3 && (
              <>
                <ellipse cx="92" cy="72" rx="22" ry="14" fill="#C73E68" transform="rotate(-25 92 72)" />
                <ellipse cx="148" cy="72" rx="22" ry="14" fill="#C73E68" transform="rotate(25 148 72)" />
                <circle cx="120" cy="74" r="10" fill="#F0C979" />
              </>
            )}
            <ellipse cx="78" cy="135" rx="5" ry="12" fill="#FFF" opacity="0.4" transform="rotate(-15 78 135)" />
            <circle cx="75" cy="125" r="2" fill="#FFF" opacity="0.6" />
            <circle cx="160" cy="195" r="2" fill="#FFF" opacity="0.6" />
            <circle cx="180" cy="130" r="2" fill="#FFF" opacity="0.6" />
          </svg>
        </motion.button>
      </motion.div>

      <p className="font-caveat text-lg text-rose mt-12">{layers < 3 ? "klik kadonya buat buka lapisan ✨" : "sekarang tinggal buka!"}</p>
      <AnimatePresence>
        {layers === 3 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 150 }}
            onClick={clickGift}
            className="mt-6 bg-deep-rose text-cream font-semibold px-10 py-4 rounded-full shadow-[0_10px_30px_-8px_rgba(199,62,104,0.65)] hover:bg-rose transition"
          >
            Buka kadonya 💝
          </motion.button>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
