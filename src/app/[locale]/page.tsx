import { getTranslations, setRequestLocale } from "next-intl/server";
import { Toaster } from "sonner";
import { getPublicProjects, getPublicTestimonials } from "@/lib/content/queries";
import { Nav } from "@/components/asahi/Nav";
import { Hero } from "@/components/asahi/Hero";
import { Marquee } from "@/components/asahi/Marquee";
import { Services } from "@/components/asahi/Services";
import { Process } from "@/components/asahi/Process";
import { Work } from "@/components/asahi/Work";
import { Pricing } from "@/components/asahi/Pricing";
import { Faq } from "@/components/asahi/Faq";
import { Testimonials } from "@/components/asahi/Testimonials";
import { Manifesto } from "@/components/asahi/Manifesto";
import { Contact } from "@/components/asahi/Contact";
import { Footer } from "@/components/asahi/Footer";
import { Cursor } from "@/components/asahi/Cursor";
import { ScrollProgress } from "@/components/asahi/ScrollProgress";
import { ChatWidget } from "@/components/asahi/ChatWidget";

export const revalidate = 60;

type FaqEntry = { q: string; a: string };

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const lang = locale === "en" ? "en" : "es";
  const [projects, testimonials] = await Promise.all([
    getPublicProjects(lang),
    getPublicTestimonials(lang),
  ]);

  const t = await getTranslations({ locale, namespace: "faq" });
  const faqs = t.raw("items") as FaqEntry[];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ScrollProgress />
      <Cursor />
      <Nav />
      <Hero />
      <Marquee />
      <Services />
      <Process />
      <Work projects={projects} />
      <Testimonials items={testimonials} />
      <Pricing />
      <Faq />
      <Manifesto />
      <Contact />
      <Footer />
      <ChatWidget />
      <Toaster position="bottom-right" theme="dark" />
    </main>
  );
}
