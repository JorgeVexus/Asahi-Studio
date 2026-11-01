-- Contenido editable del sitio Asahi Studio (proyectos y testimonios).
-- Ejecutar en Supabase: SQL Editor -> pegar -> Run.
-- Solo el service role (servidor) lee/escribe: RLS activo y sin policies publicas.

create table if not exists public.asahi_projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  sort_order int not null default 0,
  visible boolean not null default true,
  url text not null,
  hue text not null default 'oklch(0.62 0.235 27)',
  image_url text,
  title_es text not null, title_en text not null,
  tag_es text not null default '', tag_en text not null default '',
  metric_es text not null default '', metric_en text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.asahi_testimonials (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  visible boolean not null default true,
  name text not null,
  company text not null default '',
  jp text not null default '声',
  quote_es text not null, quote_en text not null,
  role_es text not null default '', role_en text not null default '',
  created_at timestamptz not null default now()
);

alter table public.asahi_projects enable row level security;
alter table public.asahi_testimonials enable row level security;

-- Bucket publico para capturas de proyectos
insert into storage.buckets (id, name, public)
values ('asahi-projects', 'asahi-projects', true)
on conflict (id) do nothing;

-- Datos iniciales (los que hoy estan en el sitio)
insert into public.asahi_projects (slug, sort_order, url, hue, title_es, title_en, tag_es, tag_en, metric_es, metric_en) values
('campo', 1, 'https://campo-nsn.gov/', 'oklch(0.55 0.14 140)', 'Campo Kumeyaay Nation', 'Campo Kumeyaay Nation', 'Institucional · Webflow', 'Institutional · Webflow', 'Sitio gubernamental', 'Government website'),
('emika', 2, 'https://www.emika-procleaning.com/', 'oklch(0.6 0.18 250)', 'Emika ProCleaning', 'Emika ProCleaning', 'Servicios · Landing', 'Services · Landing', '+25 años de trayectoria', '25+ years in business'),
('beauty', 3, 'https://thebeautyhealth.mx/', 'oklch(0.7 0.14 60)', 'The Beauty & Health', 'The Beauty & Health', 'E-commerce · MX', 'E-commerce · MX', 'Marca premium wellness', 'Premium wellness brand'),
('china', 4, 'https://china-sourcing.webflow.io/', 'oklch(0.62 0.235 27)', 'China Sourcing', 'China Sourcing', 'Importación · Webflow', 'Import · Webflow', 'Lead-gen B2B', 'B2B lead gen')
on conflict (slug) do nothing;

insert into public.asahi_testimonials (sort_order, name, company, jp, quote_es, quote_en, role_es, role_en) values
(1, 'Mariana Esquivel', 'Emika ProCleaning', '信', 'El equipo de Asahi entendió nuestro negocio en la primera llamada. La landing nueva nos triplicó las cotizaciones calificadas en menos de un mes.', 'The Asahi team understood our business from the first call. The new landing page tripled our qualified quote requests in under a month.', 'Directora de marketing', 'Marketing Director'),
(2, 'Daniel Ortega', 'China Sourcing MX', '速', 'Diseño impecable, performance brutal y un proceso clarísimo. Es la primera vez que un sitio se siente como una herramienta de venta real.', 'Flawless design, brutal performance and a crystal-clear process. First time a website has felt like an actual sales tool.', 'Founder', 'Founder'),
(3, 'Lucía Fernández', 'The Beauty & Health', '美', 'Tomaron un proyecto complicado y lo entregaron en tiempo récord. Las automatizaciones nos ahorran al menos 15 horas a la semana.', 'They took on a complicated project and delivered in record time. The automations save us at least 15 hours a week.', 'COO', 'COO'),
(4, 'Roberto Gómez', 'Campo Kumeyaay Nation', '誠', 'Cada decisión la justificaron con datos. Nos sentimos acompañados, no vendidos. Volveríamos a trabajar con ellos sin pensarlo.', 'Every decision was backed by data. We felt like partners, not prospects. We''d work with them again without a second thought.', 'Director general', 'General Director');
