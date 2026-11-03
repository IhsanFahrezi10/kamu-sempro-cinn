"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EditorialSection from "./EditorialSection";
import { unlock } from "@/lib/achievements";

const TOTAL = 8;

export default function WishJar() {
  const [fed, setFed] = useState(0);
  const [flying, setFlying] = useState<{ id: number; fromX: number; fromY: number }[]>([]);

  const feed = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (fed >= TOTAL) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const parent = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!parent) return;
    const id = Date.now();
    setFlying((f) => [...f, { id, fromX: ((rect.left - parent.left + rect.width / 2) / parent.width) * 100, fromY: ((rect.top - parent.top + rect.height / 2) / parent.height) * 100 }]);
    setTimeout(() => setFlying((f) => f.filter((x) => x.id !== id)), 600);
    const next = fed + 1;
    setFed(next);
    if (next === TOTAL) unlock("wish");
  };

  return (
    <EditorialSection
      number="06"
      sideLabel="Chapter Six — Feed"
      title={
        <>
          Kasih makan <em className="italic">kucing.</em>
        </>
      }
      subtitle="Klik ikannya, biar si kucing kenyang"
      meta={
        <div className="hidden md:flex flex-col items-end gap-1">
          <span className="stamp">Feeding ✿</span>
          <span className="font-caveat text-xs text-ink/40 mt-2 tabular-nums">
            {fed}/{TOTAL} ekor
          </span>
        </div>
      }
    >
      <div className="grid grid-cols-12 gap-6 md:gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="col-span-12 md:col-span-4 text-center md:text-left">
          <p className="font-caveat text-2xl text-rose mb-4">kenyang-meter</p>
          <motion.span
            className="text-[120px] md:text-[160px] inline-block select-none leading-none"
            animate={{ scale: fed === TOTAL ? [1, 1.1, 1] : 1, rotate: fed === 0 ? [-3, 3, -3] : 0 }}
            transition={{ duration: 0.8, repeat: fed === TOTAL ? Infinity : 0 }}
          >
            {fed === 0 ? "🐱" : fed < TOTAL / 2 ? "😺" : fed < TOTAL ? "😸" : "😻"}
          </motion.span>
          <div className="flex items-center gap-1.5 mt-6 justify-center md:justify-start">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full transition ${i < fed ? "bg-deep-rose" : "bg-rose/20"}`} />
            ))}
          </div>
          <p className="font-caveat text-lg text-rose mt-4">
            {fed === 0 && "kucing nya mau mam 🐟"}
            {fed > 0 && fed < TOTAL && `${fed}/${TOTAL} ekor udah dimakan`}
            {fed === TOTAL && "🎉 kenyang! si kucing seneng"}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="col-span-12 md:col-span-8 relative">
          <div className="absolute inset-0 bg-sage/15 rounded-sm rotate-[-1deg] translate-x-1 translate-y-1" />
          <div className="paper relative rounded-sm p-4 shadow-xl">
            <div className="relative w-full h-64 md:h-80 rounded-sm border-2 border-dashed border-rose/30 bg-gradient-to-b from-[#FFF0F5]/60 to-[#FFE5EC]/60 overflow-hidden">
              {Array.from({ length: TOTAL }).map((_, i) => {
                if (i < fed) return null;
                return (
                  <motion.button
                    key={i}
                    onClick={feed}
                    animate={{ x: [0, 15, -15, 0], y: [0, -8, 4, 0], rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 4 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.8 }}
                    className="absolute text-3xl md:text-4xl cursor-pointer select-none"
                    style={{ left: `${10 + ((i * 12) % 75)}%`, top: `${15 + ((i * 17) % 60)}%` }}
                    aria-label="ikan"
                  >
                    🐟
                  </motion.button>
                );
              })}
              <AnimatePresence>
                {flying.map((f) => (
                  <motion.div
                    key={f.id}
                    initial={{ left: `${f.fromX}%`, top: `${f.fromY}%`, opacity: 1, scale: 1.3 }}
                    animate={{ left: "50%", top: "-30%", opacity: 0, scale: 0.3 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeIn" }}
                    className="absolute text-3xl pointer-events-none"
                  >
                    🐟
                  </motion.div>
                ))}
              </AnimatePresence>
              {fed === TOTAL && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="font-pacifico text-3xl md:text-4xl text-deep-rose text-center">🎉 kenyang!</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </EditorialSection>
  );
}
