"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";

function Word({
  word,
  progress,
  range,
  italic,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  italic: boolean;
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={`mr-[0.25em] inline-block ${italic ? "italic text-primary" : ""}`}
    >
      {word}
    </motion.span>
  );
}

export function Manifesto() {
  const t = useTranslations("manifesto");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.4"] });

  const text = t("text");
  const words = text.split(" ");
  const italicWords = t.raw("italicWords") as string[];

  return (
    <section ref={ref} className="relative border-t border-foreground/15 bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-40">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <span className="text-primary">●</span> {t("eyebrow")}
        </p>
        <p className="mt-8 max-w-5xl font-display text-4xl leading-[1.05] tracking-tight md:text-7xl text-balance">
          {words.map((w, i) => {
            const start = i / words.length;
            const end = start + 1.5 / words.length;
            return (
              <Word
                key={i}
                word={w}
                progress={scrollYProgress}
                range={[start, Math.min(end, 1)]}
                italic={italicWords.includes(w)}
              />
            );
          })}
        </p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 max-w-xl text-foreground/60"
        >
          {t("body")}
        </motion.p>
      </div>
    </section>
  );
}
