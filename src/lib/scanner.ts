import { appendEvent } from './store';

interface ScanResult {
    url: string;
    duration: number;
    score: number;
    tags: {
        hasGA4: boolean;
        hasFBPixel: boolean;
        hasGAds: boolean;
        hasKlaviyo: boolean;
        hasMailchimp: boolean;
        hasHotjar: boolean;
        hasConversionForm: boolean;
        hasOpenGraph: boolean;
        isSecure: boolean;
        hasPrivacyPolicy: boolean;
        formFieldsCount: number; // Nueva: Medir fricción
        ttfb: number; // Nueva: Latencia de servidor
    };
    socialLinks: {
        instagram?: string;
        facebook?: string;
        linkedin?: string;
        tiktok?: string;
    };
    socialMetadata: {
        title?: string;
        description?: string;
    };
    traffic?: {
        estimate: string;
        rank: string;
        authority: number;
    };
    brandDNA?: {
        colors: string[];
        fonts: string[];
        theme: 'dark' | 'light';
    };
    insights?: {
        category: string;
        impact: 'High' | 'Medium' | 'Low';
        complexity: 'High' | 'Medium' | 'Low';
        label: string;
        estimatedGain: string;
    }[];
    status: 'success' | 'error';
}



export async function scanWebsite(url: string) {
    const startTime = Date.now();

    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }

    try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 10000);

        const res = await fetch(url, {
            signal: controller.signal,
            headers: { 'User-Agent': 'VARKO-Master-Audit/2.0' }
        });
        clearTimeout(id);

        const html = await res.text();
        const htmlLower = html.toLowerCase();
        const endTime = Date.now();
        const duration = endTime - startTime;

        // --- LOGICA DE DETECCION AVANZADA (MARTECH) ---
        const tags = {
            hasGA4: html.includes('googletagmanager.com/gtag/js') || html.includes('G-') || html.includes('analytics.js') || html.includes('googletagmanager.com/gtm.js'),
            hasFBPixel: html.includes('fbevents.js') || html.includes('fbq(') || html.includes('connect.facebook.net'),
            hasGAds: html.includes('googleadservices.com') || html.includes('AW-') || html.includes('googletagmanager.com/gtm.js?id=AW'),
            hasKlaviyo: html.includes('klaviyo.com') || html.includes('_learnq'),
            hasMailchimp: html.includes('chimpstatic.com') || html.includes('mc-validate'),
            hasHotjar: html.includes('static.hotjar.com') || html.includes('_hjSettings'),
            hasConversionForm: htmlLower.includes('<form') || htmlLower.includes('type="submit"') || htmlLower.includes('action="/contact"'),
            hasOpenGraph: html.includes('property="og:'),
            isSecure: url.startsWith('https'),
            hasPrivacyPolicy: htmlLower.includes('politica de privacidad') || htmlLower.includes('privacy policy') || htmlLower.includes('/privacy') || htmlLower.includes('legal-notice'),
            formFieldsCount: (htmlLower.match(/<input/g) || []).length, // Estimación de campos
            ttfb: Math.random() * 500 // Simulación de Time to First Byte
        };

        // --- CALCULO DEL VARKO SCORE (Heurística) ---
        let points = 0;
        if (tags.hasGA4) points += 15;
        if (tags.hasFBPixel) points += 15;
        if (tags.hasConversionForm) points += 20;
        if (tags.hasOpenGraph) points += 10;
        if (tags.isSecure) points += 10;
        if (tags.hasPrivacyPolicy) points += 15;
        if (duration < 1500) points += 15;
        const score = Math.min(points, 100);

        // Metadata y Links (Igual que antes)
        const socialMetadata = {
            title: html.match(/<meta property="og:title" content="([^"]+)"/)?.[1],
            description: html.match(/<meta property="og:description" content="([^"]+)"/)?.[1]
        };

        const socialLinks = {
            instagram: html.match(/instagram\.com\/([a-zA-Z0-9_.]+)/)?.[0],
            facebook: html.match(/facebook\.com\/([a-zA-Z0-9_.]+)/)?.[0],
            linkedin: html.match(/linkedin\.com\/company\/([a-zA-Z0-9_-]+)/)?.[0],
            tiktok: html.match(/tiktok\.com\/@([a-zA-Z0-9_-]+)/)?.[0],
        };

        // --- INGESTA DE EVENTOS DE ALTO IMPACTO ---
        appendEvent({ name: 'audit_score_generated', timestamp: endTime, value: score });

        // Tracking & Measurement Signals
        if (tags.hasGA4) appendEvent({ name: 'tech_ga4_detected', timestamp: endTime, value: 1 });
        if (tags.hasFBPixel) appendEvent({ name: 'tech_pixel_detected', timestamp: endTime, value: 1 });

        // CRO & Business Signals
        if (tags.hasConversionForm) appendEvent({ name: 'conversion_point_detected', timestamp: endTime, value: 1 });

        // Social & Authority Signals
        if (tags.hasOpenGraph) appendEvent({ name: 'social_og_detected', timestamp: endTime, value: 1 });
        const hasSocial = Object.values(socialLinks).some(link => !!link);
        if (hasSocial) appendEvent({ name: 'social_presence_detected', timestamp: endTime, value: 1 });

        if (tags.hasKlaviyo || tags.hasMailchimp) appendEvent({ name: 'email_stack_detected', timestamp: endTime, value: 1 });
        if (!tags.isSecure || !tags.hasPrivacyPolicy) appendEvent({ name: 'compliance_risk_detected', timestamp: endTime, value: 1 });
        if (tags.hasGAds) appendEvent({ name: 'active_ads_detected', timestamp: endTime, value: 1 });

        // Ingesta de nuevas métricas de rendimiento de sistema
        appendEvent({ name: 'form_friction_score', timestamp: endTime, value: tags.formFieldsCount });
        appendEvent({ name: 'server_latency_ms', timestamp: endTime, value: tags.ttfb });

        // Simulación de LTV/CAC basada en industria (para el MVP)
        appendEvent({ name: 'ltv_cac_ratio', timestamp: endTime, value: Math.random() * (5 - 1) + 1 }); // Ensure it's between 1 and 5



        // --- ESTIMACION DE TRAFICO (MOCK SIMULATION) ---
        // En una versión real, aquí llamaríamos a la API de SimilarWeb o SEMRush
        const domainLength = url.replace('https://', '').replace('www.', '').split('.')[0].length;
        const traffic = {
            estimate: domainLength > 8 ? '+10k visitas/mes' : '+500k visitas/mes',
            rank: domainLength > 8 ? '#1.2M Global' : '#45k Global',
            authority: Math.floor(Math.random() * (90 - 20) + 20) // Simulamos autoridad de dominio
        };

        // --- BRAND DNA EXTRACTION (NEW) ---
        const fonts = (html.match(/family=([^&"'>]+)/g) || [])
            .map(f => f.replace('family=', '').replace(/\+/g, ' ').split(':')[0])
            .filter((v, i, a) => a.indexOf(v) === i)
            .slice(0, 2);

        // Simulated intelligent color detection
        // In a real version, we'd extract from CSS variables or computed styles via pupeteer
        const brandColors = [
            '#000000',
            url.includes('apple') ? '#555555' : url.includes('google') ? '#4285F4' : '#2563EB',
            '#F4F4F5'
        ];

        const brandDNA = {
            colors: brandColors,
            fonts: fonts.length > 0 ? fonts : ['System Sans-Serif'],
            theme: htmlLower.includes('dark') || htmlLower.includes('bgcolor="#000"') ? 'dark' as const : 'light' as const
        };

        // --- VARKO PREDICT ENGINE (NEW) ---
        const insights: NonNullable<ScanResult['insights']> = [];
        if (!tags.hasFBPixel || !tags.hasGA4) {
            insights.push({
                category: 'Measurement',
                impact: 'High',
                complexity: 'Low',
                label: 'Signal Reconnection',
                estimatedGain: '+22% Attribution'
            });
        }
        if (!tags.hasConversionForm) {
            insights.push({
                category: 'CRO',
                impact: 'High',
                complexity: 'Medium',
                label: 'Lead Capture Flow',
                estimatedGain: '3.5x Conversion'
            });
        }
        if (duration > 2000) {
            insights.push({
                category: 'Infra',
                impact: 'Medium',
                complexity: 'High',
                label: 'LCP Optimization',
                estimatedGain: '-12% Bounce Rate'
            });
        }
        if (!tags.hasKlaviyo && !tags.hasMailchimp) {
            insights.push({
                category: 'Retention',
                impact: 'High',
                complexity: 'Medium',
                label: 'Email Lifecycle',
                estimatedGain: '+18% LTV'
            });
        }

        return { url, duration, score, tags, socialLinks, socialMetadata, traffic, brandDNA, insights, status: 'success' };



    } catch (error) {
        appendEvent({ name: 'audit_failed', timestamp: Date.now(), value: 1 });
        return { status: 'error', url };
    }
}
