// Supabase Edge Function: send-ticket-notification
// Lógica robusta para notificaciones de tickets y chats

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
    console.log('--- ENTRADA DE WEBHOOK ---');
    console.log('Tabla:', payload.table, '| Tipo:', payload.type);
    
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY no configurada');

    const { record, table, type } = payload
    const SENDER_EMAIL = 'Asahi Studio <onboarding@asahistudio.lat>';

    // REFUERZO: Si llega el evento de la tabla de tickets directamente
    if (table === 'asahi_tickets' && type === 'INSERT') {
      console.log('>>> Evento Directo de Nuevo Ticket Detectado');
      // Enviamos el correo de alta
      await sendAdminNewTicketEmail(record.subject, record.client_email, record.priority, SENDER_EMAIL);
    }

    // LÓGICA PRINCIPAL: Eventos en la tabla de mensajes (que es la más fiable)
    if (table === 'asahi_ticket_messages' && type === 'INSERT') {
      
      // A. El CLIENTE escribe (Notificar al ADMIN)
      if (record.sender_type === 'client') {
        console.log('>>> Mensaje de Cliente Detectado. Verificando si es un ticket nuevo...');
        
        // Buscamos info del ticket para ver su antigüedad
        const ticket = await getTicketInfo(record.ticket_id);
        
        if (ticket) {
          const createdAt = new Date(ticket.created_at).getTime();
          const now = new Date().getTime();
          const diffSeconds = (now - createdAt) / 1000;

          console.log(`Ticket creado hace ${diffSeconds} segundos.`);

          if (diffSeconds < 120) { // Si el ticket tiene menos de 2 minutos, es un ALTA NUEVA
            console.log('>>> Notificando como NUEVO TICKET (Vía mensaje inicial)');
            await sendAdminNewTicketEmail(ticket.subject, ticket.client_email, ticket.priority, SENDER_EMAIL);
          } else {
            console.log('>>> Notificando como MENSAJE DE CHAT');
            await sendAdminMessageUpdateEmail(record.content, SENDER_EMAIL);
          }
        }
      }

      // B. El ADMIN responde (Notificar al CLIENTE)
      if (record.sender_type === 'admin') {
        console.log('>>> Notificando respuesta al cliente...');
        const ticket = await getTicketInfo(record.ticket_id);
        if (ticket) {
          await sendClientResponseEmail(ticket.client_email, ticket.subject, record.content, SENDER_EMAIL);
        }
      }
    }

    return new Response(JSON.stringify({ status: 'ok' }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 200 
    })

  } catch (error) {
    console.error('ERROR:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 400 
    })
  }
})

// --- FUNCIONES DE APOYO ---

async function getTicketInfo(ticketId: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/asahi_tickets?id=eq.${ticketId}&select=*`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY || '',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY || ''}`
    }
  })
  const data = await res.json()
  return data[0]
}

async function sendAdminNewTicketEmail(subject: string, client: string, priority: string, from: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify({
      from,
      to: [ADMIN_EMAIL],
      subject: `🚀 [NUEVO PROYECTO] ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 25px; border: 2px solid #ff6b4a; border-radius: 12px; background: #fff;">
          <h1 style="color: #ff6b4a; margin-top: 0; font-size: 24px;">¡Misión Inbox: Nuevo Ticket!</h1>
          <p style="font-size: 16px; color: #333;">Se ha registrado un nuevo requerimiento que solicita tu atención.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <div style="background: #fdfdfd; padding: 15px; border-radius: 8px;">
            <p><strong>📂 Proyecto/Asunto:</strong> ${subject}</p>
            <p><strong>👤 Cliente:</strong> ${client}</p>
            <p><strong>🚩 Prioridad:</strong> <span style="background: #ff6b4a; color: #fff; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${priority}</span></p>
          </div>
          <br>
          <a href="https://asahistudio.lat/dashboard/tickets.html" style="display: inline-block; background: #ff6b4a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; text-align: center;">IR AL PANEL DE CONTROL</a>
        </div>
      `,
    }),
  })
  return res.status;
}

async function sendAdminMessageUpdateEmail(content: string, from: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify({
      from,
      to: [ADMIN_EMAIL],
      subject: `💬 [NUEVO MENSAJE] Actualización en Ticket`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #333;">Han escrito en el chat</h2>
          <p>Un cliente te ha enviado un mensaje:</p>
          <div style="background: #f4f4f4; border-left: 4px solid #ff6b4a; padding: 15px; font-style: italic; color: #555;">
            "${content}"
          </div>
          <br>
          <a href="https://asahistudio.lat/dashboard/tickets.html" style="display: inline-block; background: #333; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Ver Chat Completo</a>
        </div>
      `,
    }),
  })
  return res.status;
}

async function sendClientResponseEmail(to: string, subject: string, content: string, from: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `✨ Jorge ha respondido: ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
          <div style="background: #ff6b4a; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Actualización de Asahi Studio</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #333; font-size: 18px;">¡Hola! Tienes novedades en tu ticket</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">${content}</p>
            <br>
            <a href="https://asahistudio.lat/portal" style="display: inline-block; background: #333; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">VER EN MI PORTAL</a>
          </div>
        </div>
      `,
    }),
  })
  return res.status;
}
