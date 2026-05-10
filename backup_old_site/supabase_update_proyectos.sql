-- Ejecuta este comando en el editor SQL de Supabase para añadir el soporte de nombres de proyecto
ALTER TABLE asahi_tickets ADD COLUMN project_name TEXT;

-- Opcional: Si quieres migrar los existentes basándote en la categoría o algún otro dato, puedes hacerlo aquí
-- UPDATE asahi_tickets SET project_name = 'Proyecto General' WHERE project_name IS NULL;
