import { notFound } from "next/navigation";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { listTestimonials } from "@/lib/content/queries";

export default async function EditTestimonial({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "new") {
    return (
      <>
        <h1 className="mb-6 font-display text-3xl font-semibold">Nuevo testimonio</h1>
        <TestimonialForm />
      </>
    );
  }
  const item = (await listTestimonials()).find((t) => t.id === id);
  if (!item) notFound();
  return (
    <>
      <h1 className="mb-6 font-display text-3xl font-semibold">{item.name}</h1>
      <TestimonialForm item={item} />
    </>
  );
}
