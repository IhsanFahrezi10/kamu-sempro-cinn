"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EditorialSection from "./EditorialSection";
import { unlock } from "@/lib/achievements";
import { saveGameScore } from "@/lib/receipt";

const GOOD = ["🐟", "🍵", "💗", "🐾", "🌸", "🧶"];
const BAD = ["📚", "📄"];
const PLAY_HEIGHT = 320;
const CAT_Y_LINE = 82;
const DURATION = 20;

type Item = { id: number; x: number; y: number; emoji: string; points: number };

export default function CatCatch() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "over">("idle");
  const [catX, setCatX] = useState(50);
  const [items, setItems] = useState<Item[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [popup, setPopup] = useState<{ id: number; text: string; x: number } | null>(null);

  const catXRef = useRef(50);
  const itemsRef = useRef<Item[]>([]);
  const scoreRef = useRef(0);
  const timeRef = useRef(DURATION);
  const nextIdRef = useRef(0);
  const rafRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const playingRef = useRef(false);

  const start = () => {
    catXRef.current = 50;
    itemsRef.current = [];
    scoreRef.current = 0;
    timeRef.current = DURATION;
    nextIdRef.current = 0;
    lastSpawnRef.current = 0;
    playingRef.current = true;
    setCatX(50);
    setItems([]);
    setScore(0);
    setTimeLeft(DURATION);
    setGameState("playing");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!playingRef.current) return;
      if (e.key === "ArrowLeft" || e.key === "a") catXRef.current = Math.max(12, catXRef.current - 6);
      if (e.key === "ArrowRight" || e.key === "d") catXRef.current = Math.min(88, catXRef.current + 6);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;
    const timer = setInterval(() => {
      timeRef.current -= 1;
      setTimeLeft(timeRef.current);
      if (timeRef.current <= 0) {
        playingRef.current = false;
        setGameState("over");
        if (scoreRef.current >= 8) unlock("catch");
        saveGameScore("Cat Catch", scoreRef.current); // ← TAMBAH
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "playing") return;
    const loop = () => {
      if (!playingRef.current) return;
      lastSpawnRef.current++;
      if (lastSpawnRef.current > 22) {
        const isBad = Math.random() < 0.28;
        const pool = isBad ? BAD : GOOD;
        itemsRef.current.push({ id: nextIdRef.current++, x: 10 + Math.random() * 80, y: -5, emoji: pool[Math.floor(Math.random() * pool.length)], points: isBad ? -1 : 1 });
        lastSpawnRef.current = 0;
      }
      const newItems: Item[] = [];
      for (const it of itemsRef.current) {
        const ny = it.y + 2.2;
        const caught = ny > CAT_Y_LINE && ny < CAT_Y_LINE + 15 && Math.abs(it.x - catXRef.current) < 12;
        if (caught) {
          scoreRef.current += it.points;
          const pid = nextIdRef.current++;
          setPopup({ id: pid, text: it.points > 0 ? "+1" : "-1", x: it.x });
          setTimeout(() => setPopup(null), 500);
        } else if (ny < 110) newItems.push({ ...it, y: ny });
      }
      itemsRef.current = newItems;
      setCatX(catXRef.current);
      setItems([...itemsRef.current]);
      setScore(scoreRef.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [gameState]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!playingRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    catXRef.current = Math.max(12, Math.min(88, pct));
  };

  return (
    <EditorialSection
      number="03"
      sideLabel="Chapter Three — Catch"
      title={
        <>
          Tangkap <em className="italic">ikan.</em>
        </>
      }
      subtitle="Geser mouse / jari — tangkap yang bagus, hindari 📚"
      meta={
        <div className="hidden md:flex flex-col items-end gap-1">
          <span className="stamp">Game ✦</span>
          <span className="font-caveat text-xs text-ink/40 mt-2 tabular-nums">
            ⏱ {timeLeft}s · {score}
          </span>
        </div>
      }
    >
      <div className="grid grid-cols-12 gap-6 md:gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="col-span-12 md:col-span-8 relative">
          <div className="absolute inset-0 bg-lavender/30 rounded-sm rotate-[-1deg] translate-x-1 translate-y-1" />
          <div className="paper relative rounded-sm p-3 md:p-4 shadow-xl">
            <div
              onMouseMove={handleMove}
              onTouchStart={handleMove}
              onTouchMove={handleMove}
              className="relative w-full bg-gradient-to-b from-[#E0F0E8]/40 via-[#FFF0F5] to-[#FFE5EC] rounded-sm overflow-hidden select-none border border-rose/15"
              style={{ height: `${PLAY_HEIGHT}px`, touchAction: "none" }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="absolute text-xs opacity-20" style={{ left: `${i * 13}%`, bottom: "2px" }}>
                  🌾
                </span>
              ))}
              <AnimatePresence>
                {items.map((it) => (
                  <div key={it.id} className="absolute text-3xl md:text-4xl" style={{ left: `${it.x}%`, top: `${it.y}%`, transform: "translateX(-50%)" }}>
                    {it.emoji}
                  </div>
                ))}
              </AnimatePresence>
              <div className="absolute text-4xl md:text-5xl transition-none" style={{ left: `${catX}%`, top: `${CAT_Y_LINE}%`, transform: "translateX(-50%)" }}>
                🐱
              </div>
              {popup && (
                <motion.div
                  key={popup.id}
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                  className={`absolute text-xl font-bold pointer-events-none ${popup.text === "+1" ? "text-sage" : "text-rose"}`}
                  style={{ left: `${popup.x}%`, top: `${CAT_Y_LINE - 5}%` }}
                >
                  {popup.text}
                </motion.div>
              )}
              {gameState === "playing" && (
                <>
                  <div className="absolute top-3 left-4 font-pacifico text-xl text-deep-rose bg-cream/80 px-3 py-1 rounded-sm border border-rose/30 tabular-nums">{score}</div>
                  <div className="absolute top-3 right-4 font-pacifico text-xl text-deep-rose bg-cream/80 px-3 py-1 rounded-sm border border-rose/30 tabular-nums">⏱ {timeLeft}</div>
                </>
              )}
              {gameState === "idle" && (
                <div className="absolute inset-0 bg-cream/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-center px-4">
                  <p className="font-caveat text-2xl text-deep-rose text-center">bantu kucingnya makan?</p>
                  <button onClick={start} className="bg-deep-rose text-cream font-semibold px-7 py-2.5 rounded-full hover:bg-rose transition shadow-lg text-sm tracking-wider uppercase">
                    Mulai 🐟
                  </button>
                </div>
              )}
              {gameState === "over" && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 bg-cream/90 backdrop-blur-sm flex flex-col items-center justify-center">
                  <p className="text-4xl mb-1">{score >= 8 ? "😻" : "😿"}</p>
                  <p className="font-pacifico text-2xl text-deep-rose">Skor: {score}</p>
                  <p className="font-caveat text-base text-rose mb-3">{score >= 15 ? "kucingnya kenyang banget!" : score >= 8 ? "not bad laa" : "kucingnya masih laper..."}</p>
                  <button onClick={start} className="bg-deep-rose text-cream font-semibold px-7 py-2.5 rounded-full hover:bg-rose transition shadow-lg text-sm tracking-wider uppercase">
                    Coba lagi 🔄
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="col-span-12 md:col-span-4">
          <p className="font-caveat text-2xl text-rose mb-3">si kucing laper</p>
          <p className="text-ink/70 text-sm md:text-base leading-relaxed mb-6">Geser mouse atau jari buat gerakin kucing. Tangkap ikan, matcha, bunga — hindari buku revisi.</p>
          <div className="paper p-5 rounded-sm border-2 border-rose/20 mb-4">
            <p className="font-caveat text-xs text-ink/50 mb-1 uppercase tracking-wider">Skor</p>
            <p className="font-pacifico text-3xl text-deep-rose tabular-nums">{score}</p>
          </div>
          <div className="paper p-5 rounded-sm border-2 border-rose/20">
            <p className="font-caveat text-xs text-ink/50 mb-1 uppercase tracking-wider">Waktu</p>
            <p className="font-pacifico text-3xl text-rose tabular-nums">{timeLeft}s</p>
          </div>
        </motion.div>
      </div>
    </EditorialSection>
  );
}
