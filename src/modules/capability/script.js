document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('terminal-output');
    const form = document.getElementById('terminal-form');
    const input = document.getElementById('terminal-input');
    const quickBtns = document.querySelectorAll('.quick-cmd-btn');

    if (!output || !form || !input) return;

    // Helper to print lines to terminal output
    function printLine(text, colorClass = 'text-slate-300') {
        const p = document.createElement('p');
        p.className = `${colorClass} leading-relaxed`;
        p.innerHTML = text;
        output.appendChild(p);
        output.scrollTop = output.scrollHeight;
    }

    // Execute command against module backend API
    async function executeCommand(cmd) {
        const cleanCmd = cmd.trim().toLowerCase();
        if (!cleanCmd) return;

        printLine(`vintergatan$ ${cleanCmd}`, 'text-cyan-400 font-semibold');

        if (cleanCmd === 'clear') {
            output.innerHTML = '';
            return;
        }

        if (cleanCmd === 'help') {
            printLine('Tillgängliga Kommandon:', 'text-purple-400');
            printLine(' - <code class="text-cyan-300">status</code>: Se lite statistik om servern!');
            printLine(' - <code class="text-cyan-300">speed-test</code>: Kör en riktig benchmark!');
            printLine(' - <code class="text-cyan-300">modules</code>: Visa aktiva hemsido-moduler');
            printLine(' - <code class="text-cyan-300">clear</code>: Töm terminalen');
            return;
        }

        try {
            const startTime = performance.now();
            const response = await fetch(`/api/module/capability/${cleanCmd}`);
            const duration = Math.round(performance.now() - startTime);

            const result = await response.json();

            if (response.ok && result.success) {
                printLine(`[200 OK (${duration}ms)]: ${result.message}`, 'text-emerald-400');
                if (result.details) {
                    result.details.forEach(detail => printLine(`  &rarr; ${detail}`, 'text-slate-400'));
                }
            } else {
                printLine(`[Error]: ${result.error || 'Command execution failed.'}`, 'text-rose-400');
            }
        } catch (err) {
            printLine('[Network Error]: Could not establish communication link.', 'text-rose-400');
        }
    }

    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const cmd = input.value;
        input.value = '';
        executeCommand(cmd);
    });

    // Quick Button Clicks
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cmd = btn.getAttribute('data-cmd');
            executeCommand(cmd);
        });
    });
});