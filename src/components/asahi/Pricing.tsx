"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

const PLAN_KEYS = ["express", "growth", "pro"] as const;
const FEATURED: Record<(typeof PLAN_KEYS)[number], boolean> = {
  express: false,
  growth: true,
  pro: false,
};

export function Pricing() {
  const t = useTranslations("pricing");

  const plans = PLAN_KEYS.map((key) => ({
    key,
    tag: t(`plans.${key}.tag`),
    jp: t(`plans.${key}.jp`),
    name: t(`plans.${key}.name`),
    desc: t(`plans.${key}.desc`),
    price: t(`plans.${key}.price`),
    cta: t(`plans.${key}.cta`),
    featured: FEATURED[key],
    features: t.raw(`plans.${key}.features`) as string[],
  }));

  return (
    <section id="pricing" className="relative border-t border-foreground/15">
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

        <div className="mt-16 grid gap-px overflow-hidden border border-foreground/15 bg-foreground/15 md:grid-cols-3">
          {plans.map((p, i) => (
            <motion.article
              key={p.key}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`relative flex flex-col p-8 md:p-10 ${
                p.featured ? "bg-foreground text-background" : "bg-background"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.25em] ${
                    p.featured ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {p.tag}
                </span>
                <span
                  className={`font-jp text-2xl ${
                    p.featured ? "text-primary" : "text-foreground/30"
                  }`}
                >
                  {p.jp}
                </span>
              </div>

              <h3 className="mt-6 font-display text-3xl leading-tight md:text-4xl">{p.name}</h3>
              <p
                className={`mt-3 text-sm ${p.featured ? "text-background/70" : "text-foreground/70"}`}
              >
                {p.desc}
              </p>

              <div className="mt-8 flex items-baseline gap-2">
                <span className="font-display text-5xl tracking-tight md:text-6xl">{p.price}</span>
                <span
                  className={`font-mono text-xs ${p.featured ? "text-background/60" : "text-muted-foreground"}`}
                >
                  {t("currency")}
                </span>
              </div>

              <ul className="mt-8 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${p.featured ? "text-primary" : "text-primary"}`}
                    />
                    <span className={p.featured ? "text-background/85" : "text-foreground/80"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`group mt-10 inline-flex items-center justify-between border px-5 py-3 text-sm font-medium transition ${
                  p.featured
                    ? "border-primary bg-primary text-primary-foreground hover:bg-background hover:text-foreground hover:border-background"
                    : "border-foreground bg-foreground text-background hover:bg-primary hover:border-primary"
                }`}
              >
                {p.cta}
                <span className="transition group-hover:translate-x-1">→</span>
              </a>
            </motion.article>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-sm text-muted-foreground">{t("footnote")}</p>
      </div>
    </section>
  );
}
