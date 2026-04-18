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
    const payload = await req.json()
    
    // DIAGNÓSTICO MAESTRO: Imprimir todo el cuerpo recibido
    console.log('--- INICIO DE NOTIFICACIÓN ---');
    console.log('Payload completo:', JSON.stringify(payload, null, 2));
    
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY no configurada');

    const { record, table, type } = payload
    const SENDER_EMAIL = 'Asahi Studio <onboarding@asahistudio.lat>';

    // CASE 1: NUEVO TICKET (Tabla asahi_tickets)
    // Este evento ocurre cuando alguien rellena el formulario de "Nuevo Ticket"
    if (table === 'asahi_tickets' && type === 'INSERT') {
      console.log('>>> EJECUTANDO: Notificación de TICKET NUEVO para Jorge');
      
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: SENDER_EMAIL,
          to: [ADMIN_EMAIL],
          subject: `🚀 [NUEVO PROYECTO] ${record.subject}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 2px solid #ff6b4a; border-radius: 10px;">
              <h1 style="color: #ff6b4a; margin-top: 0;">🎫 ¡Tienes un nuevo Ticket!</h1>
              <p style="font-size: 16px;">Se ha registrado un nuevo requerimiento en el sistema.</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
              <p><strong>Cliente:</strong> ${record.client_email}</p>
              <p><strong>Asunto:</strong> ${record.subject}</p>
              <p><strong>Prioridad:</strong> <span style="background: #333; color: white; padding: 2px 8px; border-radius: 4px;">${record.priority}</span></p>
              <br>
              <a href="https://asahistudio.lat/dashboard/tickets.html" style="display: inline-block; background: #ff6b4a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">GESTIONAR TICKET AHORA</a>
            </div>
          `,
        }),
      })
      console.log('Resultado envío Ticket Nuevo:', res.status);
    }

    // CASE 2: NUEVO MENSAJE (Tabla asahi_ticket_messages)
    if (table === 'asahi_ticket_messages' && type === 'INSERT') {
      
      // A. El CLIENTE escribe (Notificar a Jorge)
      if (record.sender_type === 'client') {
        console.log('>>> EJECUTANDO: Notificación de MENSAJE DE CLIENTE para Jorge');
        
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: SENDER_EMAIL,
            to: [ADMIN_EMAIL],
            subject: `💬 [NUEVO MENSAJE] Chat del Ticket`,
            html: `
              <div style="font-family: sans-serif; padding: 20px;">
                <h2 style="color: #333;">Actualización en el chat</h2>
                <p>Novedad de un cliente:</p>
                <div style="background: #f9f9f9; border-left: 4px solid #ff6b4a; padding: 15px; font-style: italic; color: #555;">
                  "${record.content}"
                </div>
                <br>
                <a href="https://asahistudio.lat/dashboard/tickets.html" style="display: inline-block; background: #333; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Responder en el Panel</a>
              </div>
            `,
          }),
        })
        console.log('Resultado envío Mensaje Cliente:', res.status);
      }

      // B. Jorge escribe (Notificar al Cliente)
      if (record.sender_type === 'admin') {
        console.log('>>> EJECUTANDO: Notificación de RESPUESTA ADMIN para el Cliente');
        
        if (!SUPABASE_URL) throw new Error('Falta SUPABASE_URL para buscar el email del cliente');

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
              subject: `✨ Respuesta de Asahi Studio: ${ticket.subject}`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                  <div style="background: #ff6b4a; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Asahi Studio</h1>
                  </div>
                  <div style="padding: 30px;">
                    <h2 style="color: #333;">Hola, tienes una respuesta de Jorge</h2>
                    <p style="color: #666; font-size: 16px; line-height: 1.6;">${record.content}</p>
                    <br>
                    <a href="https://asahistudio.lat/portal" style="display: inline-block; background: #333; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ir al Portal del Cliente</a>
                  </div>
                </div>
              `,
            }),
          })
          console.log('Resultado envío Respuesta Admin:', res.status);
        }
      }
    }

    console.log('--- FIN DE NOTIFICACIÓN (OK) ---');
    return new Response(JSON.stringify({ status: 'ok' }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 200 
    })

  } catch (error) {
    console.error('!!! ERROR EN LA FUNCIÓN:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 400 
    })
  }
})
