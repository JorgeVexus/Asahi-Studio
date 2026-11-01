"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Magnetic } from "./Magnetic";

const NAV_IDS = ["services", "process", "work", "pricing", "faq", "contact"] as const;

/** Seigaiha (青海波) wave pattern divider. */
function Seigaiha() {
  return (
    <svg
      className="h-10 w-full text-foreground/10"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id="seigaiha" x="0" y="0" width="80" height="40" patternUnits="userSpaceOnUse">
          {[0, 40].map((x) =>
            [28, 20, 12].map((r) => (
              <circle
                key={`${x}-${r}`}
                cx={x + 20}
                cy="40"
                r={r}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            )),
          )}
          {[-20, 20, 60].map((x) =>
            [28, 20, 12].map((r) => (
              <circle
                key={`b-${x}-${r}`}
                cx={x + 20}
                cy="20"
                r={r}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            )),
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#seigaiha)" />
    </svg>
  );
}

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const year = new Date().getFullYear();
  const servicesList = t.raw("servicesList") as string[];

  return (
    <footer
      className="relative border-t border-foreground/15 bg-background"
      aria-label={t("ariaFooter")}
    >
      <Seigaiha />

      <div className="mx-auto max-w-[1400px] px-6 pb-10 pt-14 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <a href="#top" className="flex items-center gap-2.5" aria-label={t("backToTopAria")}>
              <span className="h-3 w-3 rounded-full bg-primary" />
              <span className="font-display text-2xl">Asahi Studio</span>
              <span className="font-jp text-sm text-muted-foreground">朝日</span>
            </a>
            <p className="mt-4 max-w-sm text-sm text-foreground/60">{t("tagline")}</p>
            <address className="mt-6 space-y-1 font-mono text-[11px] uppercase not-italic tracking-widest text-muted-foreground">
              <p>{t("location")}</p>
              <a href="mailto:hola@asahi.studio" className="block transition hover:text-primary">
                {t("email")}
              </a>
            </address>
          </div>

          {/* Nav columns */}
          <nav className="md:col-span-3" aria-label={t("ariaSitemap")}>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {t("navLabel")} · <span className="font-jp">{t("navLabelJp")}</span>
            </p>
            <ul className="mt-4 space-y-2.5">
              {NAV_IDS.map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="group inline-flex items-center gap-2 text-sm text-foreground/70 transition hover:text-foreground"
                  >
                    <span className="h-px w-0 bg-primary transition-all duration-300 group-hover:w-4" />
                    {nav(`links.${id}.label`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {t("servicesLabel")} · <span className="font-jp">{t("servicesLabelJp")}</span>
            </p>
            <ul className="mt-4 space-y-2.5">
              {servicesList.map((s) => (
                <li key={s} className="text-sm text-foreground/70">
                  {s}
                </li>
              ))}
            </ul>
            <Magnetic strength={0.25}>
              <a
                href="#contact"
                className="group mt-6 inline-flex items-center gap-3 border border-foreground bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:bg-primary hover:border-primary"
              >
                {t("cta")}
                <span className="transition group-hover:translate-x-1">→</span>
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Giant wordmark */}
        <div
          className="mt-16 overflow-hidden border-t border-foreground/10 pt-10"
          aria-hidden="true"
        >
          <motion.p
            initial={{ y: "60%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="select-none whitespace-nowrap text-center font-display text-[clamp(4rem,14vw,12rem)] font-semibold leading-[0.85] tracking-tight text-foreground/[0.06]"
          >
            ASAHI<span className="italic text-primary/20">.</span>
          </motion.p>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-foreground/10 pt-6 md:flex-row md:items-center">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            © {year} {t("copyright")}
          </p>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition hover:text-primary"
          >
            {t("backToTop")}
            <span className="inline-block transition group-hover:-translate-y-0.5">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
