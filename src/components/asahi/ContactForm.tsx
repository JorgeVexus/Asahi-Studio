import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

const schema = z.object({
  name: z.string().trim().min(2, "Mínimo 2 caracteres").max(80),
  email: z.string().trim().email("Email inválido").max(160),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  budget: z.string().min(1, "Selecciona un rango"),
  service: z.string().min(1, "Selecciona un servicio"),
  message: z.string().trim().min(10, "Cuéntanos un poco más").max(1000),
});

type FormData = z.infer<typeof schema>;

const budgets = ["< $200 USD", "$200 – $500 USD", "$500 – $1,000 USD", "$1,000+ USD"];
const services = [
  "Landing Express",
  "Growth (Landing + A/B)",
  "Pro (SaaS/App)",
  "Automatización / IA",
];

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", company: "", budget: "", service: "", message: "" },
  });

  const budget = watch("budget");
  const service = watch("service");

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      console.log("Lead:", { ...data, email: "[redacted]" });
      toast.success("¡Recibido! Te contactamos en menos de 24h.");
      setSent(true);
      reset();
      setTimeout(() => setSent(false), 4000);
    } catch (error) {
      toast.error("Hubo un problema al enviar el mensaje. Por favor intenta de nuevo.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Nombre" error={errors.name?.message}>
          <input
            {...register("name")}
            maxLength={80}
            placeholder="Tu nombre"
            className="w-full border-b border-background/30 bg-transparent py-3 text-lg text-background placeholder:text-background/30 outline-none transition focus:border-primary"
          />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            maxLength={160}
            placeholder="tu@empresa.com"
            className="w-full border-b border-background/30 bg-transparent py-3 text-lg text-background placeholder:text-background/30 outline-none transition focus:border-primary"
          />
        </Field>
      </div>

      <Field label="Empresa (opcional)">
        <input
          {...register("company")}
          maxLength={120}
          placeholder="Asahi Co."
          className="w-full border-b border-background/30 bg-transparent py-3 text-lg text-background placeholder:text-background/30 outline-none transition focus:border-primary"
        />
      </Field>

      <Field label="¿Qué necesitas?" error={errors.service?.message}>
        <div className="flex flex-wrap gap-2 pt-2">
          {services.map((s) => (
            <Chip
              key={s}
              active={service === s}
              onClick={() => setValue("service", s, { shouldValidate: true })}
            >
              {s}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="Presupuesto" error={errors.budget?.message}>
        <div className="flex flex-wrap gap-2 pt-2">
          {budgets.map((b) => (
            <Chip
              key={b}
              active={budget === b}
              onClick={() => setValue("budget", b, { shouldValidate: true })}
            >
              {b}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="Cuéntanos del proyecto" error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={4}
          maxLength={1000}
          placeholder="Objetivos, tiempos, referencias..."
          className="w-full resize-none border-b border-background/30 bg-transparent py-3 text-lg text-background placeholder:text-background/30 outline-none transition focus:border-primary"
        />
      </Field>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isSubmitting}
        className="group inline-flex items-center gap-3 bg-primary px-7 py-4 text-base font-medium text-background transition hover:bg-background hover:text-foreground disabled:opacity-60"
      >
        {isSubmitting ? "Enviando..." : sent ? "✓ Enviado" : "Enviar mensaje"}
        <span className="transition group-hover:translate-x-1">→</span>
      </motion.button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-widest text-background/50">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block font-mono text-[11px] text-primary">{error}</span>}
    </label>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-4 py-2 font-mono text-xs uppercase tracking-wider transition ${active ? "border-primary bg-primary text-background" : "border-background/30 text-background/70 hover:border-background"}`}
    >
      {children}
    </button>
  );
}
