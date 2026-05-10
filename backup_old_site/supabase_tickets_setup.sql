-- Ejecuta este comando en el editor SQL de tu panel de Supabase para habilitar el sistema de tickets

-- 1. Crear tabla de tickets
create table asahi_tickets (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  client_email text not null,
  subject text not null,
  status text default 'nuevo' check (status in ('nuevo', 'en_proceso', 'revision', 'completado')),
  priority text default 'media' check (priority in ('baja', 'media', 'alta')),
  project_id uuid -- Opcional: link a onboarding_responses si se desea
);

-- 2. Crear tabla de mensajes de tickets
create table asahi_ticket_messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ticket_id uuid references asahi_tickets(id) on delete cascade not null,
  sender_type text not null check (sender_type in ('client', 'admin')),
  content text not null,
  attachments jsonb default '[]'::jsonb -- Array de links o IDs de archivos
);

-- 3. Habilitar RLS
alter table asahi_tickets enable row level security;
alter table asahi_ticket_messages enable row level security;

-- Políticas para asahi_tickets:
-- El admin puede hacer todo
create policy "Admins have full access to tickets" on asahi_tickets
  for all using (auth.role() = 'authenticated');

-- El cliente puede insertar su propio ticket (público para simplificar el inicio)
create policy "Clients can create tickets" on asahi_tickets
  for insert with check (true);

-- El cliente solo puede ver sus propios tickets (basado en el correo ingresado en la sesión/portal)
-- NOTA: Como no estamos usando Auth completo para clientes aún, usaremos un filtro por correo en la consulta del cliente.
-- Para mayor seguridad, en el futuro se recomienda Supabase Auth para clientes.
create policy "Public can see tickets by email filter" on asahi_tickets
  for select using (true); -- El filtrado real se hará en el JS por ahora

-- Políticas para asahi_ticket_messages:
create policy "Admins have full access to messages" on asahi_ticket_messages
  for all using (auth.role() = 'authenticated');

create policy "Public can read/write messages" on asahi_ticket_messages
  for all using (true);

-- 4. Bucket de Almacenamiento (Manual: Crear bucket 'tickets' en Dashboard > Storage con acceso público)
