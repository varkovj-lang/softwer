import { NextResponse } from 'next/server';
import { scanWebsite } from '@/lib/scanner';
import { getDB, saveDB } from '@/lib/store';
import { evaluateSystem } from '@/lib/engine';

export async function POST(request: Request) {
    try {
        const { url, type } = await request.json();

        if (type === 'web') {
            const result = await scanWebsite(url);

            // Persistir el escaneo inmediatamente
            const db = await getDB();
            db.lastScan = result;

            // --- MAPEAR RESULTADOS A EVENTOS DEL SISTEMA ---
            if (result.status === 'success' && result.tags) {
                const timestamp = Date.now();
                const scanEvents = [];

                if (result.tags.hasGA4 || result.tags.hasGTM) scanEvents.push({ name: 'tech_gtm_detected', timestamp, value: 1 });
                if (result.tags.hasFBPixel) scanEvents.push({ name: 'tech_pixel_detected', timestamp, value: 1 });
                if (result.tags.hasConversionForm) scanEvents.push({ name: 'conversion_point_detected', timestamp, value: 1 });
                if (result.tags.hasKlaviyo || result.tags.hasMailchimp) scanEvents.push({ name: 'retention_tool_detected', timestamp, value: 1 });
                if (result.tags.hasPrivacyPolicy) scanEvents.push({ name: 'legal_layer_detected', timestamp, value: 1 });
                if (result.tags.isSecure) scanEvents.push({ name: 'is_secure', timestamp, value: 1 });

                // Latency event
                scanEvents.push({ name: 'server_latency_ms', timestamp, value: result.duration });

                // Añadir eventos a la DB
                db.events = [...db.events, ...scanEvents];
            }


            await saveDB(db);

            // Trigger Engine Re-evaluation
            const updatedDB = await evaluateSystem(db);

            // Enrich for frontend (duplicated logic from system API to ensure instant reactivity)
            const enrichedDecisions = updatedDB.decisions.map(d => ({
                ...d,
                requiredSignals: updatedDB.signals.filter(s => d.requiredSignalIds.includes(s.id)),
                affectedFlows: updatedDB.flows.filter(f => d.affectedFlowIds.includes(f.id))
            }));

            const stats = {
                blind: enrichedDecisions.filter(d => d.status === 'a_ciegas').length,
                partial: enrichedDecisions.filter(d => d.status === 'parcial').length,
                clear: enrichedDecisions.filter(d => d.status === 'clara').length,
                total: enrichedDecisions.length
            };

            return NextResponse.json({
                success: true,
                result,
                systemState: {
                    decisions: enrichedDecisions,
                    stats,
                    recentEvents: updatedDB.events.slice(-10),
                    lastScan: updatedDB.lastScan
                }
            });


        }

        if (type === 'social') {
            return NextResponse.json({
                success: true,
                result: {
                    platform: 'instagram',
                    engagement: 'low',
                    last_post_days: 12
                }
            });
        }

        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    } catch (e) {
        console.error('Scan API Error:', e);
        return NextResponse.json({ error: 'Scan Failed' }, { status: 500 });
    }
}
