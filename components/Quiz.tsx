"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EditorialSection from "./EditorialSection";
import { unlock } from "@/lib/achievements";

type Claim = { claim: string; tag: string };

const CLAIMS: Claim[] = [
  {
    claim: "Jadi swiftie tuh gimmick doang, aslinya doyan JJ jamet",
    tag: "Musik",
  },
  {
    claim: "Suka mencet-mencet live loc aku kalo lagi di jalan",
    tag: "Kebiasaan",
  },
  {
    claim: "Gapernah repost 'must a nice' karena takut aku roasting lagi",
    tag: "Sosmed",
  },
  {
    claim: "Suka stalking status WA mama aku",
    tag: "Kebiasaan",
  },
  {
    claim: "Sampe sekarang pengen diajarin biar video JJ nya ga burik",
    tag: "Hobi",
  },
  {
    claim: "Penilaian kamu soal aku sebenernya 'Ihsan greenflag'",
    tag: "Penilaian",
  },
  {
    claim: "Kamu excited sama greeting card ini",
    tag: "Reaksi",
  },
  {
    claim: "Y ok",
    tag: "Bonus",
  },
];

export default function Quiz() {
  const [idx, setIdx] = useState(0);
  const [bener, setBener] = useState(0);
  const [salah, setSalah] = useState(0);
  const [picked, setPicked] = useState<"bener" | "salah" | null>(null);
  const [done, setDone] = useState(false);

  const pick = (choice: "bener" | "salah") => {
    if (picked !== null) return;
    setPicked(choice);
    if (choice === "bener") setBener((b) => b + 1);
    else setSalah((s) => s + 1);

    setTimeout(() => {
      if (idx + 1 === CLAIMS.length) {
        setDone(true);
        unlock("quiz");
      } else {
        setIdx(idx + 1);
        setPicked(null);
      }
    }, 700);
  };

  const restart = () => {
    setIdx(0);
    setBener(0);
    setSalah(0);
    setPicked(null);
    setDone(false);
  };

  const accuracy = Math.round((bener / CLAIMS.length) * 100);

  const verdict =
    bener === CLAIMS.length ? "🏆 Berarti developer beneran kenal kamu luar dalem." : bener >= 5 ? "✨ Lumayan, sebagian besar bener." : bener >= 3 ? "😅 Hmm, developer agak sok tau nih." : "💀 Developer ternyata ngarang semua ya.";

  return (
    <EditorialSection
      number="04"
      sideLabel="Chapter Four — Sok Tau"
      title={
        <>
          Seberapa <em className="italic">sok tau</em> developer?
        </>
      }
      subtitle="Cek, seberapa bener developer masukin info soal kamu di sini"
      meta={
        <div className="hidden md:flex flex-col items-end gap-1">
          <span className="stamp">Verifikasi ✦</span>
          <span className="font-caveat text-xs text-ink/40 mt-2 tabular-nums">{done ? `Selesai · ${bener}/${CLAIMS.length}` : `Klaim ${idx + 1}/${CLAIMS.length}`}</span>
        </div>
      }
    >
      <div className="grid grid-cols-12 gap-6 md:gap-12 items-start">
        {/* LEFT: progress + score */}
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="col-span-12 md:col-span-4">
          <p className="font-caveat text-2xl text-rose mb-4">progress cek</p>

          <div className="space-y-2 mb-6">
            {CLAIMS.map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition ${
                    done || i < idx ? "bg-sage border-sage text-cream" : i === idx ? "bg-deep-rose border-deep-rose text-cream" : "border-rose/30 text-rose/40"
                  }`}
                >
                  {done || i < idx ? "✓" : i + 1}
                </div>
                <span className={`font-caveat text-base ${i === idx && !done ? "text-deep-rose font-semibold" : "text-ink/50"}`}>Klaim {i + 1}</span>
              </div>
            ))}
          </div>

          <div className="paper p-4 rounded-sm border-2 border-rose/20 mb-4">
            <div className="flex items-center justify-between">
              <span className="font-caveat text-xs text-ink/50 uppercase tracking-wider">Bener</span>
              <span className="font-pacifico text-2xl text-sage tabular-nums">{bener}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="font-caveat text-xs text-ink/50 uppercase tracking-wider">Sok tau</span>
              <span className="font-pacifico text-2xl text-rose tabular-nums">{salah}</span>
            </div>
          </div>

          {done && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="paper p-5 rounded-sm border-2 border-gold/40">
              <p className="font-caveat text-xs text-ink/50 mb-1 uppercase tracking-wider">Akurasi developer</p>
              <p className="font-pacifico text-4xl text-deep-rose tabular-nums">
                {accuracy}
                <span className="text-rose/50 text-2xl">%</span>
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* RIGHT: claim card */}
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="col-span-12 md:col-span-8 relative">
          <div className="absolute inset-0 bg-gold/15 rounded-sm rotate-1 translate-x-1 translate-y-1" />

          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="paper relative rounded-sm p-8 md:p-12 shadow-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-caveat text-xs text-rose tracking-wider uppercase">
                    Klaim {idx + 1} / {CLAIMS.length}
                  </span>
                  <span className="border border-ink/20 px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-bold tracking-widest text-ink uppercase">{CLAIMS[idx].tag}</span>
                </div>

                <p className="font-caveat text-sm text-rose/60 uppercase tracking-wider mb-3">Developer bilang:</p>

                <h3 className="font-pacifico text-xl md:text-3xl text-deep-rose leading-snug mb-8">&ldquo;{CLAIMS[idx].claim}&rdquo;</h3>

                <p className="font-caveat text-sm text-ink/50 uppercase tracking-wider mb-3">Bener nggak?</p>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={() => pick("bener")}
                    disabled={picked !== null}
                    whileHover={picked === null ? { scale: 1.03, y: -2 } : {}}
                    whileTap={picked === null ? { scale: 0.97 } : {}}
                    className={`py-4 rounded-sm border-2 font-semibold transition flex items-center justify-center gap-2 ${
                      picked === "bener" ? "bg-sage text-cream border-sage" : picked !== null ? "bg-cream border-rose/20 opacity-50" : "bg-cream border-sage/40 hover:border-sage hover:bg-sage/5 text-ink"
                    }`}
                  >
                    <span className="text-2xl">✅</span>
                    <span className="text-sm uppercase tracking-wider">Bener</span>
                  </motion.button>

                  <motion.button
                    onClick={() => pick("salah")}
                    disabled={picked !== null}
                    whileHover={picked === null ? { scale: 1.03, y: -2 } : {}}
                    whileTap={picked === null ? { scale: 0.97 } : {}}
                    className={`py-4 rounded-sm border-2 font-semibold transition flex items-center justify-center gap-2 ${
                      picked === "salah" ? "bg-rose text-cream border-rose" : picked !== null ? "bg-cream border-rose/20 opacity-50" : "bg-cream border-rose/40 hover:border-rose hover:bg-rose/5 text-ink"
                    }`}
                  >
                    <span className="text-2xl">❌</span>
                    <span className="text-sm uppercase tracking-wider">Sok tau</span>
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="paper relative rounded-sm p-10 md:p-14 text-center shadow-xl">
                <motion.p initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }} className="text-6xl mb-4">
                  {bener === CLAIMS.length ? "🏆" : bener >= 5 ? "✨" : bener >= 3 ? "😅" : "💀"}
                </motion.p>

                <p className="font-caveat text-sm text-rose tracking-wider uppercase mb-2">— Hasil Verifikasi —</p>

                <h3 className="font-pacifico text-3xl md:text-4xl text-deep-rose mb-3">
                  {bener} / {CLAIMS.length} klaim bener
                </h3>

                <p className="font-caveat text-xl text-rose mb-8 max-w-md mx-auto leading-relaxed">{verdict}</p>

                <div className="grid grid-cols-2 gap-4 mb-8 max-w-sm mx-auto">
                  <div className="paper p-4 rounded-sm border-2 border-sage/40">
                    <p className="font-caveat text-xs text-ink/50 uppercase tracking-wider mb-1">Developer bener</p>
                    <p className="font-pacifico text-3xl text-sage tabular-nums">{bener}</p>
                  </div>
                  <div className="paper p-4 rounded-sm border-2 border-rose/40">
                    <p className="font-caveat text-xs text-ink/50 uppercase tracking-wider mb-1">Developer sok tau</p>
                    <p className="font-pacifico text-3xl text-rose tabular-nums">{salah}</p>
                  </div>
                </div>

                <p className="font-caveat text-sm text-ink/50 italic mb-6 max-w-md mx-auto">
                  {bener === CLAIMS.length && "artinya semua yang developer tulis di web ini, akurat. dia beneran nyatet hal-hal kecil tentang kamu."}
                  {bener >= 5 && bener < CLAIMS.length && "sebagian besar akurat, sisanya mungkin developer lagi ngasal atau salah inget."}
                  {bener >= 3 && bener < 5 && "banyak yang salah ternyata. mungkin developer perlu lebih sering ngobrol."}
                  {bener < 3 && "developer ternyata cuma sok tau. semua info di web ini patut dipertanyakan 💀"}
                </p>

                <button onClick={restart} className="bg-deep-rose text-cream font-semibold px-7 py-3 rounded-full hover:bg-rose transition shadow-lg text-sm tracking-wider uppercase">
                  Cek lagi 🔄
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </EditorialSection>
  );
}
