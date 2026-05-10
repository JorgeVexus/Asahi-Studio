import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js'

// Initialize Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('onboardingForm');
    const successState = document.getElementById('successState');
    const steps = document.querySelectorAll('.step');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressFill = document.getElementById('progressFill');
    
    let currentStep = 1;

    const updateStep = () => {
        steps.forEach(step => {
            step.classList.toggle('active', parseInt(step.dataset.step) === currentStep);
        });

        // Update progress bar
        const progress = (currentStep / steps.length) * 100;
        progressFill.style.width = `${progress}%`;

        // Update buttons
        prevBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
        
        if (currentStep === steps.length) {
            nextBtn.innerHTML = 'Enviar Onboarding <i data-lucide="send"></i>';
            nextBtn.classList.add('btn-submit');
        } else {
            nextBtn.innerHTML = 'Siguiente <i data-lucide="chevron-right"></i>';
            nextBtn.classList.remove('btn-submit');
        }
        
        // Refresh icons
        if (window.lucide) lucide.createIcons();
    };

    nextBtn.addEventListener('click', async () => {
        if (currentStep < steps.length) {
            currentStep++;
            updateStep();
        } else {
            // Submit form
            await submitForm();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStep();
        }
    });

    const submitForm = async () => {
        nextBtn.disabled = true;
        nextBtn.innerHTML = 'Enviando...';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const { error } = await supabase
                .from('onboarding_responses')
                .insert([data]);

            if (error) throw error;

            // Success
            form.style.display = 'none';
            successState.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error('Error:', error.message);
            alert('Hubo un error al enviar el formulario. Por favor intenta de nuevo.');
            nextBtn.disabled = false;
            nextBtn.innerHTML = 'Enviar Onboarding <i data-lucide="send"></i>';
        }
    };
});
