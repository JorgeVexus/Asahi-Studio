import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FAQS } from "./faq-data";

function FaqItem({
  q,
  a,
  n,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  n: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="border-b border-foreground/15"
    >
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="no-tap-highlight group flex w-full items-baseline gap-4 py-6 text-left md:gap-8 md:py-8"
        data-cursor="hover"
      >
        <span className="font-mono text-xs text-muted-foreground transition group-hover:text-primary">
          {n}
        </span>
        <span
          className={`flex-1 font-display text-xl leading-snug transition-colors md:text-3xl ${open ? "italic text-primary" : "group-hover:text-primary"}`}
        >
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`shrink-0 text-2xl leading-none md:text-3xl ${open ? "text-primary" : "text-foreground/40"}`}
          aria-hidden
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-8 pl-8 pr-4 text-foreground/70 md:pl-16 md:text-lg">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-label="Preguntas frecuentes"
      className="relative border-t border-foreground/15 bg-background"
    >
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-28">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <span className="text-primary">●</span> FAQ · 質問
              </p>
              <h2 className="mt-4 font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-6xl text-balance">
                Preguntas <span className="italic text-primary">frecuentes</span>.
              </h2>
              <p className="mt-6 max-w-sm text-foreground/70">
                Lo que todo mundo nos pregunta antes de empezar. ¿Falta la tuya? Escríbenos y
                respondemos en menos de 24 horas.
              </p>
              <a
                href="#contact"
                className="group mt-8 hidden items-center gap-3 border border-foreground bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:bg-primary hover:border-primary md:inline-flex"
              >
                Hacer otra pregunta
                <span className="transition group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="border-t border-foreground/15">
              {FAQS.map((f, i) => (
                <FaqItem
                  key={f.q}
                  q={f.q}
                  a={f.a}
                  n={`0${i + 1}`.slice(-2)}
                  open={open === i}
                  onToggle={() => setOpen(open === i ? null : i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
