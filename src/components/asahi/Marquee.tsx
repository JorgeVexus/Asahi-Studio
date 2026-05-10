import { motion, useScroll, useTransform, useVelocity, useSpring } from "framer-motion";
import { useRef } from "react";

export function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const skew = useTransform(smooth, [-2000, 0, 2000], [-8, 0, 8]);
  const speed = useTransform(smooth, [-3000, 0, 3000], [-2, 1, 4]);

  const items = ["Webflow", "Next.js", "React", "Framer", "Shopify", "OpenAI", "n8n", "Make", "Supabase", "Tailwind"];
  const row = [...items, ...items];

  return (
    <div ref={ref} className="relative overflow-hidden border-y border-foreground/15 bg-foreground py-6 text-background">
      <motion.div
        style={{ skewX: skew, x: useTransform(speed, (v) => `${v * -50}px`) }}
        className="marquee flex w-max gap-12 whitespace-nowrap font-display text-3xl italic md:text-5xl"
      >
        {row.map((s, i) => (
          <span key={i} className="flex items-center gap-12">
            {s}
            <span className="text-primary">✺</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
