"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import EditorialSection from "./EditorialSection";
import { unlock } from "@/lib/achievements";

const ITEMS = [
  { emoji: "🍵", label: "Matcha celebration", tilt: "rotate-[-1.8deg]", size: "md:col-span-4" },
  { emoji: "😴", label: "Tidur siang 4 jam", tilt: "rotate-[1.4deg]", size: "md:col-span-4" },
  { emoji: "📺", label: "Kdrama marathon", tilt: "rotate-[2.2deg]", size: "md:col-span-4" },
  { emoji: "🍗", label: "Gofood ayam sinar siang", tilt: "rotate-[-2.6deg]", size: "md:col-span-6" },
  { emoji: "🟥", label: "Roblox", tilt: "rotate-[-1.8deg]", size: "md:col-span-6" },
  { emoji: "📸", label: "Selfie selesai sempro", tilt: "rotate-[1.4deg]", size: "md:col-span-6" },
  { emoji: "🎓", label: "OTW SM", tilt: "rotate-[2.2deg]", size: "md:col-span-6" },
];

export default function SurvivalKit() {
  const [checked, setChecked] = useState<number[]>([]);

  const toggle = (i: number) => {
    let next: number[];
    if (checked.includes(i)) next = checked.filter((x) => x !== i);
    else next = [...checked, i];
    setChecked(next);
    if (next.length === ITEMS.length) unlock("kit");
  };

  return (
    <EditorialSection
      number="05"
      sideLabel="Chapter Five — Celebration"
      title={
        <>
          Yang wajib <em className="italic">dilakuin</em> setelah sempro
        </>
      }
      subtitle="Checklist perayaan — centang satu-satu"
      meta={
        <div className="hidden md:flex flex-col items-end gap-1">
          <span className="stamp">Checklist ✿</span>
          <span className="font-caveat text-xs text-ink/40 mt-2">
            {checked.length}/{ITEMS.length}
          </span>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
        {ITEMS.map((item, i) => {
          const isChecked = checked.includes(i);
          return (
            <motion.button
              key={i}
              onClick={() => toggle(i)}
              initial={{ opacity: 0, y: 24, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ scale: 1.03, rotate: 0 }}
              whileTap={{ scale: 0.97 }}
              className={`${item.size} ${item.tilt} relative`}
            >
              <div className={`paper rounded-sm p-6 h-full text-left transition-all duration-300 ${isChecked ? "border-2 border-sage bg-sage/5" : "border-2 border-rose/20 hover:border-rose/50"} shadow-md`}>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 bg-gold/60 rounded-sm rotate-[-2deg]" />
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="text-4xl">{item.emoji}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${isChecked ? "bg-sage border-sage text-cream" : "border-rose/40"}`}>{isChecked && "✓"}</div>
                </div>
                <p className={`font-caveat text-xl leading-tight transition ${isChecked ? "text-sage/70 line-through" : "text-ink"}`}>{item.label}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
      {checked.length === ITEMS.length && (
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center font-caveat text-2xl text-deep-rose mt-10">
          🎉 lengkap! selamat menikmati hari kamu
        </motion.p>
      )}
    </EditorialSection>
  );
}
