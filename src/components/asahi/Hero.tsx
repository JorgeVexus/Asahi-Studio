import { animate, motion, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Magnetic } from "./Magnetic";

function Counter({
  value,
  suffix = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, value, decimals]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/** Animated rising sun: rotating rays + brush-drawn enso ring around the disc. */
function SunSvg() {
  const rays = Array.from({ length: 16 }, (_, i) => (i * 360) / 16);
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible" aria-hidden="true">
      {/* rays */}
      <g className="ray-spin">
        {rays.map((deg) => (
          <line
            key={deg}
            x1="200"
            y1="22"
            x2="200"
            y2="58"
            stroke="var(--sun)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
            transform={`rotate(${deg} 200 200)`}
          />
        ))}
      </g>
      {/* enso brush ring — drawn on load */}
      <motion.circle
        cx="200"
        cy="200"
        r="155"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.25"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 0.92 }}
        transition={{ duration: 2.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ rotate: -90, transformOrigin: "center" }}
      />
      {/* sun disc */}
      <motion.circle
        cx="200"
        cy="200"
        r="120"
        fill="var(--sun)"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "center" }}
        className="sun-pulse"
      />
    </svg>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sunY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const sunScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const sunRot = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32 grain"
    >
      {/* kanji watermark */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1.5 }}
        className="pointer-events-none absolute left-0 top-1/3 hidden select-none font-jp text-[16rem] leading-none text-foreground/[0.04] lg:block"
        aria-hidden="true"
      >
        朝日
      </motion.span>

      <motion.div
        style={{ y: sunY, scale: sunScale, rotate: sunRot }}
        className="pointer-events-none absolute -right-24 top-16 h-[320px] w-[320px] md:right-6 md:top-16 md:h-[540px] md:w-[540px]"
      >
        <SunSvg />
        <div className="absolute inset-[15%] rounded-full bg-primary blur-3xl opacity-30" />
      </motion.div>

      <motion.div
        style={{ y: titleY, opacity }}
        className="relative mx-auto max-w-[1400px] px-6 md:px-10"
      >
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
            <span key={w} className="inline-block overflow-hidden align-top">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="mr-4 inline-block"
              >
                {w}
              </motion.span>
            </span>
          ))}
          <br />
          <span className="inline-block overflow-hidden align-top">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block"
            >
              que <span className="italic text-primary">convierten</span>
              <span className="text-primary">.</span>
            </motion.span>
          </span>
        </h1>

        <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="md:col-span-5 md:col-start-1 text-lg text-foreground/70 text-pretty md:text-xl"
          >
            Diseñamos y desarrollamos sitios rápidos, estratégicos y optimizados para generar
            clientes reales. Webflow, Next.js, automatizaciones e IA — soluciones a medida, nunca
            plantillas.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="md:col-span-4 md:col-start-9 flex flex-col items-start gap-4 self-end"
          >
            <Magnetic>
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 bg-foreground px-6 py-4 text-base font-medium text-background transition hover:bg-primary"
              >
                Cotiza tu proyecto
                <span className="transition group-hover:translate-x-1">→</span>
              </a>
            </Magnetic>
            <a
              href="#work"
              className="text-sm text-foreground/60 underline-offset-4 hover:underline"
            >
              Ver trabajo reciente ↓
            </a>
          </motion.div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden border-y border-foreground/15 bg-foreground/15 md:grid-cols-4">
          {[
            { render: <Counter value={98} />, label: "PageSpeed promedio" },
            {
              render: <Counter value={3.2} decimals={1} suffix="x" />,
              label: "Lift en conversión",
            },
            { render: <Counter value={14} suffix="d" />, label: "Time-to-launch" },
            { render: <>MX</>, label: "Hecho en México" },
          ].map(({ render, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.7 }}
              className="bg-background p-6"
            >
              <div className="font-display text-4xl md:text-5xl">{render}</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {label}
              </div>
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
