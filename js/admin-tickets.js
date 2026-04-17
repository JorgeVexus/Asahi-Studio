import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

let activeTicketId = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = '/dashboard';
        return;
    }

    const ticketSidebar = document.getElementById('ticketSidebar');
    const chatView = document.getElementById('chatView');
    const replyForm = document.getElementById('replyForm');
    const updateStatus = document.getElementById('updateStatus');
    const filterStatus = document.getElementById('filterStatus');
    const adminFile = document.getElementById('adminFile');
    const adminFilePreview = document.getElementById('adminFilePreview');

    let selectedFiles = [];

    // --- File Logic ---
    adminFile.addEventListener('change', (e) => {
        selectedFiles = e.target.files;
        if (selectedFiles.length > 0) {
            adminFilePreview.textContent = `📎 ${selectedFiles.length} archivo(s) seleccionados`;
            adminFilePreview.style.display = 'block';
        } else {
            adminFilePreview.style.display = 'none';
        }
    });

    async function uploadFiles(files, ticketId) {
        if (!files || files.length === 0) return [];
        console.log('Admin subiendo archivos:', files.length);
        
        const uploadPromises = Array.from(files).map(async (file) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `admin/${ticketId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('tickets')
                .upload(filePath, file);

            if (uploadError) {
                console.error('Error Admin upload:', uploadError);
                return null;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('tickets')
                .getPublicUrl(filePath);

            console.log('Admin subida exitosa:', publicUrl);
            return { url: publicUrl, name: file.name, type: file.type || 'application/octet-stream' };
        });

        const results = await Promise.all(uploadPromises);
        const validResults = results.filter(res => res !== null);
        console.log('Admin total éxito:', validResults.length);
        return validResults;
    }

    // --- Init ---
    fetchTickets();

    // --- Filter Logic ---
    filterStatus.addEventListener('change', fetchTickets);

    // --- Data Logic ---
    async function fetchTickets() {
        let query = supabase
            .from('asahi_tickets')
            .select('*')
            .order('last_message_at', { ascending: false });

        if (filterStatus.value !== 'all') {
            query = query.eq('status', filterStatus.value);
        }

        const { data, error } = await query;
        if (error) return;

        renderSidebar(data);
    }

    function renderSidebar(data) {
        if (data.length === 0) {
            ticketSidebar.innerHTML = `<div style="padding: 2rem; text-align: center; color: var(--text-secondary);">No hay tickets.</div>`;
            return;
        }

        ticketSidebar.innerHTML = data.map(ticket => `
            <div class="sidebar-item ${activeTicketId === ticket.id ? 'active' : ''}" data-id="${ticket.id}">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="display: flex; align-items: center;">
                        ${ticket.unread_admin ? '<span class="unread-dot"></span>' : ''}
                        <h3>${ticket.subject}</h3>
                    </div>
                    <span class="status-badge status-${ticket.status}" style="font-size: 0.6rem;">${ticket.status === 'en_proceso' ? 'PROCESO' : ticket.status.toUpperCase()}</span>
                </div>
                <div class="client">${ticket.client_email}</div>
                <div class="category-tag">${ticket.category || 'AJUSTES'}</div>
                <div class="client" style="margin-top: 0.4rem; font-size: 0.7rem;">${new Date(ticket.last_message_at).toLocaleDateString()}</div>
            </div>
        `).join('');

        // Selection event
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', () => {
                const ticket = data.find(t => t.id === item.dataset.id);
                selectTicket(ticket);
            });
        });
    }

    async function selectTicket(ticket) {
        activeTicketId = ticket.id;
        
        // Mark as read for admin
        if (ticket.unread_admin) {
            await supabase.from('asahi_tickets').update({ unread_admin: false }).eq('id', ticket.id);
            fetchTickets(); 
        }

        // Highlight in sidebar
        document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
        const activeItem = document.querySelector(`.sidebar-item[data-id="${ticket.id}"]`);
        if (activeItem) activeItem.classList.add('active');

        // Show chat
        chatView.style.display = 'flex';
        document.getElementById('chatSubject').textContent = ticket.subject;
        document.getElementById('chatClient').textContent = ticket.client_email;
        updateStatus.value = ticket.status;

        fetchMessages(ticket.id);
    }

    async function fetchMessages(ticketId) {
        const { data, error } = await supabase
            .from('asahi_ticket_messages')
            .select('*')
            .eq('ticket_id', ticketId)
            .order('created_at', { ascending: true });

        if (error) return;

        console.log('Admin mensajes cargados:', data.length);

        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = data.map(msg => {
            console.log('Admin msg attachments:', msg.attachments);
            let attachmentsHtml = '';
            if (msg.attachments && msg.attachments.length > 0) {
                attachmentsHtml = `<div class="attachments-grid">
                    ${msg.attachments.map(att => {
                        const isImage = att.type && att.type.startsWith('image/');
                        if (isImage) {
                            return `
                                <div class="attachment-item" onclick="window.open('${att.url}', '_blank')">
                                    <img src="${att.url}" alt="${att.name}">
                                </div>`;
                        } else {
                            return `
                                <div class="attachment-item" onclick="window.open('${att.url}', '_blank')" title="${att.name}">
                                    <div class="file-icon"><i data-lucide="file-text"></i></div>
                                </div>`;
                        }
                    }).join('')}
                </div>`;
            }

            return `
                <div class="message msg-${msg.sender_type}">
                    <div class="content">${msg.content}</div>
                    ${attachmentsHtml}
                    <div style="font-size: 0.65rem; margin-top: 0.3rem; opacity: 0.7;">
                        ${msg.sender_type === 'admin' ? 'Tú (Asahi)' : 'Cliente'} • ${new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                </div>
            `;
        }).join('');
        
        if (window.lucide) lucide.createIcons();
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // --- Actions ---
    replyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = document.getElementById('replyInput').value;
        if (!content && selectedFiles.length === 0) return;

        const submitBtn = replyForm.querySelector('button');
        submitBtn.disabled = true;

        try {
            const attachments = await uploadFiles(selectedFiles, activeTicketId);

            const { error } = await supabase
                .from('asahi_ticket_messages')
                .insert([{ 
                    ticket_id: activeTicketId, 
                    sender_type: 'admin', 
                    content,
                    attachments
                }]);

            if (!error) {
                document.getElementById('replyInput').value = '';
                adminFile.value = '';
                selectedFiles = [];
                adminFilePreview.style.display = 'none';
                fetchMessages(activeTicketId);
                fetchTickets(); // Success triggers the handler on ticket side too
            }
        } catch (err) {
            console.error('Error al enviar respuesta:', err);
        } finally {
            submitBtn.disabled = false;
        }
    });

    updateStatus.addEventListener('change', async () => {
        if (!activeTicketId) return;
        
        const { error } = await supabase
            .from('asahi_tickets')
            .update({ status: updateStatus.value })
            .eq('id', activeTicketId);

        if (!error) {
            fetchTickets(); // Refresh sidebar to show new status
        }
    });

    // Real-time
    supabase
        .channel('admin_updates')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'asahi_ticket_messages' }, payload => {
            if (payload.new.ticket_id === activeTicketId) {
                fetchMessages(activeTicketId);
            } else {
                fetchTickets(); // Show unread dots for others
            }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'asahi_tickets' }, () => {
            fetchTickets();
        })
        .subscribe();
});
