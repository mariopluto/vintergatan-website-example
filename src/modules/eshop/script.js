document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.getElementById('checkout-btn');
    const responseMsg = document.getElementById('response-msg');

    if (checkoutBtn && responseMsg) {
        checkoutBtn.addEventListener('click', async () => {
            // Loading State
            checkoutBtn.disabled = true;
            checkoutBtn.classList.add('opacity-75', 'cursor-not-allowed');
            responseMsg.textContent = '[POST /api/module/eshop/checkout] Processing request...';
            responseMsg.className = 'text-xs font-mono text-cyan-400 animate-pulse';

            try {
                // Invokes dynamic NestJS backend gateway route
                const response = await fetch('/api/module/eshop/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId: 'starter-kit', quantity: 1 })
                });

                const result = await response.json();

                if (response.ok) {
                    responseMsg.textContent = `[200 OK]: ${result.message || 'Transaction processed successfully.'}`;
                    responseMsg.className = 'text-xs font-mono text-emerald-400 font-medium';
                } else {
                    responseMsg.textContent = `[${response.status} Error]: ${result.error || 'Checkout execution failed.'}`;
                    responseMsg.className = 'text-xs font-mono text-rose-400';
                }
            } catch (error) {
                console.error('Module API Error:', error);
                responseMsg.textContent = '[Network Error]: Unable to establish connection to NestJS API gateway.';
                responseMsg.className = 'text-xs font-mono text-rose-400';
            } finally {
                // Reset Button State
                checkoutBtn.disabled = false;
                checkoutBtn.classList.remove('opacity-75', 'cursor-not-allowed');
            }
        });
    }
});