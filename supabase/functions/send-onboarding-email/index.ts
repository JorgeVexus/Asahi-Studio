// Supabase Edge Function: send-onboarding-email
// Usando Resend para el envío de correos

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL = 'jcernalara@gmail.com' // Tu correo de administrador

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { record } = await req.json()

    // 1. Enviar correo al CLIENTE
    const clientEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Asahi Studio <onboarding@asahistudio.lat>', // Dominio verificado correctamente
        to: [record.email],
        subject: '¡Hemos recibido tu información! - Asahi Studio',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #ff6b4a;">¡Hola ${record.full_name}!</h1>
            <p>Gracias por confiar en <strong>Asahi Studio</strong>.</p>
            <p>Hemos recibido tu información de onboarding correctamente. En un plazo de 24-48 horas nos pondremos en contacto contigo para comenzar con tu proyecto.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">Este es un mensaje automático, por favor no respondas a este correo.</p>
          </div>
        `,
      }),
    })

    // 2. Enviar correo al ADMINISTRADOR (Jorge)
    const adminEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Asahi System <system@asahistudio.lat>',
        to: [ADMIN_EMAIL],
        subject: `🚀 Nuevo Onboarding: ${record.company_name}`,
        html: `
          <div style="font-family: sans-serif;">
            <h2>Nuevo Onboarding recibido</h2>
            <p><strong>Cliente:</strong> ${record.full_name}</p>
            <p><strong>Empresa:</strong> ${record.company_name}</p>
            <p><strong>Email:</strong> ${record.email}</p>
            <p><strong>Teléfono:</strong> ${record.phone}</p>
            <br>
            <a href="https://asahistudio.lat/dashboard" style="background: #ff6b4a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ver detalles en el Dashboard</a>
          </div>
        `,
      }),
    })

    return new Response(
      JSON.stringify({ message: 'Emails sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
