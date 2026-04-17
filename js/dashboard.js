import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

document.addEventListener('DOMContentLoaded', () => {
    const loginView = document.getElementById('loginView');
    const mainDashboard = document.getElementById('mainDashboard');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const responsesTable = document.getElementById('responsesTable');
    const totalCount = document.getElementById('totalCount');
    const todayCount = document.getElementById('todayCount');
    const detailModal = document.getElementById('detailModal');
    const closeModal = document.getElementById('closeModal');
    const modalBody = document.getElementById('modalBody');

    // --- Auth Logic ---
    supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
            loginView.style.display = 'none';
            mainDashboard.style.display = 'flex';
            document.getElementById('userEmail').textContent = session.user.email;
            fetchResponses();
        } else {
            loginView.style.display = 'flex';
            mainDashboard.style.display = 'none';
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert('Error: ' + error.message);
    });

    logoutBtn.addEventListener('click', () => supabase.auth.signOut());

    // --- Data Logic ---
    async function fetchResponses() {
        const { data, error } = await supabase
            .from('onboarding_responses')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        renderTable(data);
        updateStats(data);
    }

    function renderTable(data) {
        responsesTable.innerHTML = data.map(row => `
            <tr>
                <td>${new Date(row.created_at).toLocaleDateString()}</td>
                <td>${row.full_name || 'Sin nombre'}</td>
                <td class="hide-mobile">${row.company_name || '-'}</td>
                <td class="hide-mobile">${row.email || '-'}</td>
                <td>
                    <button class="btn-view" data-id="${row.id}">Ver Detalle</button>
                </td>
            </tr>
        `).join('');

        // Add event listeners to buttons
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', () => showDetail(data.find(d => d.id === btn.dataset.id)));
        });
    }

    function updateStats(data) {
        totalCount.textContent = data.length;
        const today = new Date().toISOString().split('T')[0];
        const countToday = data.filter(d => d.created_at.startsWith(today)).length;
        todayCount.textContent = countToday;
    }

    function showDetail(item) {
        const labels = {
            full_name: "Nombre y Apellido",
            company_name: "Empresa",
            email: "Email",
            phone: "Teléfono",
            web_domain: "Dominio Actual",
            business_description: "¿A qué se dedican?",
            competitor_advantage: "Ventaja Competitiva",
            target_audience: "Audiencia Target",
            website_goal: "Objetivo del Sitio",
            design_references: "Referencias de Diseño",
            has_brand_identity: "¿Tiene Identidad?",
            brand_files_link: "Archivos de Marca (Link)",
            brand_update_preference: "Sentimiento de Marca",
            brand_adjectives: "Adjetivos",
            desired_pages: "Páginas Deseadas",
            desired_functionality: "Funcionalidades",
            copywriting_preference: "Responsable de Copy",
            copy_doc_link: "Documento de Textos",
            photos_drive_link: "Fotos (Link Drive)",
            hex_colors: "Colores HEX",
            social_links: "Redes Sociales",
            form_recipient_email: "Correo Notificaciones Cliente",
            additional_notes: "Notas Adicionales"
        };

        let html = '';
        for (const [key, label] of Object.entries(labels)) {
            const value = item[key];
            if (value) {
                const isUrl = String(value).startsWith('http');
                html += `
                    <div class="detail-item">
                        <div class="detail-label">${label}</div>
                        <div class="detail-value">
                            ${isUrl ? `<a href="${value}" target="_blank">${value}</a>` : value}
                        </div>
                    </div>
                `;
            }
        }

        modalBody.innerHTML = html;
        detailModal.style.display = 'block';
    }

    closeModal.addEventListener('click', () => detailModal.style.display = 'none');
    window.onclick = (e) => { if (e.target == detailModal) detailModal.style.display = 'none'; };
});
