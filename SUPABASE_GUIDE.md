# Guía de Configuración: Onboarding Asahi Studio

Sigue estos pasos para poner en funcionamiento tu sistema de onboarding y dashboard.

## 1. Supabase: Configuración de la Base de Datos
1. Ve a tu proyecto en [Supabase](https://supabase.com/).
2. Abre el **SQL Editor** y ejecuta el contenido del archivo `supabase_setup.sql`. Esto creará la tabla y las políticas de seguridad.

## 2. Supabase Auth: Usuarios del Dashboard
1. Ve a **Authentication > Users**.
2. Haz clic en **Add User > Create new user**.
3. Ingresa el correo y contraseña que usarás para acceder a `https://asahi.studio/dashboard`.

## 3. Notificaciones con Resend (Email)
1. Crea una cuenta en [Resend](https://resend.com/).
2. Ve a **API Keys** y crea una nueva llave.
3. Copia esa llave; la necesitaremos en el siguiente paso.
4. **Importante**: Verifica tu dominio (asahi.studio) en Resend para que los correos no lleguen a SPAM.

## 4. Supabase Edge Functions (Despliegue)
Para que los correos se envíen automáticamente, debes subir la función que preparé:
1. Instala Supabase CLI en tu computadora si no lo tienes: `npm install supabase --save-dev`.
2. Login: `npx supabase login`.
3. Link al proyecto: `npx supabase link --project-ref TU_PROJECT_ID`.
4. Configura la API Key de Resend: 
   `npx supabase secrets set RESEND_API_KEY=tu_llave_de_resend`
5. Despliega la función:
   `npx supabase functions deploy send-onboarding-email`

## 5. Webhook: El Activador
Para que la función se ejecute al recibir un formulario:
1. En Supabase, ve a **Database > Webhooks**.
2. Crea un nuevo Webhook:
   - **Name**: `send_email_on_insert`
   - **Table**: `onboarding_responses`
   - **Events**: `INSERT`
   - **Type**: `Supabase Edge Function`
   - **Function**: Selecciona `send-onboarding-email`.

## 6. Conexión Frontend
Abre el archivo `js/supabase-config.js` y coloca tu **URL** y **Anon Key** que encuentras en **Settings > API**.

---
¡Listo! Ahora tu formulario en `/onboarding` enviará datos a Supabase, activará un correo automático vía Resend y podrás ver todo en `/dashboard`.
