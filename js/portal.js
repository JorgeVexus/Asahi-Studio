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
        // Obtenemos los tickets filtrados por correo
        const { data, error } = await supabase
            .from('asahi_tickets')
            .select('*')
            .eq('client_email', currentEmail)
            .order('last_message_at', { ascending: false });

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
                    <div style="display: flex; align-items: center;">
                        ${ticket.unread_client ? '<span class="unread-badge"></span>' : ''}
                        <h3>${ticket.subject}</h3>
                    </div>
                    <div class="ticket-meta">
                        <span class="category-tag">${ticket.category || 'AJUSTES'}</span>
                        <span><i data-lucide="clock" size="12"></i> ${new Date(ticket.last_message_at).toLocaleDateString()}</span>
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

    async function uploadFiles(files) {
        if (!files || files.length === 0) return [];
        console.log('Subiendo archivos:', files.length);
        
        const uploadPromises = Array.from(files).map(async (file) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${currentEmail}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('tickets')
                .upload(filePath, file);

            if (uploadError) {
                console.error('Error al subir archivo:', file.name, uploadError);
                return null;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('tickets')
                .getPublicUrl(filePath);

            console.log('Archivo subido con éxito:', publicUrl);
            return { url: publicUrl, name: file.name, type: file.type || 'application/octet-stream' };
        });

        const results = await Promise.all(uploadPromises);
        const validResults = results.filter(res => res !== null);
        console.log('Total archivos subidos con éxito:', validResults.length);
        return validResults;
    }

    newTicketForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        const subject = document.getElementById('ticketSubject').value;
        const content = document.getElementById('ticketContent').value;
        const priority = document.getElementById('ticketPriority').value;
        const category = document.getElementById('ticketCategory').value;
        const fileInput = document.getElementById('ticketFile');

        try {
            // 1. Upload files if exist
            const attachments = await uploadFiles(fileInput.files);
            console.log('Adjuntos a guardar:', attachments);

            // 2. Create Ticket
            const { data: ticket, error: tError } = await supabase
                .from('asahi_tickets')
                .insert([{ 
                    client_email: currentEmail, 
                    subject, 
                    priority, 
                    category,
                    last_message_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (tError) throw tError;

            // 3. Create first message
            const { error: mError } = await supabase
                .from('asahi_ticket_messages')
                .insert([{ 
                    ticket_id: ticket.id, 
                    sender_type: 'client', 
                    content, 
                    attachments 
                }]);

            if (mError) throw mError;

            document.getElementById('newTicketModal').style.display = 'none';
            newTicketForm.reset();
            fetchTickets();
        } catch (err) {
            console.error(err);
            alert('Error al crear el ticket. Inténtalo de nuevo.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Solicitud';
        }
    });

    // --- Chat Logic ---
    const chatFile = document.getElementById('chatFile');
    const filePreview = document.getElementById('filePreview');

    chatFile.addEventListener('change', () => {
        if (chatFile.files[0]) {
            filePreview.textContent = `Archivo(s): ${chatFile.files.length}`;
            filePreview.style.display = 'block';
        } else {
            filePreview.style.display = 'none';
        }
    });

    window.viewImage = (url) => {
        const modal = document.getElementById('lightboxModal');
        const img = document.getElementById('lightboxImg');
        img.src = url;
        modal.style.display = 'flex';
    };

    window.downloadFile = async (url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename || 'archivo_asahi';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Error al descargar:', err);
            // Fallback to new tab if fetch fails
            window.open(url, '_blank');
        }
    };

    async function fetchMessages(ticketId) {
        const { data, error } = await supabase
            .from('asahi_ticket_messages')
            .select('*')
            .eq('ticket_id', ticketId)
            .order('created_at', { ascending: true });

        if (error) return;

        console.log('Mensajes cargados:', data.length);

        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = data.map(msg => {
            console.log('Mensaje attachments:', msg.attachments);
            const attachmentsHtml = (msg.attachments || []).map(att => {
                const isImage = att.type && att.type.startsWith('image/');
                const previewContent = isImage 
                    ? `<img src="${att.url}" alt="${att.name}">`
                    : `<div class="file-icon" style="display:flex;align-items:center;justify-content:center;height:100%;"><i data-lucide="file-text"></i></div>`;
                
                return `
                    <div class="attachment-item">
                        ${previewContent}
                        <div class="item-actions">
                            ${isImage ? `<button class="action-btn" onclick="viewImage('${att.url}')" title="Ver"><i data-lucide="eye"></i></button>` : ''}
                            <button class="action-btn" onclick="downloadFile('${att.url}', '${att.name}')" title="Descargar"><i data-lucide="download"></i></button>
                        </div>
                    </div>`;
            }).join('');

            return `
                <div class="message msg-${msg.sender_type}">
                    <div class="content">${msg.content}</div>
                    ${attachmentsHtml ? `<div class="attachments-grid">${attachmentsHtml}</div>` : ''}
                    <div class="msg-meta">${msg.sender_type === 'admin' ? 'Asahi Studio' : 'Tú'} • ${new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
            `;
        }).join('');
        chatMessages.scrollTop = chatMessages.scrollHeight;
        if (window.lucide) lucide.createIcons();
    }

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('chatInput');
        const content = input.value;
        const files = chatFile.files;
        if ((!content && files.length === 0) || !currentTicketId) return;

        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;

        try {
            const attachments = await uploadFiles(files);

            const { error } = await supabase
                .from('asahi_ticket_messages')
                .insert([{ 
                    ticket_id: currentTicketId, 
                    sender_type: 'client', 
                    content, 
                    attachments 
                }]);

            if (!error) {
                input.value = '';
                chatFile.value = '';
                filePreview.style.display = 'none';
                fetchMessages(currentTicketId);
            }
        } catch (err) {
            console.error(err);
        } finally {
            submitBtn.disabled = false;
        }
    });

    // --- Global Actions ---
    window.openChat = async (id, subject, status) => {
        currentTicketId = id;
        document.getElementById('chatModal').style.display = 'block';
        document.getElementById('chatTitle').textContent = subject;
        document.getElementById('chatStatus').innerHTML = `<span class="status-badge status-${status}">${status.replace('_', ' ')}</span>`;
        
        // Mark as read for client when opening
        await supabase
            .from('asahi_tickets')
            .update({ unread_client: false })
            .eq('id', id);

        fetchMessages(id);
        fetchTickets(); // Refresh list to remove unread badge
    };

    // Subscriptions for Real-time
    const messagesSubscription = supabase
        .channel('public:asahi_ticket_messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'asahi_ticket_messages' }, payload => {
            if (payload.new.ticket_id === currentTicketId) {
                fetchMessages(currentTicketId);
            } else {
                fetchTickets(); // Refresh list to show unread badges for other tickets
            }
        })
        .subscribe();

    const ticketsSubscription = supabase
        .channel('public:asahi_tickets')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'asahi_tickets' }, payload => {
            if (payload.new.client_email === currentEmail) {
                fetchTickets();
                if (currentTicketId === payload.new.id) {
                    document.getElementById('chatStatus').innerHTML = `<span class="status-badge status-${payload.new.status}">${payload.new.status.replace('_', ' ')}</span>`;
                }
            }
        })
        .subscribe();
});

window.closeModal = (id) => {
    document.getElementById(id).style.display = 'none';
}
