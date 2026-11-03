"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import EditorialSection from "./EditorialSection";
import { unlock } from "@/lib/achievements";
import { saveGameScore } from "@/lib/receipt";

const OBSTACLES = ["📚", "☕", "📄", "📖", "💻", "🗒️"];
const CAT_X = 15;
const PLAY_HEIGHT = 260;
const GROUND_PX = 20;
const SPEED = 2.8;
const GRAVITY = 0.6;
const JUMP_V = -12;
const MAX_JUMP = 130;
const COLLISION_X = 8;
const COLLISION_Y = -55;
const LAND_COOLDOWN = 300;

export default function CatJump() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "over">("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [catY, setCatY] = useState(0);
  const [obstacles, setObstacles] = useState<{ id: number; x: number; emoji: string }[]>([]);
  const [jumping, setJumping] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const catYRef = useRef(0);
  const catVYRef = useRef(0);
  const obsRef = useRef<{ id: number; x: number; emoji: string }[]>([]);
  const scoreRef = useRef(0);
  const nextIdRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const rafRef = useRef(0);
  const playingRef = useRef(false);
  const isOverRef = useRef(false);
  const landedAtRef = useRef(0);

  const start = () => {
    catYRef.current = 0;
    catVYRef.current = 0;
    obsRef.current = [];
    scoreRef.current = 0;
    lastSpawnRef.current = 0;
    nextIdRef.current = 0;
    isOverRef.current = false;
    playingRef.current = true;
    landedAtRef.current = 0;
    setCatY(0);
    setObstacles([]);
    setScore(0);
    setGameState("playing");
  };

  const jump = () => {
    if (!playingRef.current) return;

    // Masih di udara — block
    if (catYRef.current > 0) return;

    // Cooldown setelah landing — block
    const now = Date.now();
    if (landedAtRef.current > 0 && now - landedAtRef.current < LAND_COOLDOWN) {
      // Kasih feedback kecil kalau masih cooldown
      setBlocked(true);
      setTimeout(() => setBlocked(false), 150);
      return;
    }

    catVYRef.current = JUMP_V;
    landedAtRef.current = 0;
    setJumping(true);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;

      if (isTyping) return;

      if (e.code === "Space" || e.key === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;

    const loop = () => {
      if (isOverRef.current) return;

      catVYRef.current += GRAVITY;
      catYRef.current += catVYRef.current;
      if (catYRef.current > 0) {
        catYRef.current = 0;
        catVYRef.current = 0;
        // Set landed time hanya sekali per landing
        if (landedAtRef.current === 0) {
          landedAtRef.current = Date.now();
        }
        setJumping(false);
      }
      if (catYRef.current < -MAX_JUMP) {
        catYRef.current = -MAX_JUMP;
        catVYRef.current = 0;
      }

      obsRef.current = obsRef.current.map((o) => ({ ...o, x: o.x - SPEED })).filter((o) => o.x > -10);

      lastSpawnRef.current++;
      if (lastSpawnRef.current > 80 && Math.random() > 0.5) {
        obsRef.current.push({
          id: nextIdRef.current++,
          x: 105,
          emoji: OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)],
        });
        lastSpawnRef.current = 0;
      }

      for (const o of obsRef.current) {
        if (Math.abs(o.x - CAT_X) < COLLISION_X && catYRef.current > COLLISION_Y) {
          isOverRef.current = true;
          playingRef.current = false;
          const s = Math.floor(scoreRef.current);
          setScore(s);
          setBest((b) => Math.max(b, s));
          if (s >= 5) unlock("jump");
          saveGameScore("Cat Jump", s); // ← TAMBAH
          setGameState("over");
          return;
        }
      }

      scoreRef.current += 0.08;
      setCatY(catYRef.current);
      setObstacles([...obsRef.current]);
      setScore(Math.floor(scoreRef.current));

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [gameState]);

  return (
    <EditorialSection
      number="02"
      sideLabel="Chapter Two — Jump"
      title={
        <>
          Kucing <em className="italic">lompat.</em>
        </>
      }
      subtitle="Klik / tap / spasi buat lompatin rintangan"
      meta={
        <div className="hidden md:flex flex-col items-end gap-1">
          <span className="stamp">Game ✦</span>
          <span className="font-caveat text-xs text-ink/40 mt-2 tabular-nums">Best: {best}</span>
        </div>
      }
    >
      <div className="grid grid-cols-12 gap-6 md:gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="col-span-12 md:col-span-4">
          <p className="font-caveat text-2xl text-rose mb-3">si kucing mau lompat</p>
          <p className="text-ink/70 text-sm md:text-base leading-relaxed mb-6">Rintangannya buku revisi, kopi, dan deadline. Bantu kucingnya lompat sebisa mungkin. Ada jeda setelah mendarat — jadi timing-nya harus pas.</p>
          <div className="paper p-5 rounded-sm border-2 border-rose/20 mb-4">
            <p className="font-caveat text-xs text-ink/50 mb-1 uppercase tracking-wider">Skor sekarang</p>
            <p className="font-pacifico text-3xl text-deep-rose tabular-nums">{score}</p>
          </div>
          <div className="paper p-5 rounded-sm border-2 border-rose/20">
            <p className="font-caveat text-xs text-ink/50 mb-1 uppercase tracking-wider">Skor terbaik</p>
            <p className="font-pacifico text-3xl text-rose tabular-nums">{best}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="col-span-12 md:col-span-8 relative">
          <div className="absolute inset-0 bg-pink/20 rounded-sm rotate-1 translate-x-1 translate-y-1" />
          <div className="paper relative rounded-sm p-3 md:p-4 shadow-xl">
            <div
              onClick={jump}
              onTouchStart={(e) => {
                e.preventDefault();
                jump();
              }}
              className="relative w-full bg-gradient-to-b from-[#FFF0F5] to-[#FFE5EC] rounded-sm overflow-hidden select-none border border-rose/15"
              style={{ height: `${PLAY_HEIGHT}px`, touchAction: "manipulation" }}
            >
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose/40" />
              {Array.from({ length: 14 }).map((_, i) => (
                <span key={i} className="absolute text-xs opacity-30 select-none" style={{ left: `${i * 7.5}%`, bottom: `${GROUND_PX - 4}px` }}>
                  🌿
                </span>
              ))}

              <div
                className="absolute text-4xl md:text-5xl"
                style={{
                  left: `${CAT_X}%`,
                  bottom: `${GROUND_PX - catY}px`,
                  transform: "translateX(-50%)",
                  transition: "none",
                  opacity: blocked ? 0.6 : 1,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    transform: `rotate(${Math.max(-15, Math.min(15, -catY * 0.15))}deg)`,
                  }}
                >
                  {gameState === "over" ? "😿" : jumping ? "😸" : blocked ? "😐" : "🐱"}
                </span>
              </div>

              {obstacles.map((o) => (
                <div
                  key={o.id}
                  className="absolute text-3xl md:text-4xl"
                  style={{
                    left: `${o.x}%`,
                    bottom: `${GROUND_PX}px`,
                    transform: "translateX(-50%)",
                  }}
                >
                  {o.emoji}
                </div>
              ))}

              {gameState === "playing" && <div className="absolute top-3 right-4 font-pacifico text-xl text-deep-rose bg-cream/80 px-3 py-1 rounded-sm border border-rose/30 tabular-nums">{score}</div>}

              {gameState === "idle" && (
                <div className="absolute inset-0 bg-cream/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                  <p className="font-caveat text-2xl text-deep-rose">siap lompat?</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      start();
                    }}
                    className="bg-deep-rose text-cream font-semibold px-7 py-2.5 rounded-full hover:bg-rose transition shadow-lg text-sm tracking-wider uppercase"
                  >
                    Mulai 🐾
                  </button>
                </div>
              )}

              {gameState === "over" && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 bg-cream/90 backdrop-blur-sm flex flex-col items-center justify-center">
                  <p className="text-4xl mb-1">😿</p>
                  <p className="font-pacifico text-2xl text-deep-rose">Skor: {score}</p>
                  <p className="font-caveat text-lg text-rose mb-3">Best: {best}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      start();
                    }}
                    className="bg-deep-rose text-cream font-semibold px-7 py-2.5 rounded-full hover:bg-rose transition shadow-lg text-sm tracking-wider uppercase"
                  >
                    Coba lagi 🔄
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </EditorialSection>
  );
}
