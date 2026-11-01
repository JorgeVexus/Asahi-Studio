"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveProject, deleteProject } from "@/app/admin/actions";
import type { ProjectRow } from "@/lib/content/types";
import { DeleteButton, Field, SubmitButton, inputCls } from "./ui";

export function ProjectForm({ project, imageSrc }: { project?: ProjectRow; imageSrc?: string }) {
  const [state, action] = useActionState(saveProject, undefined);
  const [hue, setHue] = useState(project?.hue ?? "oklch(0.62 0.235 27)");
  const [preview, setPreview] = useState(imageSrc ?? "");
  const p = project;

  return (
    <div className="space-y-8">
      <form action={action} className="space-y-6">
        <input type="hidden" name="id" value={p?.id ?? ""} />
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Título (ES)">
            <input name="title_es" required defaultValue={p?.title_es} className={inputCls} />
          </Field>
          <Field label="Title (EN)">
            <input name="title_en" required defaultValue={p?.title_en} className={inputCls} />
          </Field>
          <Field label="Categoría (ES)">
            <input
              name="tag_es"
              defaultValue={p?.tag_es}
              placeholder="E-commerce · MX"
              className={inputCls}
            />
          </Field>
          <Field label="Category (EN)">
            <input name="tag_en" defaultValue={p?.tag_en} className={inputCls} />
          </Field>
          <Field label="Resultado / métrica (ES)">
            <input name="metric_es" defaultValue={p?.metric_es} className={inputCls} />
          </Field>
          <Field label="Result / metric (EN)">
            <input name="metric_en" defaultValue={p?.metric_en} className={inputCls} />
          </Field>
        </div>
        <Field label="URL del sitio">
          <input
            name="url"
            type="url"
            required
            defaultValue={p?.url}
            placeholder="https://"
            className={inputCls}
          />
        </Field>
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Color de acento" hint="Cualquier color CSS: #ff6b4a, oklch(...)">
            <div className="flex items-center gap-3">
              <span
                className="h-9 w-9 shrink-0 border border-foreground/25"
                style={{ background: hue }}
              />
              <input
                name="hue"
                value={hue}
                onChange={(e) => setHue(e.target.value)}
                className={inputCls}
              />
            </div>
          </Field>
          <Field label="Orden" hint="Menor número aparece primero">
            <input
              name="sort_order"
              type="number"
              defaultValue={p?.sort_order ?? 0}
              className={inputCls}
            />
          </Field>
        </div>
        <Field
          label="Captura del sitio"
          hint="WebP/PNG/JPG, máx. 4 MB, formato 16:10. Si no subes una, se conserva la actual."
        >
          <input
            name="image"
            type="file"
            accept="image/webp,image/png,image/jpeg,image/avif"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setPreview(URL.createObjectURL(f));
            }}
            className="block w-full text-sm file:mr-4 file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-background"
          />
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt=""
              className="mt-3 aspect-[16/10] w-72 border border-foreground/15 object-cover object-top"
            />
          )}
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input name="visible" type="checkbox" defaultChecked={p?.visible ?? true} /> Visible en el
          sitio
        </label>
        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
        <div className="flex items-center gap-4">
          <SubmitButton>{p ? "Guardar cambios" : "Crear proyecto"}</SubmitButton>
          <Link href="/admin/projects" className="text-sm text-foreground/60 hover:text-primary">
            Cancelar
          </Link>
        </div>
      </form>
      {p && <DeleteButton action={deleteProject} id={p.id} label={p.title_es} />}
    </div>
  );
}
