"use client";
import { useRef, ReactNode } from "react";

export default function MagneticButton({ children, className = "", onClick, strength = 0.25 }: { children: ReactNode; className?: string; onClick?: () => void; strength?: number }) {
  const ref = useRef<HTMLButtonElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  };

  return (
    <button ref={ref} onClick={onClick} onMouseMove={onMove} onMouseLeave={onLeave} className={`transition-transform duration-300 ease-out ${className}`}>
      {children}
    </button>
  );
}
