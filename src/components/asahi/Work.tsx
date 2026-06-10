import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import campo from "@/assets/work-campo.webp";
import emika from "@/assets/work-emika.webp";
import beauty from "@/assets/work-beautyhealth.webp";
import china from "@/assets/work-chinasourcing.webp";

const projects = [
  {
    n: "01",
    title: "Campo Kumeyaay Nation",
    tag: "Institucional · Webflow",
    metric: "Sitio gubernamental",
    url: "https://campo-nsn.gov/",
    image: campo,
    hue: "oklch(0.55 0.14 140)",
  },
  {
    n: "02",
    title: "Emika ProCleaning",
    tag: "Servicios · Landing",
    metric: "+25 años de trayectoria",
    url: "https://www.emika-procleaning.com/",
    image: emika,
    hue: "oklch(0.6 0.18 250)",
  },
  {
    n: "03",
    title: "The Beauty & Health",
    tag: "E-commerce · MX",
    metric: "Marca premium wellness",
    url: "https://thebeautyhealth.mx/",
    image: beauty,
    hue: "oklch(0.7 0.14 60)",
  },
  {
    n: "04",
    title: "China Sourcing",
    tag: "Importación · Webflow",
    metric: "Lead-gen B2B",
    url: "https://china-sourcing.webflow.io/",
    image: china,
    hue: "oklch(0.62 0.235 27)",
  },
];

export function Work() {
  const [active, setActive] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 250, damping: 28, mass: 0.4 });
  const y = useSpring(my, { stiffness: 250, damping: 28, mass: 0.4 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  return (
    <section
      id="work"
      className="relative border-t border-foreground/15 bg-foreground text-background"
    >
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-background/60">
              <span className="text-primary">●</span> Trabajo destacado · 仕事
            </p>
            <h2 className="mt-4 font-display text-5xl font-semibold leading-[0.95] md:text-7xl text-balance">
              Resultados <span className="italic text-primary">reales</span>.
            </h2>
          </div>
          <p className="hidden max-w-xs font-mono text-xs uppercase tracking-widest text-background/50 md:block">
            Pasa el cursor / toca →<br />
            Ver vista previa en vivo
          </p>
        </div>

        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setActive(null)}
          className="relative mt-16"
          data-cursor="hover"
        >
          {/* floating preview */}
          <AnimatePresence>
            {active !== null && (
              <motion.div
                key={active}
                style={{ x, y, translateX: "-50%", translateY: "-50%" }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none absolute z-30 hidden aspect-[16/10] w-[42vw] max-w-[640px] overflow-hidden border border-background/20 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] md:block"
              >
                <img
                  src={projects[active].image}
                  alt={`Captura del sitio web de ${projects[active].title}, proyecto de Asahi Studio`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-top"
                />
                <div
                  className="absolute inset-0 mix-blend-overlay opacity-30"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${projects[active].hue}, transparent 70%)`,
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-foreground/85 px-5 py-3 backdrop-blur">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-background/70">
                    {projects[active].tag}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-primary">
                    Visitar ↗
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* index list */}
          <ul className="relative z-10 border-t border-background/15">
            {projects.map((p, i) => (
              <li key={p.url} className="border-b border-background/15">
                <motion.a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
                  className="no-tap-highlight group relative block py-6 md:flex md:items-center md:justify-between md:gap-6 md:py-10"
                  data-cursor="hover"
                >
                  {/* hover fill */}
                  <motion.span
                    aria-hidden
                    initial={false}
                    animate={{ scaleY: active === i ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{ originY: 1, background: p.hue }}
                    className="absolute inset-x-0 bottom-0 top-0 -z-10 opacity-15"
                  />

                  {/* mobile full-width preview card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="relative mb-5 aspect-[16/10] w-full overflow-hidden border border-background/15 md:hidden"
                  >
                    <img
                      src={p.image}
                      alt={`Captura del sitio web de ${p.title}, proyecto de Asahi Studio`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top"
                    />
                    <div
                      className="absolute inset-0 mix-blend-overlay opacity-30"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${p.hue}, transparent 70%)`,
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-foreground/85 px-4 py-2.5 backdrop-blur">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-background/70">
                        {p.tag}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
                        Visitar ↗
                      </span>
                    </div>
                  </motion.div>

                  <div className="flex min-w-0 items-baseline gap-6 md:gap-10">
                    <span className="font-mono text-xs text-background/40">{p.n}</span>
                    <h3
                      className={`font-display text-3xl leading-[0.95] transition-all duration-500 md:text-6xl lg:text-7xl ${
                        active === i ? "italic text-primary" : "text-background"
                      }`}
                    >
                      {p.title}
                    </h3>
                  </div>

                  <div className="mt-3 flex shrink-0 items-center justify-between gap-4 pl-9 md:mt-0 md:justify-start md:gap-8 md:pl-0">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-background/50">
                      {p.metric}
                    </span>
                    <motion.span
                      animate={{ x: active === i ? 6 : 0, rotate: active === i ? 0 : -45 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className={`text-2xl md:text-3xl ${active === i ? "text-primary" : "text-background/40"}`}
                    >
                      →
                    </motion.span>
                  </div>
                </motion.a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
