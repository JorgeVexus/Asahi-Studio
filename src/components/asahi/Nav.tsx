"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const LINK_IDS = ["services", "process", "work", "pricing", "faq", "contact"] as const;

function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const sections = LINK_IDS.map((id) => document.getElementById(id)).filter(
      Boolean,
    ) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);
  return active;
}

export function Nav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const active = useActiveSection();

  const links = LINK_IDS.map((id) => ({
    id,
    href: `#${id}`,
    label: t(`links.${id}.label`),
    jp: t(`links.${id}.jp`),
  }));

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    // Hide when scrolling down past the hero, reveal on any scroll up
    setHidden(y > prev && y > 400 && !open);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const switchLocale = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-[70] border-b border-foreground/10 bg-background/70 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
          <a
            href="#top"
            className="no-tap-highlight flex items-center gap-2.5"
            aria-label={t("ariaHome")}
          >
            <span className="relative inline-block h-3.5 w-3.5 rounded-full bg-primary" />
            <span className="font-display text-xl tracking-tight">
              Asahi<span className="italic text-primary">.</span>
            </span>
            <span className="font-jp text-xs text-muted-foreground hidden sm:inline">朝日</span>
          </a>

          <nav className="hidden items-center gap-7 md:flex" aria-label={t("ariaMain")}>
            {links.map(({ label, href, id }) => (
              <a
                key={href}
                href={href}
                className={`group relative text-sm transition ${
                  active === id ? "text-foreground" : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${
                    active === id ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div
              className="hidden items-center gap-1 font-mono text-xs uppercase tracking-widest text-foreground/60 sm:flex"
              role="group"
              aria-label={t("language")}
            >
              <button
                onClick={() => switchLocale("es")}
                className={`px-1.5 py-0.5 transition ${locale === "es" ? "text-primary" : "hover:text-foreground"}`}
                aria-pressed={locale === "es"}
              >
                {t("langEs")}
              </button>
              <span className="text-foreground/30">/</span>
              <button
                onClick={() => switchLocale("en")}
                className={`px-1.5 py-0.5 transition ${locale === "en" ? "text-primary" : "hover:text-foreground"}`}
                aria-pressed={locale === "en"}
              >
                {t("langEn")}
              </button>
            </div>

            <a
              href="#contact"
              className="group hidden items-center gap-2 border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:bg-primary hover:border-primary sm:inline-flex"
            >
              {t("ctaDesktop")}
              <span className="transition group-hover:translate-x-0.5">→</span>
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(true)}
              aria-label={t("openMenu")}
              aria-expanded={open}
              className="no-tap-highlight flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            >
              <span className="block h-px w-6 bg-foreground" />
              <span className="block h-px w-6 bg-foreground" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Fullscreen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 3rem) 2rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 3rem) 2rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 3rem) 2rem)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[75] flex flex-col bg-foreground text-background md:hidden"
          >
            <div className="pointer-events-none absolute inset-0 grain" />
            {/* Decorative sun */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary opacity-90"
            />

            {/* Overlay top bar: brand + close */}
            <div className="relative flex items-center justify-between px-6 py-4">
              <span className="flex items-center gap-2.5">
                <span className="inline-block h-3.5 w-3.5 rounded-full bg-primary" />
                <span className="font-display text-xl tracking-tight">
                  Asahi<span className="italic text-primary">.</span>
                </span>
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label={t("closeMenu")}
                className="no-tap-highlight relative flex h-10 w-10 items-center justify-center"
              >
                <span className="absolute block h-px w-6 rotate-45 bg-background" />
                <span className="absolute block h-px w-6 -rotate-45 bg-background" />
              </button>
            </div>

            <div className="relative flex flex-1 flex-col justify-center px-8">
              <div className="flex items-center gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-background/50">
                  {t("menuLabel")} · <span className="font-jp">{t("menuLabelJp")}</span>
                </p>
                <div className="ml-auto flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-background/60">
                  <button
                    onClick={() => switchLocale("es")}
                    className={`px-1.5 py-0.5 transition ${locale === "es" ? "text-primary" : "hover:text-background"}`}
                  >
                    {t("langEs")}
                  </button>
                  <span className="text-background/30">/</span>
                  <button
                    onClick={() => switchLocale("en")}
                    className={`px-1.5 py-0.5 transition ${locale === "en" ? "text-primary" : "hover:text-background"}`}
                  >
                    {t("langEn")}
                  </button>
                </div>
              </div>
              <nav className="mt-6 flex flex-col" aria-label={t("ariaMobile")}>
                {links.map(({ label, jp, href }, i) => (
                  <motion.a
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="no-tap-highlight group flex items-baseline justify-between border-b border-background/15 py-4"
                  >
                    <span className="font-display text-4xl leading-none transition group-active:italic group-active:text-primary">
                      {label}
                    </span>
                    <span className="font-jp text-sm text-primary">{jp}</span>
                  </motion.a>
                ))}
              </nav>

              <motion.a
                href="#contact"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="group mt-10 inline-flex items-center justify-between bg-primary px-6 py-4 text-base font-medium text-primary-foreground"
              >
                {t("ctaMobile")}
                <span className="transition group-hover:translate-x-1">→</span>
              </motion.a>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative flex items-center justify-between px-8 pb-8 font-mono text-[10px] uppercase tracking-[0.25em] text-background/50"
            >
              <a href="mailto:hola@asahi.studio" className="hover:text-primary">
                {t("email")}
              </a>
              <span className="font-jp">{t("brandJp")}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
