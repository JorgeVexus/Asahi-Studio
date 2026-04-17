-- Ejecuta este comando en el editor SQL de tu panel de Supabase

-- 1. Crear la tabla de respuestas
create table onboarding_responses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Datos Básicos
  full_name text,
  company_name text,
  email text,
  phone text,
  web_domain text,
  
  -- Negocio
  business_description text,
  competitor_advantage text,
  target_audience text,
  website_goal text,
  
  -- Diseño e Identidad
  design_references text,
  has_brand_identity text,
  brand_files_link text,
  brand_update_preference text,
  brand_adjectives text,
  
  -- Recursos y Estructura
  photos_drive_link text,
  typography_info text,
  hex_colors text,
  desired_pages text,
  desired_functionality text,
  
  -- Contenido y Contacto
  copywriting_preference text,
  copy_doc_link text,
  form_recipient_email text,
  contact_data text,
  social_links text,
  additional_notes text
);

-- 2. Habilitar RLS (Opcional, pero recomendado para el dashboard)
alter table onboarding_responses enable row level security;

-- Políticas de seguridad:
-- Permitir inserciones públicas (desde el formulario de onboarding)
create policy "Enable insert for everyone" on onboarding_responses
  for insert with check (true);

-- Permitir lectura solo a usuarios autenticados (para el dashboard)
create policy "Enable select for authenticated users" on onboarding_responses
  for select using (auth.role() = 'authenticated');
