import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const steps = [
  { n: "01", jp: "発見", title: "Discovery", body: "Entrevista, análisis de competencia y definición de objetivo de conversión." },
  { n: "02", jp: "戦略", title: "Estrategia", body: "Wireframe, arquitectura de mensaje y copy enfocado en el cliente ideal." },
  { n: "03", jp: "設計", title: "Diseño", body: "Identidad visual, sistema de componentes y prototipo interactivo móvil-first." },
  { n: "04", jp: "開発", title: "Desarrollo", body: "Build en Webflow o Next.js. SEO, performance y accesibilidad desde día uno." },
  { n: "05", jp: "起動", title: "Launch & CRO", body: "Analítica, A/B tests y optimización continua. Tu sitio mejora cada mes." },
];

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineH = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  return (
    <section id="process" className="relative bg-foreground text-background">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-background/50">
            <span className="text-primary">●</span> Proceso · 工程
          </p>
          <h2 className="mt-4 font-display text-5xl font-semibold leading-[0.95] md:text-7xl text-balance">
            Del brief al <span className="italic text-primary">lanzamiento</span> en 14–30 días.
          </h2>
        </div>

        <div ref={ref} className="relative mt-16 border-y border-background/15">
          {/* Animated progress line */}
          <div className="pointer-events-none absolute left-[8%] top-0 h-full w-px bg-background/10 md:left-[12%]">
            <motion.div style={{ height: lineH }} className="w-px bg-primary" />
          </div>

          <ol className="divide-y divide-background/15">
            {steps.map((s, i) => (
              <motion.li
                key={s.n}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
                className="group grid grid-cols-12 items-baseline gap-4 py-8 transition-colors hover:bg-background/5 md:py-10"
              >
                <span className="col-span-2 font-mono text-sm text-background/50 transition group-hover:text-primary md:col-span-1">{s.n}</span>
                <span className="col-span-10 font-jp text-xl text-primary md:col-span-1">{s.jp}</span>
                <h3 className="col-span-12 font-display text-3xl transition group-hover:translate-x-2 md:col-span-4 md:text-4xl">{s.title}</h3>
                <p className="col-span-12 text-background/70 md:col-span-6">{s.body}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
