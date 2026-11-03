"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function Card() {
  const [clicks, setClicks] = useState(0);

  const burst = () => {
    confetti({
      particleCount: 90,
      spread: 90,
      startVelocity: 45,
      origin: { y: 0.65 },
      colors: ["#FF8FAB", "#FFC1D5", "#F0C979", "#E0C9F0", "#FFF9F3", "#C73E68"],
    });
    setClicks((c) => c + 1);
  };

  useEffect(() => {
    const t = setTimeout(burst, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden py-24">
      <span aria-hidden className="bg-num text-[36vw] md:text-[26vw] -right-8 -top-8 hidden md:block">
        00
      </span>

      <div className="mx-auto max-w-7xl px-6 md:px-16 w-full relative z-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="flex items-end justify-between mb-12 md:mb-16 border-b border-rose/20 pb-4">
          <div>
            <p className="font-playwrite text-sm text-rose tracking-wider">VOL. 01 · SEMPRO EDITION</p>
            <p className="font-playwrite text-xs text-ink/40 mt-1">developed just 4 u</p>
          </div>
          <span className="stamp hidden sm:inline-flex">Opening Act ✿</span>
        </motion.div>

        <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
          {/* === LEFT === */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }} className="col-span-12 md:col-span-7 relative">
            <p className="font-playwrite text-2xl md:text-3xl text-rose mb-3">another congrats, btw ..</p>

            <h1 className="font-pacifico text-deep-rose leading-[0.9] tracking-tight">
              <span className="block text-[clamp(3.5rem,10vw,7rem)]">Selamat,</span>
              <span className="block text-[clamp(4.5rem,14vw,10rem)] ml-0 md:ml-8 italic">Cinn!</span>
            </h1>

            <div className="mt-6 md:mt-8 flex items-center gap-3 md:gap-4 flex-wrap">
              <span className="stamp" style={{ transform: "rotate(-1.8deg)" }}>
                Sempro selesai ✓
              </span>
              <span className="font-playwrite text-lg text-ink/50">Hari ini</span>
            </div>
          </motion.div>

          {/* === RIGHT === */}
          <motion.div initial={{ opacity: 0, y: 80, rotate: -3 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.8 }} className="col-span-12 md:col-span-5 relative mt-16 md:mt-0">
            <div className="absolute inset-0 bg-pink/20 rounded-sm rotate-2 translate-x-2 translate-y-2" />

            <article className="paper relative rounded-sm p-8 md:p-10 shadow-[0_20px_50px_-15px_rgba(199,62,104,0.35)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-gold/50 rounded-sm rotate-[-2deg] shadow-sm" />

              <p className="font-caveat text-base text-rose mb-1">Haii cinn,</p>
              <div className="h-px w-10 bg-rose/40 mb-6" />

              <div className="space-y-4 text-[15px] md:text-base text-ink/85 leading-[1.75]">
                <p>Another congrats buat kelancaran sempro nya. Semoga sisa perjalanan buat gelarnya lancar lancar juga yakk.</p>
                <p>
                  Wkwkwk aku gatau kenapa bikin ginian, tapi <span className="font-semibold text-deep-rose">stop langsung bilangin aku cowo bingung</span>. Tapi kyk keren aja kalo bikin web greeting cards gini. Keinget kamu mau sempro,
                  ujungnya malah cari referensi.
                </p>
                <p>
                  Btw aku gatau apa apa aja yang jadi topik kalo kita contact an, jadi apa yang aku masukin kemari mungkin dah semua yang aku tau wkwkw. Fitur fiturnya juga yaa seadanya. Paling mini games. Tapi semoga kamu suka yang
                  photobooth Yakk.
                </p>
                <p>
                  Aku bikin warna <span className="font-semibold text-deep-rose">pink</span> juga karena aku rasa kamu modelan cewe feminin yang suka warna pink, tapi dikasi bumbu <span className="font-semibold text-deep-rose">matcha</span>{" "}
                  juga. Kalo elemen <span className="font-semibold text-deep-rose">kucing</span>, karena aku inget kamu pengen pelihara kucing tapi ga dibolehin mama kamu wkwkw.
                </p>
                <p>Hal hal yang lain mungkin kamu paham sendiri, karena dah mencakup semua yang muncul selama kita contact an.</p>
                <p>
                  Aku gatau ini lucu atau engga yaa di mata kamu wkwkw. Soalnya di aku, rasanya <span className="italic">&ldquo;kinda weird&rdquo;</span>.
                </p>
                <p>Dahh mungkin itu ajaa, semoga lancar sampe akhir yaa, jaga kesehatan euyy.</p>
                <p>
                  Harap maklum dengan pemilihan kata kata yang kurang sopan wkwkw. <span className="font-semibold text-deep-rose">Enjoyy cinn!!</span>
                </p>
                <p className="font-playwrite text-xl md:text-2xl text-deep-rose italic">you&rsquo;re worthy of congratulations</p>
              </div>

              <div className="mt-10 pt-6 border-t-2 border-dashed border-rose/25 text-right">
                <p className="font-playwrite text-xl text-deep-rose">Until next milestone,</p>
                <p className="font-playwrite text-base text-rose/70 mt-1">Your first web dev LOLL</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={burst}
                className="mt-8 w-full bg-deep-rose text-cream py-3 rounded-full text-xs tracking-[0.2em] uppercase font-semibold hover:bg-rose transition shadow-lg"
              >
                ✦ Pencet lagi
              </motion.button>

              {clicks >= 5 && (
                <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-playwrite text-sm text-rose/70 text-center mt-4">
                  udah cukup ya, ini bukan slot machine 😂
                </motion.p>
              )}
            </article>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="mt-20 md:mt-28 flex items-center justify-between border-t border-rose/20 pt-4">
          <span className="font-playwrite text-xs text-ink/40">— 00 —</span>
          <span className="font-playwrite text-xs text-ink/40">scroll untuk lanjut</span>
        </motion.div>
      </div>
    </section>
  );
}
