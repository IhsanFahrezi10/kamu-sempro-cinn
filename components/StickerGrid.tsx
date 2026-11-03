"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { cards } from "@/data/cards";
import { unlock } from "@/lib/achievements";
import EditorialSection from "./EditorialSection";

const STICKER_STYLES = [
  { bg: "bg-pink", rotate: -3, floatDelay: 0, span: "md:col-span-4" },
  { bg: "bg-lavender", rotate: 2, floatDelay: 0.5, span: "md:col-span-3" },
  { bg: "bg-[#FFE5B4]", rotate: -2, floatDelay: 1, span: "md:col-span-5" },
  { bg: "bg-[#C8E6C9]", rotate: 3, floatDelay: 1.5, span: "md:col-span-5" },
  { bg: "bg-[#FFD1DC]", rotate: -4, floatDelay: 0.3, span: "md:col-span-4" },
  { bg: "bg-[#FFE0EC]", rotate: 2, floatDelay: 0.8, span: "md:col-span-3" },
];

export default function StickerGrid() {
  const [opened, setOpened] = useState<number[]>([]);
  const open = (i: number) => {
    const next = opened.includes(i) ? opened : [...opened, i];
    setOpened(next);
    if (next.length === cards.length) unlock("sticker");
  };

  return (
    <EditorialSection
      number="07"
      sideLabel="Chapter Seven — Memories"
      title={
        <>
          Take your sticker.<em className="italic"></em>
        </>
      }
      subtitle="Klik tiap stiker — ada cerita di baliknya"
      meta={
        <div className="hidden md:flex flex-col items-end gap-1">
          <span className="stamp">Scrapbook ✿</span>
          <span className="font-caveat text-xs text-ink/40 mt-2 tabular-nums">
            {opened.length}/{cards.length} dibuka
          </span>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8">
        {cards.map((c, i) => {
          const style = STICKER_STYLES[i % STICKER_STYLES.length];
          const isOpen = opened.includes(i);
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.6, rotate: style.rotate * 4 }}
              whileInView={{ opacity: 1, scale: 1, rotate: style.rotate }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 130, damping: 12 }}
              whileHover={{ scale: 1.06, rotate: 0, zIndex: 10 }}
              onClick={() => open(i)}
              className={`relative ${style.span}`}
              style={{ animation: `bob 5s ease-in-out ${style.floatDelay}s infinite` }}
            >
              <div className={`${style.bg} relative rounded-sm p-6 md:p-8 shadow-[0_12px_35px_-12px_rgba(199,62,104,0.5)] min-h-[200px] flex flex-col items-center justify-center text-center border border-white/80`}>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-gold/70 rounded-sm rotate-[-3deg] shadow-sm" />
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-rose/20 to-transparent rounded-bl-lg" />
                {!isOpen ? (
                  <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <span className="text-6xl mb-3 block select-none">{c.front}</span>
                    <span className="font-caveat text-sm text-ink/50 tracking-wider">click click ✨</span>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.9, rotate: -3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                    <span className="font-caveat text-xs text-ink/40 tracking-wider uppercase block mb-2">— Note #{i + 1} —</span>
                    <p className="font-caveat text-[18px] md:text-[20px] text-ink leading-snug">{c.back}</p>
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </EditorialSection>
  );
}
