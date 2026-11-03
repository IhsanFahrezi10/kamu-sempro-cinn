"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import EditorialSection from "./EditorialSection";
import { useAchievements, ACHIEVEMENT_META, ALL_ACHIEVEMENTS } from "@/lib/achievements";

export default function AchievementBadge() {
  const unlocked = useAchievements();
  const allDone = ALL_ACHIEVEMENTS.every((k) => unlocked.has(k));

  // Hitung hanya yang ada di ALL_ACHIEVEMENTS (buang share/konami lama kalau ada)
  const unlockedCount = ALL_ACHIEVEMENTS.filter((k) => unlocked.has(k)).length;

  useEffect(() => {
    if (allDone) {
      confetti({
        particleCount: 180,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#FF8FAB", "#FFC1D5", "#F0C979", "#E0C9F0", "#C73E68"],
      });
    }
  }, [allDone]);

  return (
    <EditorialSection
      number="08"
      sideLabel="Chapter Eight — Trophy"
      title={
        allDone ? (
          <>
            Sempro <em className="italic">survivor.</em>
          </>
        ) : (
          <>
            Badge <em className="italic">progress.</em>
          </>
        )
      }
      subtitle={allDone ? "lo nemu semua rahasia di halaman ini 🎉" : `${unlockedCount} dari ${ALL_ACHIEVEMENTS.length} terbuka`}
      meta={
        <div className="hidden md:flex flex-col items-end gap-1">
          <span className="stamp">{allDone ? "Selesai ✓" : "In progress"}</span>
          <span className="font-caveat text-xs text-ink/40 mt-2 tabular-nums">{Math.round((unlockedCount / ALL_ACHIEVEMENTS.length) * 100)}%</span>
        </div>
      }
    >
      <div className="grid grid-cols-12 gap-6 md:gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`col-span-12 ${allDone ? "md:col-span-7" : "md:col-span-12"}`}
        >
          <div className={`grid gap-3 md:gap-4 ${allDone ? "grid-cols-3 md:grid-cols-4" : "grid-cols-3 md:grid-cols-5"}`}>
            {ALL_ACHIEVEMENTS.map((key, i) => {
              const meta = ACHIEVEMENT_META[key];
              const isOn = unlocked.has(key);
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  whileHover={{ scale: 1.06, rotate: -2 }}
                  className={`paper rounded-sm p-3 text-center transition ${isOn ? "border-2 border-sage" : "border-2 border-rose/15 opacity-50 grayscale"}`}
                >
                  <p className="text-3xl md:text-4xl mb-1 select-none">{meta.emoji}</p>
                  <p className={`font-caveat text-[11px] md:text-xs leading-tight ${isOn ? "text-deep-rose" : "text-ink/40"}`}>{meta.label}</p>
                </motion.div>
              );
            })}
          </div>

          {!allDone && <p className="font-caveat text-base text-ink/50 mt-6 italic text-center">masih ada {ALL_ACHIEVEMENTS.length - unlockedCount} yang belum lo temuin. scroll lagi, klik-klik aja ✨</p>}
        </motion.div>

        {/* Certificate — hanya muncul kalau allDone */}
        {allDone && (
          <motion.div initial={{ opacity: 0, x: 30, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} className="col-span-12 md:col-span-5 relative">
            <div className="absolute inset-0 bg-gold/20 rounded-sm rotate-1 translate-x-1 translate-y-1" />

            <div className="paper relative rounded-sm p-8 md:p-10 shadow-xl border-4 border-gold">
              <div className="absolute inset-3 border border-gold/40 rounded-sm pointer-events-none" />

              <div className="text-center relative">
                <motion.p animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-5xl mb-3">
                  🏆
                </motion.p>

                <p className="font-caveat text-xs text-rose tracking-[0.3em] uppercase mb-1">— Certificate —</p>

                <h3 className="font-pacifico text-2xl text-deep-rose mb-1">Sempro Survivor</h3>

                <p className="font-caveat text-sm text-rose/70 italic mb-6">awarded to</p>

                <div className="border-t border-b border-rose/25 py-4 my-6">
                  <p className="font-pacifico text-xl md:text-2xl text-deep-rose">Chintia Zahra Harahap</p>
                </div>

                <p className="font-caveat text-xs text-ink/50 mb-2">
                  {new Date().toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>

                <p className="font-caveat text-xs text-ink/40">— lo berhasil nemu semua {ALL_ACHIEVEMENTS.length} rahasia —</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </EditorialSection>
  );
}
