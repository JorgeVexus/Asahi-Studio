"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type MouseEvent } from "react";
import { useTranslations } from "next-intl";

const SERVICE_KEYS = ["landing", "ecommerce", "automation", "custom"] as const;
const SERVICE_NUMBERS = ["01", "02", "03", "04"];

type ServiceData = {
  n: string;
  jp: string;
  title: string;
  body: string;
  points: string[];
};

function ServiceCard({ s, idx }: { s: ServiceData; idx: number }) {
  const ref = useRef<HTMLElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20 });
  const tx = useTransform(sry, (v) => v * 0.4);
  const ty = useTransform(srx, (v) => v * -0.4);

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = ref.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rx.set(-py * 8);
    ry.set(px * 8);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: (idx % 2) * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.99 }}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1200 }}
      className="no-tap-highlight group relative bg-background p-8 transition-colors hover:bg-foreground hover:text-background md:p-12"
    >
      <motion.div style={{ x: tx, y: ty }} className="relative">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-xs tracking-widest text-muted-foreground group-hover:text-background/60">
            {s.n}
          </span>
          <span className="font-jp text-2xl text-foreground/30 transition group-hover:text-primary group-hover:scale-125">
            {s.jp}
          </span>
        </div>
        <h3 className="mt-6 font-display text-3xl leading-tight md:text-4xl text-balance">
          {s.title}
        </h3>
        <p className="mt-4 max-w-md text-foreground/70 group-hover:text-background/70">{s.body}</p>
        <ul className="mt-8 flex flex-wrap gap-2">
          {s.points.map((p) => (
            <li
              key={p}
              className="border border-foreground/20 px-3 py-1 font-mono text-[11px] uppercase tracking-wider group-hover:border-background/30"
            >
              {p}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.article>
  );
}

export function Services() {
  const t = useTranslations("services");

  const services: ServiceData[] = SERVICE_KEYS.map((key, i) => ({
    n: SERVICE_NUMBERS[i],
    jp: t(`items.${key}.jp`),
    title: t(`items.${key}.title`),
    body: t(`items.${key}.body`),
    points: t.raw(`items.${key}.points`) as string[],
  }));

  return (
    <section id="services" className="relative border-t border-foreground/15">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <span className="text-primary">●</span> {t("eyebrow")}
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl text-balance">
              {t("titlePre")} <span className="italic text-primary">{t("titleHighlight")}</span>.
            </h2>
          </div>
          <p className="max-w-sm text-foreground/70">{t("description")}</p>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden border border-foreground/15 bg-foreground/15 md:grid-cols-2">
          {services.map((s, i) => (
            <ServiceCard key={s.n} s={s} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
