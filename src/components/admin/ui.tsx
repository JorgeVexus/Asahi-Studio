"use client";

import { useFormStatus } from "react-dom";

export const inputCls =
  "w-full border border-foreground/25 bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-primary";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-widest text-foreground/60">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1 block text-xs text-foreground/50">{hint}</span>}
    </label>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="border border-foreground bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:border-primary hover:bg-primary disabled:opacity-50"
    >
      {pending ? "Guardando…" : children}
    </button>
  );
}

export function DeleteButton({
  action,
  id,
  label,
}: {
  action: (fd: FormData) => void;
  id: string;
  label: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`¿Eliminar "${label}"? No se puede deshacer.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="border border-destructive/50 px-4 py-2.5 text-sm text-destructive transition hover:bg-destructive hover:text-background"
      >
        Eliminar
      </button>
    </form>
  );
}
