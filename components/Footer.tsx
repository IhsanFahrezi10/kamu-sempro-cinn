"use client";

const COLORS = [
  { name: "cream", hex: "#FFF9F3" },
  { name: "blush", hex: "#FFE5EC" },
  { name: "pink", hex: "#FFC1D5" },
  { name: "rose", hex: "#FF8FAB" },
  { name: "deep-rose", hex: "#C73E68" },
  { name: "lavender", hex: "#E0C9F0" },
  { name: "gold", hex: "#F0C979" },
  { name: "sage", hex: "#8FA88F" },
  { name: "ink", hex: "#4A2E3A" },
];

const CONTENT_KEYWORDS = ["sempro", "skripsi", "matcha", "kucing", "kdrama", "treadmill", "discord", "kedinasan", "tidur siang", "roblox", "gofood ayam sinar siang", "nonchalant", "bab 1-3", "revisi", "S.M."];

const BUILD_KEYWORDS = ["Next.js 16", "TypeScript", "Tailwind CSS 4", "Framer Motion", "Canvas Confetti", "Vercel"];

export default function Footer() {
  return (
    <footer className="relative border-t-2 border-ink/10 mt-12 sm:mt-16 bg-cream/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10 lg:px-16 py-10 sm:py-12 md:py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 md:gap-10 lg:gap-12">
          {/* === Color palette === */}
          <div className="md:col-span-5">
            <p className="font-caveat text-[11px] sm:text-xs text-rose uppercase tracking-[0.3em] mb-3 sm:mb-4">— Color Palette —</p>
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5 md:gap-3 max-w-md md:max-w-none">
              {COLORS.map((c) => (
                <div key={c.name} className="flex flex-col gap-1">
                  <div className="h-11 sm:h-12 md:h-11 lg:h-12 rounded-sm border border-ink/15 shadow-sm" style={{ backgroundColor: c.hex }} />
                  <div className="text-center leading-tight">
                    <p className="font-caveat text-[10px] sm:text-[11px] md:text-xs text-ink/70 truncate">{c.name}</p>
                    <p className="font-caveat text-[9px] sm:text-[10px] text-ink/40 tracking-wider">{c.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* === Keywords === */}
          <div className="md:col-span-4">
            <p className="font-caveat text-[11px] sm:text-xs text-rose uppercase tracking-[0.3em] mb-3 sm:mb-4">— Keywords —</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {CONTENT_KEYWORDS.map((k) => (
                <span key={k} className="border border-ink/15 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] md:text-xs text-ink/70 bg-cream/80 hover:border-rose/50 hover:text-deep-rose transition">
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* === Built with === */}
          <div className="md:col-span-3">
            <p className="font-caveat text-[11px] sm:text-xs text-rose uppercase tracking-[0.3em] mb-3 sm:mb-4">— Built With —</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {BUILD_KEYWORDS.map((k) => (
                <span key={k} className="border border-deep-rose/30 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] md:text-xs text-deep-rose bg-cream/80">
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* === Bottom bar === */}
        <div className="mt-10 sm:mt-12 pt-5 sm:pt-6 border-t border-ink/10 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 text-center md:text-left">
          <p className="font-caveat text-sm sm:text-base text-ink/50">
            dev by <span className="text-deep-rose font-semibold">mybabyshane</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
