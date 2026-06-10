import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
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

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <Cursor />
      <Nav />
      <Hero />
      <Marquee />
      <Services />
      <Process />
      <Work />
      <Testimonials />
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
