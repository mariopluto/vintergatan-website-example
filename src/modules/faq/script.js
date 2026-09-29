document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('faq-accordion-container');

    if (!container) return;

    try {
        // Fetch FAQ items dynamically from the module API
        const response = await fetch('/api/module/faq/list');
        const result = await response.json();

        if (response.ok && result.success && Array.isArray(result.data)) {
            renderAccordion(container, result.data);
        } else {
            container.innerHTML = `
                <div class="p-4 rounded-xl bg-slate-950 border border-rose-900/50 text-rose-400 text-xs font-mono">
                    Failed to load FAQ dataset from module endpoint.
                </div>
            `;
        }
    } catch (error) {
        console.error('FAQ Module Error:', error);
        container.innerHTML = `
            <div class="p-4 rounded-xl bg-slate-950 border border-rose-900/50 text-rose-400 text-xs font-mono">
                [Network Error]: Unable to fetch FAQ list.
            </div>
        `;
    }
});

function renderAccordion(container, items) {
    container.innerHTML = items.map((item, index) => `
        <div class="faq-item rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden transition-all duration-200">
            <button 
                type="button" 
                class="faq-toggle w-full p-6 text-left flex justify-between items-center gap-4 text-white font-semibold text-base sm:text-lg focus:outline-none hover:text-cyan-400 transition-colors"
                aria-expanded="false"
                data-index="${index}"
            >
                <span>${item.question}</span>
                <svg class="faq-icon w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            <div class="faq-content hidden px-6 pb-6 text-sm text-slate-400 leading-relaxed border-t border-slate-900 pt-4">
                ${item.answer}
            </div>
        </div>
    `).join('');

    // Attach Click Handlers
    container.querySelectorAll('.faq-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.closest('.faq-item');
            const content = item.querySelector('.faq-content');
            const icon = item.querySelector('.faq-icon');
            const isOpen = !content.classList.contains('hidden');

            // Close all items
            container.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
            container.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));
            container.querySelectorAll('.faq-item').forEach(i => i.classList.remove('border-purple-500/50'));

            // Toggle current item if it wasn't open
            if (!isOpen) {
                content.classList.remove('hidden');
                icon.classList.add('rotate-180');
                item.classList.add('border-purple-500/50');
            }
        });
    });
}