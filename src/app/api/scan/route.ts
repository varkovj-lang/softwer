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
            const db = getDB();
            db.lastScan = result;
            saveDB(db);

            // Trigger Engine Re-evaluation
            evaluateSystem(db);

            return NextResponse.json({ success: true, result });
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
