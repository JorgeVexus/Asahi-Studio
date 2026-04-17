import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

let currentEmail = localStorage.getItem('asahi_client_email');
let currentTicketId = null;

document.addEventListener('DOMContentLoaded', () => {
    const accessView = document.getElementById('accessView');
    const portalDashboard = document.getElementById('portalDashboard');
    const accessForm = document.getElementById('accessForm');
    const ticketsList = document.getElementById('ticketsList');
    const openNewTicketBtn = document.getElementById('openNewTicketBtn');
    const newTicketForm = document.getElementById('newTicketForm');
    const chatForm = document.getElementById('chatForm');
    const exitBtn = document.getElementById('exitBtn');

    // --- Init ---
    if (currentEmail) {
        showPortal();
    }

    // --- Access Logic ---
    accessForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('clientEmail').value.toLowerCase().trim();
        if (email) {
            currentEmail = email;
            localStorage.setItem('asahi_client_email', email);
            showPortal();
        }
    });

    exitBtn.addEventListener('click', () => {
        localStorage.removeItem('asahi_client_email');
        location.reload();
    });

    function showPortal() {
        accessView.style.display = 'none';
        portalDashboard.style.display = 'flex';
        document.getElementById('activeEmail').textContent = currentEmail;
        fetchTickets();
        lucide.createIcons();
    }

    // --- Data Logic ---
    async function fetchTickets() {
        const { data, error } = await supabase
            .from('asahi_tickets')
            .select('*')
            .eq('client_email', currentEmail)
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            ticketsList.innerHTML = `<div style="color:var(--accent)">Error al cargar tickets</div>`;
            return;
        }

        if (data.length === 0) {
            ticketsList.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 4rem;">No tienes tickets abiertos aún.</div>`;
            return;
        }

        ticketsList.innerHTML = data.map(ticket => `
            <div class="ticket-item" onclick="openChat('${ticket.id}', '${ticket.subject}', '${ticket.status}')">
                <div class="ticket-info">
                    <h3>${ticket.subject}</h3>
                    <div class="ticket-meta">
                        <span><i data-lucide="clock" size="12"></i> ${new Date(ticket.created_at).toLocaleDateString()}</span>
                        <span><i data-lucide="alert-circle" size="12"></i> ${ticket.priority}</span>
                    </div>
                </div>
                <div class="status-badge status-${ticket.status}">${ticket.status.replace('_', ' ')}</div>
            </div>
        `).join('');
        lucide.createIcons();
    }

    // --- New Ticket Logic ---
    openNewTicketBtn.addEventListener('click', () => {
        document.getElementById('newTicketModal').style.display = 'block';
    });

    async function uploadFile(file) {
        if (!file) return null;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${currentEmail}/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
            .from('tickets')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading:', uploadError);
            return null;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('tickets')
            .getPublicUrl(filePath);

        return { url: publicUrl, name: file.name, type: file.type };
    }

    newTicketForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const subject = document.getElementById('ticketSubject').value;
        const content = document.getElementById('ticketContent').value;
        const priority = document.getElementById('ticketPriority').value;
        const fileInput = document.getElementById('ticketFile');
        const file = fileInput.files[0];

        // 1. Upload file if exists
        const attachment = await uploadFile(file);
        const attachments = attachment ? [attachment] : [];

        // 2. Create Ticket
        const { data: ticket, error: tError } = await supabase
            .from('asahi_tickets')
            .insert([{ client_email: currentEmail, subject, priority }])
            .select()
            .single();

        if (tError) {
            alert('Error creating ticket');
            return;
        }

        // 3. Create first message
        const { error: mError } = await supabase
            .from('asahi_ticket_messages')
            .insert([{ ticket_id: ticket.id, sender_type: 'client', content, attachments }]);

        if (mError) {
            alert('Error creating message');
        } else {
            document.getElementById('newTicketModal').style.display = 'none';
            newTicketForm.reset();
            fetchTickets();
        }
    });

    // --- Chat Logic ---
    const chatFile = document.getElementById('chatFile');
    const filePreview = document.getElementById('filePreview');

    chatFile.addEventListener('change', () => {
        if (chatFile.files[0]) {
            filePreview.textContent = `Archivo: ${chatFile.files[0].name}`;
            filePreview.style.display = 'block';
        } else {
            filePreview.style.display = 'none';
        }
    });

    async function fetchMessages(ticketId) {
        const { data, error } = await supabase
            .from('asahi_ticket_messages')
            .select('*')
            .eq('ticket_id', ticketId)
            .order('created_at', { ascending: true });

        if (error) return;

        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = data.map(msg => {
            const attachmentsHtml = (msg.attachments || []).map(att => {
                if (att.type.startsWith('image/')) {
                    return `<img src="${att.url}" style="max-width: 100%; border-radius: 8px; margin-top: 0.5rem; display: block; border: 1px solid rgba(255,255,255,0.1);">`;
                }
                return `<a href="${att.url}" target="_blank" style="display: flex; align-items: center; gap: 0.5rem; color: var(--text); background: rgba(255,255,255,0.1); padding: 0.5rem; border-radius: 6px; margin-top: 0.5rem; text-decoration: none; font-size: 0.8rem;">
                    <i data-lucide="file"></i> ${att.name}
                </a>`;
            }).join('');

            return `
                <div class="message msg-${msg.sender_type}">
                    <div class="content">${msg.content}</div>
                    ${attachmentsHtml}
                    <div class="msg-meta">${msg.sender_type === 'admin' ? 'Asahi Studio' : 'Tú'} • ${new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
            `;
        }).join('');
        chatMessages.scrollTop = chatMessages.scrollHeight;
        lucide.createIcons();
    }

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = document.getElementById('chatInput').value;
        const file = chatFile.files[0];
        if ((!content && !file) || !currentTicketId) return;

        const attachment = await uploadFile(file);
        const attachments = attachment ? [attachment] : [];

        const { error } = await supabase
            .from('asahi_ticket_messages')
            .insert([{ ticket_id: currentTicketId, sender_type: 'client', content, attachments }]);

        if (!error) {
            document.getElementById('chatInput').value = '';
            chatFile.value = '';
            filePreview.style.display = 'none';
            fetchMessages(currentTicketId);
        }
    });

    // Subscriptions for Real-time
    const messagesSubscription = supabase
        .channel('public:asahi_ticket_messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'asahi_ticket_messages' }, payload => {
            if (payload.new.ticket_id === currentTicketId) {
                fetchMessages(currentTicketId);
            }
        })
        .subscribe();
});

window.closeModal = (id) => {
    document.getElementById(id).style.display = 'none';
}
