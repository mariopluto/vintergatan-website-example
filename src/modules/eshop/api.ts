
export async function handleRequest(action: string, req: any, res: any) {
    switch (action) {
        case 'checkout': {
            const cartData = req.body;
            console.log("Customer is checking out!", cartData);

            if (!cartData || !cartData.productId) {
                return res.status(400).json({
                    success: false,
                    error: 'Fel cart payload. "productId" krävs.'
                });
            }

            return res.json({ 
                success: true, 
                message: 'Modulen såg ditt meddelande!',
                data: cartData 
            });
        }

        case 'status': {
            return res.json({ 
                success: true, 
                status: 'Den är aktiv!' 
            });
        }

        default: {
            return res.status(404).json({ 
                error: `Error: '${action}' not found in this module.` 
            });
        }
    }
}