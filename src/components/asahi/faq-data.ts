// Single source of truth for FAQs: rendered in the Faq section, used by the
// ChatWidget, and mirrored as FAQPage JSON-LD in index.html (keep in sync).
export type Faq = {
  q: string;
  keywords: string[];
  a: string;
};

export const FAQS: Faq[] = [
  {
    q: "¿Cuánto cuesta una landing page?",
    keywords: ["precio", "costo", "cuesta", "cobran", "tarifa", "cuanto"],
    a: "Nuestros paquetes empiezan en $120–200 USD (Landing Express), $300–500 USD (Growth) y $500–1,000+ USD (Pro · SaaS). Cada propuesta se ajusta al alcance real. ¿Quieres que te recomiende uno?",
  },
  {
    q: "¿Cuánto tarda el proyecto?",
    keywords: ["tiempo", "tarda", "dura", "entrega", "plazo", "rapido", "cuando"],
    a: "Una Landing Express se entrega en 3–5 días hábiles. Proyectos Growth y Pro toman entre 14 y 30 días según el alcance.",
  },
  {
    q: "¿Qué tecnologías usan?",
    keywords: ["tecnologia", "stack", "webflow", "next", "framework", "herramientas"],
    a: "Trabajamos en Webflow para velocidad de salida y Next.js cuando necesitas APIs, dashboards o integraciones de IA. Automatizaciones con n8n, Make o Zapier.",
  },
  {
    q: "¿Hacen e-commerce?",
    keywords: ["ecommerce", "tienda", "shopify", "vender", "carrito"],
    a: "Sí. Construimos tiendas en Shopify y catálogos custom en Next.js con checkout optimizado y SEO técnico.",
  },
  {
    q: "¿Incluyen copy y contenido?",
    keywords: ["copy", "texto", "contenido", "redaccion", "escribir"],
    a: "Sí, todos los paquetes incluyen copy estratégico enfocado en conversión. Si tienes contenido propio, lo refinamos.",
  },
  {
    q: "¿Hacen integraciones con IA?",
    keywords: ["ia", "inteligencia", "ai", "openai", "agentes", "chatbot", "automatizacion"],
    a: "Sí. Integramos agentes con OpenAI, automatizaciones con n8n/Make y conexiones con CRM, WhatsApp API y email marketing.",
  },
  {
    q: "¿Cómo empezamos a trabajar?",
    keywords: ["empezar", "comenzar", "iniciar", "proceso", "contratar"],
    a: "Tres pasos: (1) llamada de descubrimiento, (2) propuesta y cotización, (3) kickoff. Puedes escribirnos a hola@asahi.studio o por WhatsApp.",
  },
  {
    q: "¿Trabajan con clientes fuera de México?",
    keywords: ["mexico", "remoto", "internacional", "fuera", "pais", "ubicacion"],
    a: "Sí. Estamos en CDMX y Guadalajara, pero trabajamos 100% remoto con clientes de toda LATAM, EU y US.",
  },
  {
    q: "¿Ofrecen mantenimiento?",
    keywords: ["mantenimiento", "soporte", "actualizacion", "despues"],
    a: "Sí, ofrecemos planes de mantenimiento mensual y consultoría continua tras el lanzamiento.",
  },
];
