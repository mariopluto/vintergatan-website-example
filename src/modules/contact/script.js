document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('contact-submit-btn');
    const responseMsg = document.getElementById('contact-response-msg');

    if (contactForm && submitBtn && responseMsg) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('contact-email');
            const messageInput = document.getElementById('contact-message');

            // Set Loading UI
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
            responseMsg.textContent = '[POST /api/module/contact/submit] Sending message...';
            responseMsg.className = 'text-xs font-mono text-cyan-400 animate-pulse';

            try {
                const response = await fetch('/api/module/contact/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: emailInput.value,
                        message: messageInput.value
                    })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    responseMsg.textContent = `[200 OK]: ${result.message}`;
                    responseMsg.className = 'text-xs font-mono text-emerald-400 font-medium';
                    contactForm.reset();
                } else {
                    responseMsg.textContent = `[Error]: ${result.error || 'Failed to submit form.'}`;
                    responseMsg.className = 'text-xs font-mono text-rose-400';
                }
            } catch (error) {
                console.error('Contact Module API Error:', error);
                responseMsg.textContent = '[Network Error]: Could not reach backend module endpoint.';
                responseMsg.className = 'text-xs font-mono text-rose-400';
            } finally {
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
            }
        });
    }
});