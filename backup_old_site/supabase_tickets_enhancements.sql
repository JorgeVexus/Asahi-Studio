-- Mejoras para el sistema de tickets: Notificaciones, Categorías y Rastreo de Actividad
-- Ejecuta este comando en el editor SQL de Supabase

-- 1. Añadir nuevas columnas a la tabla de tickets
ALTER TABLE asahi_tickets 
ADD COLUMN IF NOT EXISTS last_message_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
ADD COLUMN IF NOT EXISTS unread_admin boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS unread_client boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS category text DEFAULT 'Ajustes';

-- 2. Función para actualizar el estado del ticket automáticamente al recibir un mensaje
CREATE OR REPLACE FUNCTION handle_new_ticket_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar la fecha del último mensaje
  UPDATE asahi_tickets
  SET last_message_at = NOW()
  WHERE id = NEW.ticket_id;

  -- Gestionar banderas de no leído y estados automáticos
  IF NEW.sender_type = 'client' THEN
    UPDATE asahi_tickets
    SET unread_admin = true,
        unread_client = false,
        status = CASE WHEN status = 'completado' THEN 'en_proceso' ELSE status END
    WHERE id = NEW.ticket_id;
  ELSIF NEW.sender_type = 'admin' THEN
    UPDATE asahi_tickets
    SET unread_client = true,
        unread_admin = false,
        status = 'revision' -- Por defecto, cuando el admin responde pasa a revisión del cliente
    WHERE id = NEW.ticket_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('tickets', 'tickets', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage para el bucket 'tickets'
CREATE POLICY "Acceso público lectura tickets"
ON storage.objects FOR SELECT
USING (bucket_id = 'tickets');

CREATE POLICY "Subida libre para tickets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'tickets');

-- 3. Trigger que se dispara al insertar un mensaje
DROP TRIGGER IF EXISTS on_ticket_message_inserted ON asahi_ticket_messages;
CREATE TRIGGER on_ticket_message_inserted
AFTER INSERT ON asahi_ticket_messages
FOR EACH ROW
EXECUTE FUNCTION handle_new_ticket_message();

-- 4. Inicializar last_message_at para tickets existentes si los hay
UPDATE asahi_tickets
SET last_message_at = created_at
WHERE last_message_at IS NULL;
