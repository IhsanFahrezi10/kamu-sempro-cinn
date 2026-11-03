"use client";
import { useEffect, useState } from "react";

type Cloud = { id: number; top: number; size: number; duration: number; delay: number; opacity: number };
type Star = { id: number; x: number; y: number; size: number; duration: number; delay: number };
type Heart = { id: number; x: number; size: number; duration: number; delay: number; emoji: string };
type Icon = { id: number; x: number; y: number; emoji: string; size: number; duration: number; delay: number };
type Shooting = { id: number; top: number; left: number };

export default function Background() {
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [icons, setIcons] = useState<Icon[]>([]);
  const [shooting, setShooting] = useState<Shooting[]>([]);

  useEffect(() => {
    setClouds(Array.from({ length: 5 }).map((_, i) => ({ id: i, top: 5 + Math.random() * 55, size: 120 + Math.random() * 160, duration: 55 + Math.random() * 35, delay: Math.random() * 25, opacity: 0.18 + Math.random() * 0.22 })));
    setStars(Array.from({ length: 35 }).map((_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, size: 1.5 + Math.random() * 2.5, duration: 2 + Math.random() * 2.5, delay: Math.random() * 4 })));
    setHearts(
      Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 14 + Math.random() * 12,
        duration: 14 + Math.random() * 10,
        delay: Math.random() * 15,
        emoji: ["💗", "💕", "💖", "🩷"][Math.floor(Math.random() * 4)],
      })),
    );
    setIcons(
      Array.from({ length: 7 }).map((_, i) => ({
        id: i,
        x: 5 + Math.random() * 90,
        y: 15 + Math.random() * 70,
        emoji: ["🍵", "🐱", "🌸", "🌷", "📺", "🍃", "✨"][i % 7],
        size: 18 + Math.random() * 14,
        duration: 3.5 + Math.random() * 2,
        delay: Math.random() * 2,
      })),
    );
    const shootInterval = setInterval(() => {
      const id = Date.now();
      setShooting((prev) => [...prev, { id, top: Math.random() * 40, left: Math.random() * 50 }]);
      setTimeout(() => {
        setShooting((prev) => prev.filter((s) => s.id !== id));
      }, 2500);
    }, 5500);
    return () => clearInterval(shootInterval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFD6E4] via-[#FFE5EC] to-[#FFF9F3]" />
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-pink/40 blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-lavender/50 blur-3xl" />
      <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] rounded-full bg-rose/20 blur-3xl" />
      {clouds.map((c) => (
        <svg
          key={c.id}
          className="absolute"
          style={{ top: `${c.top}%`, left: "-25%", width: `${c.size}px`, height: `${c.size * 0.5}px`, animation: `drift ${c.duration}s linear ${c.delay}s infinite`, opacity: c.opacity, filter: "blur(1px)" }}
          viewBox="0 0 120 60"
        >
          <ellipse cx="30" cy="42" rx="26" ry="16" fill="white" />
          <ellipse cx="60" cy="34" rx="30" ry="22" fill="white" />
          <ellipse cx="90" cy="42" rx="24" ry="14" fill="white" />
        </svg>
      ))}
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`, boxShadow: "0 0 8px rgba(255,255,255,0.9)" }}
        />
      ))}
      {shooting.map((s) => (
        <div
          key={s.id}
          className="absolute"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: "120px",
            height: "2px",
            background: "linear-gradient(to right, transparent, white, transparent)",
            animation: "shoot 2s ease-out forwards",
            filter: "drop-shadow(0 0 6px white)",
            transformOrigin: "left center",
          }}
        />
      ))}
      {hearts.map((h) => (
        <span key={h.id} className="absolute" style={{ left: `${h.x}%`, bottom: "-10vh", fontSize: `${h.size}px`, animation: `rise ${h.duration}s ease-in ${h.delay}s infinite` }}>
          {h.emoji}
        </span>
      ))}
      {icons.map((i) => (
        <span key={i.id} className="absolute" style={{ left: `${i.x}%`, top: `${i.y}%`, fontSize: `${i.size}px`, animation: `bob ${i.duration}s ease-in-out ${i.delay}s infinite`, opacity: 0.55 }}>
          {i.emoji}
        </span>
      ))}
    </div>
  );
}
