"use client";
import { useEffect, useRef, useState } from "react";

export default function CatCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [idle, setIdle] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;
    let mx = window.innerWidth / 2,
      my = window.innerHeight / 2;
    let cx = mx,
      cy = my;
    let idleTimer: ReturnType<typeof setTimeout>;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX + 28;
      my = e.clientY + 28;
      setIdle(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIdle(true), 800);
    };
    const tick = () => {
      cx += (mx - cx) * 0.1;
      cy += (my - cy) * 0.1;
      el.style.transform = `translate(${cx}px, ${cy}px)`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      clearTimeout(idleTimer);
    };
  }, []);

  return (
    <div ref={ref} className="fixed top-0 left-0 pointer-events-none z-[9999] text-2xl select-none" style={{ marginLeft: "-14px", marginTop: "-14px" }}>
      <span style={{ display: "inline-block", animation: idle ? "cat-bob 2s ease-in-out infinite" : "none" }}>{idle ? "😺" : "😸"}</span>
    </div>
  );
}
