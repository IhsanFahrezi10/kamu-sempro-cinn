"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Stage = "captcha" | "slide";

const GATE_KEY = "cinn-human-check-v1";
const TRIGGER_PCT = 0.3;

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function HumanCheckGate() {
  const [visible, setVisible] = useState(false);
  const [stage, setStage] = useState<Stage>("captcha");
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [captchaError, setCaptchaError] = useState(false);

  const [slideX, setSlideX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [sliderDone, setSliderDone] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const shownRef = useRef(false);

  // Trigger — 3 layer robust
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(GATE_KEY)) return;

    const check = () => {
      if (shownRef.current) return;
      if (sessionStorage.getItem(GATE_KEY)) return;

      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = window.scrollY / max;

      if (pct >= TRIGGER_PCT) {
        shownRef.current = true;
        setCode(generateCode());
        setVisible(true);
        window.dispatchEvent(new Event("gate-state-change"));
      }
    };

    const interval = setInterval(check, 400);
    window.addEventListener("scroll", check, { passive: true });
    const initial = setTimeout(check, 800);

    return () => {
      clearInterval(interval);
      clearTimeout(initial);
      window.removeEventListener("scroll", check);
    };
  }, []);

  // Lock scroll saat modal muncul
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  const handleCaptcha = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().toUpperCase() === code) {
      setStage("slide");
      setCaptchaError(false);
      setInput("");
    } else {
      setCaptchaError(true);
      setInput("");
      setTimeout(() => setCaptchaError(false), 700);
    }
  };

  const startDrag = () => {
    if (sliderDone) return;
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;

    const move = (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const knobWidth = 56;
      const max = rect.width - knobWidth - 8;
      const x = Math.max(0, Math.min(clientX - rect.left - knobWidth / 2 - 4, max));
      setSlideX(x);

      if (x >= max - 3) {
        setSliderDone(true);
        setDragging(false);
        setTimeout(() => {
          sessionStorage.setItem(GATE_KEY, "1");
          setVisible(false);
          window.dispatchEvent(new Event("gate-state-change"));
        }, 700);
      }
    };

    const onMouseMove = (e: MouseEvent) => move(e.clientX);
    const onTouchMove = (e: TouchEvent) => move(e.touches[0].clientX);
    const onUp = () => {
      setDragging(false);
      if (!sliderDone) setSlideX(0);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, sliderDone]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] bg-ink/85 backdrop-blur-lg">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-deep-rose/95 text-cream shadow-lg"
        >
          <span className="text-sm">🔒</span>
          <span className="font-caveat text-xs md:text-sm tracking-wide">page locked — complete verification to continue</span>
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center px-4">
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="paper rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl border-2 border-rose/30">
            <div className="text-center mb-6">
              <p className="font-caveat text-xs text-rose tracking-widest uppercase mb-1">— human check —</p>
              <h3 className="font-pacifico text-2xl md:text-3xl text-deep-rose leading-tight">{stage === "captcha" ? "Buktiin kamu manusia" : "Sekali lagi, geser"}</h3>
              <p className="font-caveat text-base text-rose/70 mt-2">{stage === "captcha" ? "Ketik kode di bawah buat lanjut" : "Geser tombol ke kanan buat verifikasi"}</p>
            </div>

            {stage === "captcha" && (
              <motion.form onSubmit={handleCaptcha} className="space-y-4">
                <div className="paper bg-blush rounded-xl px-6 py-6 text-center relative overflow-hidden border-2 border-rose/20">
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-3 left-6 w-20 h-px bg-ink rotate-12" />
                    <div className="absolute bottom-4 right-8 w-24 h-px bg-ink -rotate-6" />
                    <div className="absolute top-1/2 left-2 w-3 h-3 rounded-full bg-ink" />
                    <div className="absolute top-6 right-4 w-2 h-2 rounded-full bg-ink" />
                  </div>
                  <p className="font-pacifico text-3xl md:text-4xl text-deep-rose tracking-[0.3em] select-none relative">{code}</p>
                </div>

                <motion.input
                  animate={captchaError ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                  transition={{ duration: 0.5 }}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value.toUpperCase())}
                  placeholder="ketik kode di atas..."
                  maxLength={5}
                  autoFocus
                  className={`w-full px-4 py-3 rounded-xl border-2 text-center font-caveat text-xl tracking-widest uppercase transition outline-none ${
                    captchaError ? "border-rose bg-rose/10 text-rose" : "border-rose/30 bg-cream text-deep-rose focus:border-deep-rose"
                  }`}
                />

                {captchaError && <p className="font-caveat text-sm text-rose text-center -mt-1">salah, coba lagi yaa 😅</p>}

                <button type="submit" className="w-full bg-deep-rose text-cream py-3 rounded-full font-semibold text-sm tracking-widest uppercase hover:bg-rose transition shadow-lg active:scale-[0.98]">
                  Lanjut →
                </button>
              </motion.form>
            )}

            {stage === "slide" && (
              <div className="space-y-4">
                <div ref={trackRef} className="relative h-16 bg-blush rounded-full border-2 border-rose/30 overflow-hidden select-none">
                  <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-rose to-deep-rose transition-none" style={{ width: `${slideX + 56}px` }} />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
                    <span className={`font-caveat text-base md:text-lg transition-opacity duration-300 ${slideX > 40 ? "text-cream opacity-100" : "text-rose opacity-70"}`}>{sliderDone ? "✓ terverifikasi" : "geser ke kanan →"}</span>
                  </div>
                  <div
                    onMouseDown={startDrag}
                    onTouchStart={startDrag}
                    style={{ transform: `translateX(${slideX}px)` }}
                    className={`absolute top-1 left-1 w-14 h-14 rounded-full bg-deep-rose border-2 border-cream flex items-center justify-center shadow-lg select-none touch-none ${
                      dragging ? "cursor-grabbing" : "cursor-grab"
                    } transition-transform ${dragging ? "duration-0" : "duration-300"}`}
                  >
                    <span className="text-cream text-xl font-bold">{sliderDone ? "✓" : "→"}</span>
                  </div>
                </div>

                <p className="font-caveat text-xs text-ink/50 text-center">tahan & geser tombol bulat sampai ke ujung kanan</p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
