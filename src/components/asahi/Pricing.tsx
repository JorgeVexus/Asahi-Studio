import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    tag: "Lanzamientos rápidos",
    jp: "速",
    name: "Landing Express",
    desc: "Para campañas puntuales o un lanzamiento que no puede esperar.",
    price: "$120 – 200",
    currency: "USD",
    cta: "Empezar con Landing Express",
    featured: false,
    features: [
      "1 landing page profesional enfocada en una oferta",
      "Diseño estratégico personalizado (sin plantillas)",
      "Desarrollo en Webflow o Next.js",
      "Optimización de velocidad y mobile-first",
      "SEO técnico base (metadatos, estructura)",
      "Formularios conectados a email o CRM",
      "Integración con Google Analytics",
      "1 ronda de revisiones",
      "Entrega en 3–5 días hábiles",
    ],
  },
  {
    tag: "Más popular",
    jp: "成",
    name: "Growth",
    desc: "Para negocios que ya invierten en ads y necesitan exprimir resultados.",
    price: "$300 – 500",
    currency: "USD",
    cta: "Empezar con Growth",
    featured: true,
    features: [
      "Todo lo del paquete Landing Express",
      "Secciones de casos de éxito, FAQs y objeciones",
      "Test A/B sencillo por bloques",
      "Integración con email marketing y flujos de bienvenida",
      "Reporte inicial de performance tras el lanzamiento",
      "2 rondas de revisiones",
    ],
  },
  {
    tag: "Productos digitales",
    jp: "創",
    name: "Pro · SaaS & Apps",
    desc: "Membresías, dashboards y proyectos complejos que necesitan ingeniería seria.",
    price: "$500 – 1,000+",
    currency: "USD",
    cta: "Empezar con Pro",
    featured: false,
    features: [
      "Landing + vista interna clave (dashboard, onboarding)",
      "Desarrollo en Next.js con APIs y bases de datos",
      "Integraciones (membresías, pagos, IA)",
      "Automatizaciones avanzadas y CRM",
      "Optimización profunda (performance, seguridad, Lighthouse)",
      "2–3 rondas de revisiones y acompañamiento al lanzamiento",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative border-t border-foreground/15">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <span className="text-primary">●</span> Paquetes · 料金
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl text-balance">
              Precios <span className="italic text-primary">claros</span>.
            </h2>
          </div>
          <p className="max-w-sm text-foreground/70">
            Tres puntos de partida. Cada propuesta se ajusta al alcance real de tu proyecto.
          </p>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden border border-foreground/15 bg-foreground/15 md:grid-cols-3">
          {plans.map((p, i) => (
            <motion.article
              key={p.name}
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
              <p className={`mt-3 text-sm ${p.featured ? "text-background/70" : "text-foreground/70"}`}>
                {p.desc}
              </p>

              <div className="mt-8 flex items-baseline gap-2">
                <span className="font-display text-5xl tracking-tight md:text-6xl">{p.price}</span>
                <span className={`font-mono text-xs ${p.featured ? "text-background/60" : "text-muted-foreground"}`}>
                  {p.currency}
                </span>
              </div>

              <ul className="mt-8 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <Check className={`mt-0.5 h-4 w-4 shrink-0 ${p.featured ? "text-primary" : "text-primary"}`} />
                    <span className={p.featured ? "text-background/85" : "text-foreground/80"}>{f}</span>
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

        <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
          ¿No estás seguro qué paquete necesitas? Escríbenos y te recomendamos el alcance ideal sin compromiso.
        </p>
      </div>
    </section>
  );
}
