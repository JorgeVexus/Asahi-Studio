import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type MouseEvent } from "react";

const services = [
  { n: "01", jp: "着陸", title: "Landing pages de alta conversión", body: "Diseño enfocado en ventas, copy estratégico y CRO. Cada sección justifica su existencia.", points: ["Wireframe estratégico", "Copy persuasivo", "A/B testing ready"] },
  { n: "02", jp: "商店", title: "E-commerce & Websites completos", body: "Tiendas en Shopify y sitios multi-página en Next.js. Performance, SEO y experiencia móvil impecable.", points: ["Shopify / Next.js", "Catálogo escalable", "Checkout optimizado"] },
  { n: "03", jp: "自動化", title: "Automatizaciones & integración IA", body: "Tu sitio conectado a CRM, WhatsApp, email y agentes IA. Captura, califica y responde en automático.", points: ["n8n / Make / Zapier", "Agentes con OpenAI", "CRM + WhatsApp API"] },
  { n: "04", jp: "特注", title: "Soluciones a medida", body: "Cero plantillas genéricas. Cada proyecto se diseña alrededor de tu negocio, tu cliente y tu objetivo.", points: ["Branding digital", "Dashboards internos", "Consultoría continua"] },
];

function ServiceCard({ s, idx }: { s: typeof services[number]; idx: number }) {
  const ref = useRef<HTMLElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20 });
  const tx = useTransform(sry, (v) => v * 0.4);
  const ty = useTransform(srx, (v) => v * -0.4);

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = ref.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rx.set(-py * 8);
    ry.set(px * 8);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: (idx % 2) * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1200 }}
      className="group relative bg-background p-8 transition-colors hover:bg-foreground hover:text-background md:p-12"
    >
      <motion.div style={{ x: tx, y: ty }} className="relative">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-xs tracking-widest text-muted-foreground group-hover:text-background/60">{s.n}</span>
          <span className="font-jp text-2xl text-foreground/30 transition group-hover:text-primary group-hover:scale-125">{s.jp}</span>
        </div>
        <h3 className="mt-6 font-display text-3xl leading-tight md:text-4xl text-balance">{s.title}</h3>
        <p className="mt-4 max-w-md text-foreground/70 group-hover:text-background/70">{s.body}</p>
        <ul className="mt-8 flex flex-wrap gap-2">
          {s.points.map((p) => (
            <li key={p} className="border border-foreground/20 px-3 py-1 font-mono text-[11px] uppercase tracking-wider group-hover:border-background/30">
              {p}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.article>
  );
}

export function Services() {
  return (
    <section id="services" className="relative border-t border-foreground/15">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <span className="text-primary">●</span> Servicios · 提供
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl text-balance">
              Lo que <span className="italic text-primary">hacemos</span>.
            </h2>
          </div>
          <p className="max-w-sm text-foreground/70">
            Cuatro disciplinas. Una obsesión: que tu sitio sea la mejor herramienta de venta de tu negocio.
          </p>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden border border-foreground/15 bg-foreground/15 md:grid-cols-2">
          {services.map((s, i) => <ServiceCard key={s.n} s={s} idx={i} />)}
        </div>
      </div>
    </section>
  );
}
