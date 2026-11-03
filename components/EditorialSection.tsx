"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

type Align = "left" | "right" | "center";

export default function EditorialSection({
  number,
  sideLabel,
  title,
  meta,
  subtitle,
  children,
  align = "left",
  ambient,
  className = "",
}: {
  number: string;
  sideLabel: string;
  title: ReactNode;
  meta?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  align?: Align;
  ambient?: ReactNode;
  className?: string;
}) {
  const isRight = align === "right";
  const isCenter = align === "center";

  return (
    <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }} className={`relative py-20 md:py-32 overflow-hidden ${className}`}>
      <span aria-hidden className="bg-num text-[28vw] md:text-[22vw] hidden md:block" style={{ top: "-2%", [isRight ? "left" : "right"]: "-2%" }}>
        {number}
      </span>
      <div className="absolute top-0 left-6 right-6 md:left-16 md:right-16 editorial-rule" />
      <div className={`absolute top-32 hidden lg:flex ${isRight ? "right-4 md:right-8" : "left-4 md:left-8"}`}>
        <span className="vertical-label">{sideLabel}</span>
      </div>
      {ambient}
      <div className="mx-auto max-w-7xl px-6 md:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className={`grid grid-cols-12 gap-4 md:gap-8 items-end pb-6 mb-10 md:mb-16 border-b border-rose/20 ${isCenter ? "text-center" : ""}`}
        >
          <div className={`col-span-3 md:col-span-2 ${isCenter ? "md:col-start-5 text-center" : ""}`}>
            <span className="chapter-num">{number}</span>
          </div>
          <div className={`col-span-9 md:col-span-7 ${isCenter ? "md:col-span-4 md:text-center" : ""} ${isRight ? "md:order-3 md:text-right" : ""}`}>
            <h2 className="font-pacifico text-3xl md:text-5xl text-deep-rose leading-[1.1]">{title}</h2>
            {subtitle && <p className="font-caveat text-lg md:text-xl text-rose mt-3 max-w-xl">{subtitle}</p>}
          </div>
          {meta && <div className={`col-span-12 md:col-span-3 md:text-right ${isRight ? "md:order-1 md:text-left" : ""} ${isCenter ? "hidden" : ""}`}>{meta}</div>}
        </motion.div>
        <div>{children}</div>
      </div>
    </motion.section>
  );
}
