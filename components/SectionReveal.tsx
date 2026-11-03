"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export type RevealVariant = "fade-up" | "slide-left" | "slide-right" | "zoom" | "flip" | "rotate" | "blur" | "drop";

export type AmbientType = "petals" | "bubbles" | "sparkles" | "hearts" | "stars" | "questions" | "steam";

const AMBIENT_ICONS: Record<AmbientType, string[]> = {
  petals: ["🌸", "🌷", "🌺"],
  bubbles: ["◯", "○", "◌"],
  sparkles: ["✨", "✦", "✧"],
  hearts: ["💗", "💕", "🩷"],
  stars: ["⭐", "✨", "💫"],
  questions: ["?", "❓", "?"],
  steam: ["≈", "~", "～"],
};

const EASE = [0.16, 1, 0.3, 1] as const;

const VARIANTS: Record<RevealVariant, any> = {
  "fade-up": {
    initial: { opacity: 0, y: 80 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: EASE },
  },
  "slide-left": {
    initial: { opacity: 0, x: -120, rotate: -3 },
    whileInView: { opacity: 1, x: 0, rotate: 0 },
    transition: { duration: 1, ease: EASE },
  },
  "slide-right": {
    initial: { opacity: 0, x: 120, rotate: 3 },
    whileInView: { opacity: 1, x: 0, rotate: 0 },
    transition: { duration: 1, ease: EASE },
  },
  zoom: {
    initial: { opacity: 0, scale: 0.6 },
    whileInView: { opacity: 1, scale: 1 },
    transition: { duration: 0.9, type: "spring", stiffness: 100, damping: 20 },
  },
  flip: {
    initial: { opacity: 0, rotateX: -70, y: 60, transformPerspective: 1200 },
    whileInView: { opacity: 1, rotateX: 0, y: 0, transformPerspective: 1200 },
    transition: { duration: 1.1, ease: EASE },
  },
  rotate: {
    initial: { opacity: 0, rotate: -15, scale: 0.8 },
    whileInView: { opacity: 1, rotate: 0, scale: 1 },
    transition: { duration: 1, ease: EASE },
  },
  blur: {
    initial: { opacity: 0, filter: "blur(24px)", scale: 0.9 },
    whileInView: { opacity: 1, filter: "blur(0px)", scale: 1 },
    transition: { duration: 1.1, ease: EASE },
  },
  drop: {
    initial: { opacity: 0, y: -120, rotate: 5 },
    whileInView: { opacity: 1, y: 0, rotate: 0 },
    transition: { duration: 1, type: "spring", stiffness: 100, damping: 16 },
  },
};

export default function SectionReveal({ children, variant = "fade-up", ambient, className = "" }: { children: ReactNode; variant?: RevealVariant; ambient?: AmbientType; className?: string }) {
  const v = VARIANTS[variant];

  return (
    <motion.div initial={v.initial} whileInView={v.whileInView} viewport={{ once: true, margin: "-100px" }} transition={v.transition} className={`relative overflow-hidden ${className}`}>
      {ambient && <Ambient type={ambient} />}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

function Ambient({ type }: { type: AmbientType }) {
  const icons = AMBIENT_ICONS[type];
  const isRise = ["petals", "bubbles", "hearts", "steam"].includes(type);
  const isTwinkle = ["sparkles", "stars", "questions"].includes(type);

  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden z-0 hidden sm:block">
      {Array.from({ length: 12 }).map((_, i) => {
        const icon = icons[i % icons.length];
        const left = `${(i * 11 + 5) % 100}%`;
        const top = `${(i * 17 + 8) % 88}%`;
        const duration = isRise ? 12 + (i % 5) * 3 : 3.5 + (i % 4) * 0.7;
        const delay = i * 0.7;
        const anim = isRise ? `ambient-rise ${duration}s linear ${delay}s infinite` : isTwinkle ? `ambient-twinkle ${duration}s ease-in-out ${delay}s infinite` : `ambient-drift ${duration}s ease-in-out ${delay}s infinite`;

        return (
          <span
            key={i}
            className="absolute select-none"
            style={{
              left,
              top,
              fontSize: `${12 + (i % 4) * 4}px`,
              animation: anim,
              opacity: 0.45,
            }}
          >
            {icon}
          </span>
        );
      })}
    </div>
  );
}
