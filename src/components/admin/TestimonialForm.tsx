"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveTestimonial, deleteTestimonial } from "@/app/admin/actions";
import type { TestimonialRow } from "@/lib/content/types";
import { DeleteButton, Field, SubmitButton, inputCls } from "./ui";

export function TestimonialForm({ item }: { item?: TestimonialRow }) {
  const [state, action] = useActionState(saveTestimonial, undefined);
  const t = item;
  return (
    <div className="space-y-8">
      <form action={action} className="space-y-6">
        <input type="hidden" name="id" value={t?.id ?? ""} />
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Nombre">
            <input name="name" required defaultValue={t?.name} className={inputCls} />
          </Field>
          <Field label="Empresa">
            <input name="company" defaultValue={t?.company} className={inputCls} />
          </Field>
          <Field label="Cargo (ES)">
            <input name="role_es" defaultValue={t?.role_es} className={inputCls} />
          </Field>
          <Field label="Role (EN)">
            <input name="role_en" defaultValue={t?.role_en} className={inputCls} />
          </Field>
        </div>
        <Field label="Testimonio (ES)">
          <textarea
            name="quote_es"
            required
            rows={4}
            defaultValue={t?.quote_es}
            className={inputCls}
          />
        </Field>
        <Field label="Testimonial (EN)">
          <textarea
            name="quote_en"
            required
            rows={4}
            defaultValue={t?.quote_en}
            className={inputCls}
          />
        </Field>
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Kanji decorativo" hint="Un carácter, ej. 信 速 美 誠">
            <input name="jp" maxLength={2} defaultValue={t?.jp ?? "声"} className={inputCls} />
          </Field>
          <Field label="Orden" hint="Menor número aparece primero">
            <input
              name="sort_order"
              type="number"
              defaultValue={t?.sort_order ?? 0}
              className={inputCls}
            />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input name="visible" type="checkbox" defaultChecked={t?.visible ?? true} /> Visible en el
          sitio
        </label>
        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
        <div className="flex items-center gap-4">
          <SubmitButton>{t ? "Guardar cambios" : "Crear testimonio"}</SubmitButton>
          <Link
            href="/admin/testimonials"
            className="text-sm text-foreground/60 hover:text-primary"
          >
            Cancelar
          </Link>
        </div>
      </form>
      {t && <DeleteButton action={deleteTestimonial} id={t.id} label={t.name} />}
    </div>
  );
}
