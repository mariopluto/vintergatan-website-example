
export async function handleRequest(action: string, req: any, res: any) {
    switch (action) {
        case 'submit': {
            const { email, message } = req.body || {};

            if (!email || !email.includes('@')) {
                return res.status(400).json({
                    success: false,
                    error: 'Det måste vara en riktig adress!.'
                });
            }

            if (!message || message.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Meddelandet kan inte vara tomt.'
                });
            }

            console.log(`[Contact Module] Message received from ${email}`);

            return res.json({
                success: true,
                message: 'Vi fick ert meddelande! vi svarar så snabbt vi kan.',
                data: {
                    receivedAt: new Date().toISOString(),
                    sender: email
                }
            });
        }

        case 'status': {
            return res.json({
                success: true,
                status: 'Kontakt modulen är aktiv.'
            });
        }

        default: {
            return res.status(404).json({
                error: `Action '${action}' not found in this module.`
            });
        }
    }
}