import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sunY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const sunScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const sunRot = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32 grain">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ y: sunY, scale: sunScale, rotate: sunRot }}
        className="pointer-events-none absolute -right-20 top-20 md:right-10 md:top-24"
      >
        <div className="sun-pulse h-[280px] w-[280px] rounded-full bg-primary md:h-[460px] md:w-[460px]" />
        <div className="absolute inset-0 rounded-full bg-primary blur-3xl opacity-40" />
      </motion.div>

      <motion.div style={{ y: titleY, opacity }} className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground"
        >
          <span className="font-jp text-foreground/80">朝日スタジオ</span> · Estudio digital · MX
        </motion.p>

        <h1 className="mt-6 font-display text-[clamp(3rem,10vw,9rem)] font-semibold leading-[0.9] tracking-tight text-balance">
          {["Landing", "pages"].map((w, i) => (
            <motion.span
              key={w}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="mr-4 inline-block"
            >
              {w}
            </motion.span>
          ))}
          <br />
          <motion.span
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block"
          >
            que <span className="italic text-primary">convierten</span>
            <span className="text-primary">.</span>
          </motion.span>
        </h1>

        <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="md:col-span-5 md:col-start-1 text-lg text-foreground/70 text-pretty md:text-xl"
          >
            Diseñamos y desarrollamos sitios rápidos, estratégicos y optimizados para generar clientes reales. Webflow, Next.js, automatizaciones e IA — soluciones a medida, nunca plantillas.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="md:col-span-4 md:col-start-9 flex flex-col items-start gap-4 self-end"
          >
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 bg-foreground px-6 py-4 text-base font-medium text-background transition hover:bg-primary"
            >
              Cotiza tu proyecto
              <span className="transition group-hover:translate-x-1">→</span>
            </a>
            <a href="#work" className="text-sm text-foreground/60 underline-offset-4 hover:underline">
              Ver trabajo reciente ↓
            </a>
          </motion.div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden border-y border-foreground/15 bg-foreground/15 md:grid-cols-4">
          {[
            ["98", "PageSpeed promedio"],
            ["3.2x", "Lift en conversión"],
            ["14d", "Time-to-launch"],
            ["MX", "Hecho en México"],
          ].map(([n, l], i) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.7 }}
              className="bg-background p-6"
            >
              <div className="font-display text-4xl md:text-5xl">{n}</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{l}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground/40"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-px bg-foreground/30"
        />
      </motion.div>
    </section>
  );
}
