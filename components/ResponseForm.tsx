"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { unlock } from "@/lib/achievements";

// ⚠️ GANTI dengan nomor WA lo (format: 62xxx, tanpa + atau 0 depan)
const OWNER_PHONE = "6282213275683";

export default function ResponseForm() {
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = msg.trim();
    if (clean.length < 3) {
      setError("minimal 3 huruf ya 😅");
      return;
    }
    setError("");

    const body = `Response from : Chintia\n\n"${clean}"\n\n— dikirim dari e-card Sempro`;
    const url = `https://wa.me/${OWNER_PHONE}?text=${encodeURIComponent(body)}`;

    window.open(url, "_blank");
    unlock("share");
    setSent(true);
  };

  const reset = () => {
    setMsg("");
    setSent(false);
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.form
            key="form"
            onSubmit={send}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="paper rounded-3xl p-6 shadow-xl border-2 border-rose/30"
          >
            <p className="font-caveat text-2xl text-deep-rose mb-1 text-center">ada pesan buat dev?</p>
            <p className="font-caveat text-base text-rose/70 mb-4 text-center">tulis apa aja, langsung direct ke WhatsApp</p>

            <textarea
              value={msg}
              onChange={(e) => {
                setMsg(e.target.value);
                if (error) setError("");
              }}
              placeholder="tengs yak / y ok / y / dll"
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 rounded-2xl border-2 border-rose/30 bg-cream text-ink text-sm resize-none outline-none focus:border-deep-rose transition"
            />

            <div className="flex items-center justify-between mt-2 mb-4">
              <span className="font-caveat text-xs text-ink/40">{msg.length}/500</span>
              {error && (
                <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="font-caveat text-xs text-rose">
                  {error}
                </motion.span>
              )}
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:brightness-110 transition"
            >
              Send to dev
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            key="thanks"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 18 }}
            className="paper rounded-3xl p-8 shadow-xl border-2 border-sage/40 text-center"
          >
            <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }} className="text-5xl mb-4">
              ✉️
            </motion.p>
            <p className="font-pacifico text-2xl text-deep-rose mb-2">Udah dikirim!</p>
            <p className="font-caveat text-lg text-rose mb-6">cek WhatsApp lo ya, kalau belum kebuka berarti harus di-klik manual</p>
            <button onClick={reset} className="font-caveat text-sm text-ink/50 underline underline-offset-4 hover:text-rose transition">
              kirim pesan lain
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}