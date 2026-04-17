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
    const { record, table, type } = await req.json()

    // 1. Caso: NUEVO TICKET
    if (table === 'asahi_tickets' && type === 'INSERT') {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Asahi System <tickets@asahistudio.lat>',
          to: [ADMIN_EMAIL],
          subject: `🎫 Nuevo Ticket: ${record.subject}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2 style="color: #ff6b4a;">Nuevo Ticket Recibido</h2>
              <p><strong>Cliente:</strong> ${record.client_email}</p>
              <p><strong>Asunto:</strong> ${record.subject}</p>
              <p><strong>Prioridad:</strong> ${record.priority}</p>
              <br>
              <a href="https://asahistudio.lat/dashboard/tickets.html" style="background: #ff6b4a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ir al Panel de Tickets</a>
            </div>
          `,
        }),
      })
    }

    // 2. Caso: NUEVA RESPUESTA O COMPLETADO
    if (table === 'asahi_ticket_messages' && type === 'INSERT' && record.sender_type === 'admin') {
      // Necesitamos el email del cliente y el asunto del ticket. 
      // Los obtenemos de Supabase usando el ticket_id
      const ticketResponse = await fetch(`${SUPABASE_URL}/rest/v1/asahi_tickets?id=eq.${record.ticket_id}&select=*`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      })
      const tickets = await ticketResponse.json()
      const ticket = tickets[0]

      if (ticket) {
        let subject = `💬 Nueva respuesta en tu ticket: ${ticket.subject}`
        let title = "Jorge ha respondido a tu ticket"
        let messageBody = record.content

        // Si el ticket acaba de ser completado (esto lo detectamos por el estado del ticket)
        if (ticket.status === 'completado') {
          subject = `✅ Ticket Completado: ${ticket.subject}`
          title = "¡Tu requerimiento ha sido completado!"
        }

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'Asahi Studio <soporte@asahistudio.lat>',
            to: [ticket.client_email],
            subject: subject,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                <div style="background: #ff6b4a; padding: 20px; text-align: center;">
                  <h1 style="color: white; margin: 0;">Asahi Studio</h1>
                </div>
                <div style="padding: 30px;">
                  <h2 style="color: #333;">${title}</h2>
                  <p style="color: #666; font-size: 16px; line-height: 1.6;">${messageBody}</p>
                  <br>
                  <a href="https://asahistudio.lat/portal" style="display: inline-block; background: #333; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ver en el Portal</a>
                </div>
                <div style="background: #f9f9f9; padding: 20px; text-align: center; color: #999; font-size: 12px;">
                  <p>Este es un correo automático del sistema de tickets de Asahi Studio.</p>
                </div>
              </div>
            `,
          }),
        })
      }
    }

    return new Response(
      JSON.stringify({ message: 'Notification processed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
