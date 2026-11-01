export type ProjectRow = {
  id: string;
  slug: string | null;
  sort_order: number;
  visible: boolean;
  url: string;
  hue: string;
  image_url: string | null;
  title_es: string;
  title_en: string;
  tag_es: string;
  tag_en: string;
  metric_es: string;
  metric_en: string;
};

export type TestimonialRow = {
  id: string;
  sort_order: number;
  visible: boolean;
  name: string;
  company: string;
  jp: string;
  quote_es: string;
  quote_en: string;
  role_es: string;
  role_en: string;
};

// Forma ya localizada que consumen los componentes públicos
export type PublicProject = {
  key: string;
  title: string;
  tag: string;
  metric: string;
  url: string;
  hue: string;
  image: string;
};

export type PublicTestimonial = {
  key: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  jp: string;
};
