"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getUnlockedAchievements, getGameScores, generateOrderId, type ReceiptData } from "@/lib/receipt";
import { ACHIEVEMENT_META, ALL_ACHIEVEMENTS } from "@/lib/achievements";

export default function Receipt() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<ReceiptData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const openReceipt = () => {
    const now = new Date();
    const achievements = getUnlockedAchievements();
    const scores = getGameScores();
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

    setData({
      date: now.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: now.toLocaleTimeString("id-ID", { hour12: false }),
      orderId: generateOrderId(),
      achievements,
      scores,
      totalItems: achievements.length,
      totalScore,
    });
    setOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const modal =
    mounted &&
    open &&
    data &&
    createPortal(
      <AnimatePresence>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="receipt-portal-root fixed inset-0 z-[250] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm overflow-y-auto">
          <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="receipt-modal-inner relative w-full max-w-sm my-8">
            {/* Close button — hidden in print */}
            <button
              onClick={() => setOpen(false)}
              className="no-print absolute -top-3 -right-3 z-10 w-10 h-10 rounded-full bg-deep-rose text-cream flex items-center justify-center shadow-lg hover:bg-rose transition text-lg"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Paper strip effect top */}
            <div className="no-print absolute -top-2 left-0 right-0 h-4 flex justify-between pointer-events-none z-0">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-ink/70 -mb-2" />
              ))}
            </div>

            {/* Receipt paper */}
            <div className="receipt-printable relative bg-cream shadow-2xl p-6 md:p-7 border-x-2 border-ink/10">
              {/* Header */}
              <div className="text-center mb-4">
                <p className="font-mono text-sm font-bold tracking-wider text-ink">Chintia&rsquo;S SEMPRO</p>
                <p className="font-mono text-[10px] tracking-[0.3em] text-ink/60 mt-0.5">★ GIFT RECEIPT ★</p>
              </div>

              <div className="border-t-2 border-dashed border-ink/40 my-3" />

              {/* Meta */}
              <div className="font-mono text-[11px] text-ink/80 space-y-0.5">
                <div className="flex justify-between">
                  <span>Date</span>
                  <span>{data.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time</span>
                  <span>{data.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order</span>
                  <span>#{data.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dev</span>
                  <span>mybabyshane</span>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-ink/40 my-3" />

              {/* Items header */}
              <div className="flex justify-between font-mono text-[10px] font-bold tracking-widest text-ink/60 mb-1.5">
                <span>ITEM</span>
                <span>QTY</span>
              </div>
              <div className="border-t border-ink/20 mb-2" />

              {/* Items list */}
              {data.achievements.length > 0 ? (
                <div className="font-mono text-[11px] text-ink/90 space-y-1">
                  {ALL_ACHIEVEMENTS.filter((k) => data.achievements.includes(k)).map((key) => {
                    const meta = ACHIEVEMENT_META[key];
                    return (
                      <div key={key} className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5">
                          <span>{meta.emoji}</span>
                          <span>{meta.label}</span>
                        </span>
                        <span className="tabular-nums">1</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="font-mono text-[11px] text-ink/40 text-center py-3 italic">— belum ada yang dibuka —</p>
              )}

              <div className="border-t-2 border-dashed border-ink/40 my-3" />

              {/* Game Scores */}
              {Object.keys(data.scores).length > 0 && (
                <>
                  <div className="font-mono text-[10px] font-bold tracking-widest text-ink/60 mb-1.5">BEST SCORES</div>
                  <div className="border-t border-ink/20 mb-2" />
                  <div className="font-mono text-[11px] text-ink/90 space-y-1">
                    {Object.entries(data.scores).map(([game, score]) => (
                      <div key={game} className="flex justify-between">
                        <span>{game}</span>
                        <span className="tabular-nums">x{score}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t-2 border-dashed border-ink/40 my-3" />
                </>
              )}

              {/* Summary */}
              <div className="font-mono text-[11px] text-ink/90 space-y-0.5">
                <div className="flex justify-between">
                  <span>ITEMS</span>
                  <span className="tabular-nums">{data.totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>SCORES</span>
                  <span className="tabular-nums">{data.totalScore}</span>
                </div>
              </div>

              <div className="border-t border-ink/20 my-2" />

              <div className="flex justify-between font-mono text-sm font-bold text-ink">
                <span>TOTAL</span>
                <span className="tabular-nums">{data.totalItems >= ALL_ACHIEVEMENTS.length ? "MAX" : data.totalItems}</span>
              </div>

              <div className="border-t-2 border-dashed border-ink/40 my-3" />

              {/* Footer */}
              <div className="text-center font-mono text-[11px] text-ink/80 space-y-0.5 mb-3">
                <p>Thank you for playing!</p>
                <p className="text-[10px] text-ink/50">see you next milestone</p>
              </div>

              <div className="border-t border-dashed border-ink/30 my-3" />

              <p className="text-center font-mono text-[10px] tracking-wider text-ink/50">* tiaa — 2026 — SEMPRO *</p>

              <div className="border-t-2 border-dashed border-ink/40 my-3" />

              {/* Barcode */}
              <div className="flex justify-center items-end gap-[2px] h-10 mb-1.5">
                {Array.from({ length: 40 }).map((_, i) => {
                  const h = [14, 24, 20, 18, 26, 16, 22, 18][i % 8];
                  const w = i % 3 === 0 ? 2 : 1;
                  return <div key={i} className="bg-ink" style={{ width: `${w}px`, height: `${h}px` }} />;
                })}
              </div>
              <p className="text-center font-mono text-[9px] tracking-[0.3em] text-ink/50">{data.orderId}</p>
            </div>

            {/* Paper strip effect bottom */}
            <div className="no-print absolute -bottom-2 left-0 right-0 h-4 flex justify-between pointer-events-none z-0">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-ink/70 -mt-2" />
              ))}
            </div>

            {/* Print button — hidden in print */}
            <div className="no-print mt-6 flex gap-2">
              <button onClick={handlePrint} className="flex-1 bg-deep-rose text-cream font-semibold py-3 rounded-full shadow-lg hover:bg-rose transition text-sm tracking-widest uppercase active:scale-[0.98]">
                🖨 Print
              </button>
              <button onClick={() => setOpen(false)} className="px-6 bg-cream border-2 border-ink/20 text-ink font-semibold py-3 rounded-full hover:border-rose transition text-sm tracking-widest uppercase active:scale-[0.98]">
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>,
      document.body,
    );

  return (
    <>
      <button
        onClick={openReceipt}
        className="inline-flex items-center gap-2 bg-cream border-2 border-ink/20 text-ink font-semibold px-6 py-3 rounded-full shadow-md hover:border-rose hover:bg-blush transition text-sm tracking-wider uppercase"
      >
        🧾 Print Receipt
      </button>
      {modal}
    </>
  );
}
