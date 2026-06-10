import { motion } from "framer-motion";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-foreground/15 bg-foreground text-background"
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1], rotate: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -bottom-60 -left-40 h-[700px] w-[700px] rounded-full bg-primary opacity-90 blur-sm"
      />
      <div className="pointer-events-none absolute inset-0 grain" />
      <div className="relative mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-background/60">
          <span className="text-primary">●</span> Contacto · 連絡
        </p>
        <h2 className="mt-6 max-w-4xl font-display text-6xl font-semibold leading-[0.9] tracking-tight md:text-[9rem] text-balance">
          Hagamos algo
          <br />
          <span className="italic">memorable</span>.
        </h2>

        <div className="mt-20 grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5 space-y-8">
            <div className="space-y-4">
              <a
                href="mailto:hola@asahi.studio"
                className="group flex items-center justify-between border-b border-background/30 pb-3 text-xl transition hover:border-primary md:text-2xl"
              >
                hola@asahi.studio
                <span className="transition group-hover:translate-x-1 group-hover:text-primary">
                  →
                </span>
              </a>
              <a
                href="https://wa.me/52"
                className="group flex items-center justify-between border-b border-background/30 pb-3 text-xl transition hover:border-primary md:text-2xl"
              >
                WhatsApp directo
                <span className="transition group-hover:translate-x-1 group-hover:text-primary">
                  →
                </span>
              </a>
            </div>
            <div className="space-y-2 text-background/70">
              <p className="font-mono text-xs uppercase tracking-widest">
                CDMX · Guadalajara · Remoto
              </p>
              <p className="text-sm">Respondemos en menos de 24 horas hábiles.</p>
              <p className="font-jp text-sm text-primary pt-4">朝日スタジオ — 2026</p>
            </div>
          </div>

          <div className="md:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
