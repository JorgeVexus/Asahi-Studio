import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { FAQS, type Faq } from "./faq-data";

type Msg = { role: "bot" | "user"; text: string; suggestions?: string[] };

const INITIAL_SUGGESTIONS = FAQS.slice(0, 4).map((f) => f.q);

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function findAnswer(input: string): string {
  const n = normalize(input);
  const exact = FAQS.find((f) => normalize(f.q) === n);
  if (exact) return exact.a;
  let best: { faq: Faq; score: number } | null = null;
  for (const f of FAQS) {
    const score = f.keywords.reduce((acc, k) => acc + (n.includes(k) ? 1 : 0), 0);
    if (score > 0 && (!best || score > best.score)) best = { faq: f, score };
  }
  if (best) return best.faq.a;
  return "Buena pregunta. Esa la respondemos mejor 1 a 1: escríbenos a hola@asahi.studio o por WhatsApp y te contestamos en menos de 24h.";
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: "こんにちは. Soy el asistente de Asahi Studio. Pregúntame lo que quieras sobre nuestros servicios, paquetes o tiempos.",
      suggestions: INITIAL_SUGGESTIONS,
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    const answer = findAnswer(clean);
    const remaining = FAQS.filter((f) => normalize(f.q) !== normalize(clean))
      .slice(0, 3)
      .map((f) => f.q);
    setMessages((m) => [
      ...m,
      { role: "user", text: clean },
      { role: "bot", text: answer, suggestions: remaining },
    ]);
    setInput("");
  };

  return (
    <>
      <motion.button
        aria-label={open ? "Cerrar chat" : "Abrir chat"}
        onClick={() => setOpen((o) => !o)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 18 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_40px_-10px_color-mix(in_oklab,var(--sun)_60%,transparent)] md:bottom-8 md:right-8"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-5 w-5" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="h-5 w-5" />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-background opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-background" />
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 z-[60] flex h-[560px] max-h-[80vh] w-[calc(100vw-2rem)] max-w-[400px] flex-col overflow-hidden border border-foreground/15 bg-background shadow-2xl md:bottom-28 md:right-8"
          >
            <div className="flex items-center gap-3 border-b border-foreground/15 bg-foreground px-5 py-4 text-background">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
              </span>
              <div className="flex-1">
                <p className="font-display text-base leading-tight">Asahi · Asistente</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-background/60">
                  En línea · responde en segundos
                </p>
              </div>
              <span className="font-jp text-lg text-primary">朝</span>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto bg-background px-4 py-5"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-2 ${m.role === "user" ? "items-end" : "items-start"}`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-foreground text-background"
                        : "border border-foreground/15 bg-secondary text-foreground"
                    }`}
                  >
                    {m.text}
                  </motion.div>
                  {m.role === "bot" && m.suggestions && m.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => send(s)}
                          className="border border-foreground/20 bg-background px-2.5 py-1 text-left font-mono text-[10px] uppercase tracking-wider text-foreground/70 transition hover:border-primary hover:text-primary"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-foreground/15 bg-background px-3 py-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta…"
                className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                aria-label="Enviar"
                className="flex h-9 w-9 items-center justify-center bg-primary text-primary-foreground transition hover:bg-foreground"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <p className="border-t border-foreground/10 bg-background px-4 py-2 text-center font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              Respuestas automáticas · Para casos complejos: hola@asahi.studio
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
