import campo from "@/assets/work-campo.webp";
import emika from "@/assets/work-emika.webp";
import beauty from "@/assets/work-beautyhealth.webp";
import china from "@/assets/work-chinasourcing.webp";

// Imágenes incluidas en el repo, usadas cuando un proyecto aún no tiene imagen subida.
const LOCAL: Record<string, string> = {
  campo: campo.src,
  emika: emika.src,
  beauty: beauty.src,
  china: china.src,
};

export function projectImage(row: { slug: string | null; image_url: string | null }) {
  return row.image_url || (row.slug && LOCAL[row.slug]) || "";
}
