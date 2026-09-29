export async function handleRequest(action: string, req: any, res: any) {
    switch (action) {
        case 'list': {
            const faqs = [
                {
                    question: "Hur bygger VintergatanWebb webbplatser så snabbt?",
                    answer: "Vi använder en modulär arkitektur som drivs av NestJS och dynamiska JSON-konfigurationer. Istället för att skriva om grundläggande kod för varje projekt kopplar vi omedelbart in förtestade moduler (UI, JS och backend-rutter)."
                },
                {
                    question: "Kan vi lägga till anpassad funktionalitet i en modul?",
                    answer: "Ja! Varje modul är helt isolerad med en egen mall, klientskript och API-slutpunkt (`api.ts`). Du kan utöka eller ändra vilken modul som helst utan att förstöra resten av applikationen."
                },
                {
                    question: "Hur registreras backend-rutter dynamiskt?",
                    answer: "Vår ModuleLoader skannar dina konfigurerade moduler vid serverstart och monterar automatiskt deras motsvarande controllers och slutpunktsåtgärder på den primära Express/NestJS-routern."
                },
                {
                    question: "Är detta modulära tillvägagångssätt SEO- och prestandavänligt?",
                    answer: "Absolut. Genom att undvika tunga ramverk på klientsidan och endast bunta nödvändig Tailwind CSS och ren JavaScript förblir laddningstiderna nästan omedelbara helt utan onödigt överflöd."
                }
            ];

            return res.json({
                success: true,
                data: faqs
            });
        }

        default: {
            return res.status(404).json({
                error: `Åtgärden '${action}' hittades inte i denna modul.`
            });
        }
    }
}