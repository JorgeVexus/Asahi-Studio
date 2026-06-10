import { motion } from "framer-motion";
import { Magnetic } from "./Magnetic";

const NAV = [
  ["Servicios", "#services"],
  ["Proceso", "#process"],
  ["Trabajo", "#work"],
  ["Precios", "#pricing"],
  ["FAQ", "#faq"],
  ["Contacto", "#contact"],
];

const SERVICES = [
  "Landing pages de alta conversión",
  "E-commerce & websites",
  "Automatizaciones & IA",
  "Soluciones a medida",
];

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
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative border-t border-foreground/15 bg-background"
      aria-label="Pie de página"
    >
      <Seigaiha />

      <div className="mx-auto max-w-[1400px] px-6 pb-10 pt-14 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <a href="#top" className="flex items-center gap-2.5" aria-label="Volver arriba">
              <span className="h-3 w-3 rounded-full bg-primary" />
              <span className="font-display text-2xl">Asahi Studio</span>
              <span className="font-jp text-sm text-muted-foreground">朝日</span>
            </a>
            <p className="mt-4 max-w-sm text-sm text-foreground/60">
              Estudio de diseño y desarrollo web en México. Landing pages, e-commerce y
              automatizaciones con IA que convierten visitas en clientes.
            </p>
            <address className="mt-6 space-y-1 font-mono text-[11px] uppercase not-italic tracking-widest text-muted-foreground">
              <p>CDMX · Guadalajara · Remoto</p>
              <a href="mailto:hola@asahi.studio" className="block transition hover:text-primary">
                hola@asahi.studio
              </a>
            </address>
          </div>

          {/* Nav columns */}
          <nav className="md:col-span-3" aria-label="Mapa del sitio">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Navegación · <span className="font-jp">目次</span>
            </p>
            <ul className="mt-4 space-y-2.5">
              {NAV.map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="group inline-flex items-center gap-2 text-sm text-foreground/70 transition hover:text-foreground"
                  >
                    <span className="h-px w-0 bg-primary transition-all duration-300 group-hover:w-4" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Servicios · <span className="font-jp">提供</span>
            </p>
            <ul className="mt-4 space-y-2.5">
              {SERVICES.map((s) => (
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
                Cotiza tu proyecto
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
            © {year} Asahi Studio — Diseño + Código + IA · Made in México
          </p>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition hover:text-primary"
          >
            Volver arriba
            <span className="inline-block transition group-hover:-translate-y-0.5">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
