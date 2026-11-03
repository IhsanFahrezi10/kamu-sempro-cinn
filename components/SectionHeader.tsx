"use client";
import { motion } from "framer-motion";

export default function SectionHeader({ icon, eyebrow, title, subtitle }: { icon: string; eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-10 md:mb-14">
      <motion.div
        initial={{ opacity: 0, scale: 0.6, y: -10 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="inline-block text-5xl md:text-6xl mb-3 select-none"
      >
        {icon}
      </motion.div>
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="font-caveat text-2xl text-rose mb-2">
        {eyebrow}
      </motion.p>
      <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="font-pacifico text-4xl md:text-5xl text-deep-rose">
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="font-caveat text-lg text-rose/80 mt-3 max-w-md mx-auto">
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
