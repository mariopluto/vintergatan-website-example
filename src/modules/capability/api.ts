
export async function handleRequest(action: string, req: any, res: any) {
    const startTime = process.hrtime();

    switch (action) {
        case 'status': {
            return res.json({
                success: true,
                message: 'Modulen är aktiv!',
                details: [
                    'API Status: Mår Bra!',
                    'Gateway: Lyssnar!'
                ]
            });
        }

        case 'speed-test': {
            const diff = process.hrtime(startTime);
            const executionTimeMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);

            return res.json({
                success: true,
                message: 'API test klart!',
                details: [
                    `Server Latency: ${executionTimeMs} ms`,
                    'Status: 200 OK'
                ]
            });
        }

        case 'modules': {
            const publicRegistry = [
                { id: 'hero', name: 'Hjälte' },
                { id: 'eshop', name: 'Test E-Shop' },
                { id: 'contact', name: 'Kontakta Oss' },
                { id: 'faq', name: 'FAQ' },
                { id: 'terminal', name: 'Interaktiv Terminal' }
            ];

            return res.json({
                success: true,
                message: `${publicRegistry.length} moduler registrerade:`,
                details: publicRegistry.map(m => `[${m.id}] ${m.name}`)
            });
        }

        default: {
            return res.status(404).json({
                success: false,
                error: `Kommando '${action}' kändes inte igen. skriv 'help' för tillgängliga kommandon.`
            });
        }
    }
}