import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "El equipo de Asahi entendió nuestro negocio en la primera llamada. La landing nueva nos triplicó las cotizaciones calificadas en menos de un mes.",
    name: "Mariana Esquivel",
    role: "Directora de marketing",
    company: "Emika ProCleaning",
    jp: "信",
  },
  {
    quote:
      "Diseño impecable, performance brutal y un proceso clarísimo. Es la primera vez que un sitio se siente como una herramienta de venta real.",
    name: "Daniel Ortega",
    role: "Founder",
    company: "China Sourcing MX",
    jp: "速",
  },
  {
    quote:
      "Tomaron un proyecto complicado y lo entregaron en tiempo récord. Las automatizaciones nos ahorran al menos 15 horas a la semana.",
    name: "Lucía Fernández",
    role: "COO",
    company: "The Beauty & Health",
    jp: "美",
  },
  {
    quote:
      "Cada decisión la justificaron con datos. Nos sentimos acompañados, no vendidos. Volveríamos a trabajar con ellos sin pensarlo.",
    name: "Roberto Gómez",
    role: "Director general",
    company: "Campo Kumeyaay Nation",
    jp: "誠",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="relative border-t border-foreground/15 bg-foreground text-background">
      <div className="pointer-events-none absolute inset-0 grain" />
      <div className="relative mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-background/60">
              <span className="text-primary">●</span> Testimonios · 声
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl text-balance">
              Lo que dicen <span className="italic text-primary">de nosotros</span>.
            </h2>
          </div>
          <p className="max-w-sm text-background/70">
            Negocios reales, métricas reales. Aquí algunos de los equipos con los que hemos colaborado.
          </p>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden border border-background/15 bg-background/15 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: (i % 2) * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col justify-between bg-foreground p-8 transition-colors hover:bg-primary md:p-12"
            >
              <span className="absolute right-8 top-6 font-jp text-5xl text-background/15 transition group-hover:text-background/40">
                {t.jp}
              </span>
              <blockquote className="font-display text-2xl leading-snug md:text-3xl text-balance">
                <span className="text-primary group-hover:text-background">“</span>
                {t.quote}
                <span className="text-primary group-hover:text-background">”</span>
              </blockquote>
              <figcaption className="mt-10 flex items-end justify-between border-t border-background/20 pt-6">
                <div>
                  <p className="font-medium">{t.name}</p>
                  <p className="text-sm text-background/60 group-hover:text-background/80">
                    {t.role} · {t.company}
                  </p>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-background/50 group-hover:text-background/80">
                  0{i + 1}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
