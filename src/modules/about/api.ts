export interface AgencyService {
    id: string;
    title: string;
    description: string;
    lighthouseScore: number;
}

export async function fetchServices(): Promise<AgencyService[]> {
    return [
        {
            id: 'vitals',
            title: 'Core Web Vitals Optimization',
            description: 'Sub-second response times and 100/100 Lighthouse performance.',
            lighthouseScore: 100
        },
        {
            id: 'schema',
            title: 'Structured Schema Markup',
            description: 'Embedded JSON-LD metadata for search engine indexing.',
            lighthouseScore: 100
        },
        {
            id: 'conversion',
            title: 'High-Conversion UI',
            description: 'Responsive, fast-loading web interfaces built to convert.',
            lighthouseScore: 100
        }
    ];
}
                    