"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { unlock } from "@/lib/achievements";

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setPlaying(true);
          unlock("music");
        })
        .catch((err) => {
          console.warn("Audio gagal play:", err);
        });
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/music/risk-it-all.mp3" loop preload="auto" />

      {/* Floating button */}
      <motion.button
        onClick={toggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={playing ? "Pause music" : "Play music"}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-cream border-2 border-rose/30 shadow-[0_6px_20px_-4px_rgba(199,62,104,0.4)] flex items-center justify-center text-2xl hover:border-rose transition"
      >
        {/* Vinyl spinning when playing */}
        <motion.span animate={playing ? { rotate: 360 } : { rotate: 0 }} transition={playing ? { duration: 3, repeat: Infinity, ease: "linear" } : { duration: 0.3 }} className="block">
          {playing ? "🎵" : "🔇"}
        </motion.span>

        {/* Sound waves when playing */}
        {playing && (
          <>
            <motion.span animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-0 rounded-full border-2 border-rose/40 pointer-events-none" />
            <motion.span animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} className="absolute inset-0 rounded-full border-2 border-rose/30 pointer-events-none" />
          </>
        )}
      </motion.button>

      {/* Tooltip on hover */}
      <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 10 }} transition={{ duration: 0.2 }} className="fixed bottom-9 right-24 z-40 pointer-events-none">
        <div className="bg-ink/90 text-cream px-3 py-1.5 rounded-lg text-xs font-caveat whitespace-nowrap shadow-lg">
          {playing ? "pause risk it all" : "play risk it all"}
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-ink/90 rotate-45" />
        </div>
      </motion.div>
    </>
  );
}
