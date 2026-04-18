// Supabase Edge Function: send-ticket-notification
// Envía correos cuando se crea un ticket, hay una respuesta de Jorge o se completa el ticket

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL = 'jcernalara@gmail.com'
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('--- Nueva notificación de Webhook recibida ---');
    
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY no configurada');

    const payload = await req.json()
    const { record, table, type } = payload
    
    console.log(`Evento: ${type} | Tabla: ${table} | Sender: ${record?.sender_type || 'N/A'}`);

    const SENDER_EMAIL = 'Asahi Studio <onboarding@asahistudio.lat>';

    // CASE 1: NUEVO TICKET (Tabla asahi_tickets)
    if (table === 'asahi_tickets' && type === 'INSERT') {
      console.log('Procesando NUEVO TICKET (Admin Notification)...');
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: SENDER_EMAIL,
          to: [ADMIN_EMAIL],
          subject: `🎫 [NUEVO TICKET] ${record.subject}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2 style="color: #ff6b4a;">Nuevo Ticket Recibido</h2>
              <p><strong>Cliente:</strong> ${record.client_email}</p>
              <p><strong>Asunto:</strong> ${record.subject}</p>
              <p><strong>Prioridad:</strong> ${record.priority}</p>
              <br>
              <a href="https://asahistudio.lat/dashboard/tickets.html" style="background: #ff6b4a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Gestionar en el Panel</a>
            </div>
          `,
        }),
      })
      console.log('Resend status (Nuevo Ticket):', res.status);
    }

    // CASE 2: NUEVO MENSAJE (Tabla asahi_ticket_messages)
    if (table === 'asahi_ticket_messages' && type === 'INSERT') {
      
      // A. Si el mensaje es del CLIENTE -> Avisar al ADMIN
      if (record.sender_type === 'client') {
        console.log('Procesando MENSAJE DE CLIENTE (Admin Notification)...');
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: SENDER_EMAIL,
            to: [ADMIN_EMAIL],
            subject: `💬 [TICKET UPDATE] Nuevo mensaje del cliente`,
            html: `
              <div style="font-family: sans-serif; padding: 20px;">
                <h2 style="color: #ff6b4a;">Nuevo mensaje recibido</h2>
                <p>Un cliente ha respondido en un ticket.</p>
                <p style="background: #f4f4f4; padding: 15px; border-radius: 5px; font-style: italic;">
                  "${record.content}"
                </p>
                <br>
                <a href="https://asahistudio.lat/dashboard/tickets.html" style="background: #333; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ir a responder</a>
              </div>
            `,
          }),
        })
        console.log('Resend status (Mensaje Cliente):', res.status);
      }

      // B. Si el mensaje es del ADMIN -> Avisar al CLIENTE
      if (record.sender_type === 'admin') {
        console.log('Procesando RESPUESTA DE ADMIN (Client Notification)...');
        
        // Obtener info del ticket para saber el correo del cliente
        const ticketResponse = await fetch(`${SUPABASE_URL}/rest/v1/asahi_tickets?id=eq.${record.ticket_id}&select=*`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY || '',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY || ''}`
          }
        })
        const tickets = await ticketResponse.json()
        const ticket = tickets[0]

        if (ticket) {
          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: SENDER_EMAIL,
              to: [ticket.client_email],
              subject: `💬 Jorge ha respondido a tu ticket: ${ticket.subject}`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                  <div style="background: #ff6b4a; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Asahi Studio</h1>
                  </div>
                  <div style="padding: 30px;">
                    <h2 style="color: #333;">Hola, tienes una actualización</h2>
                    <p style="color: #666; font-size: 16px; line-height: 1.6;">${record.content}</p>
                    <br>
                    <a href="https://asahistudio.lat/portal" style="display: inline-block; background: #333; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ver en el Portal</a>
                  </div>
                </div>
              `,
            }),
          })
          console.log('Resend status (Respuesta Admin):', res.status);
        }
      }
    }

    return new Response(JSON.stringify({ message: 'OK' }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 200 
    })

  } catch (error) {
    console.error('ERROR EDGE FUNCTION:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 400 
    })
  }
})
