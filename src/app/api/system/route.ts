import { NextResponse } from 'next/server';
import { getDB } from '@/lib/store';
import { DecisionWithSignals, DecisionStatus } from '@/types';

export async function GET() {
    const db = await getDB();


    // Enrich for frontend
    const enrichedDecisions: DecisionWithSignals[] = db.decisions.map(d => {
        const dSignals = db.signals.filter(s => d.requiredSignalIds.includes(s.id));
        const dFlows = db.flows.filter(f => d.affectedFlowIds.includes(f.id));
        return {
            ...d,
            requiredSignals: dSignals,
            affectedFlows: dFlows
        };
    });

    const stats = {
        blind: enrichedDecisions.filter(d => d.status === 'a_ciegas').length,
        partial: enrichedDecisions.filter(d => d.status === 'parcial').length,
        clear: enrichedDecisions.filter(d => d.status === 'clara').length,
        total: enrichedDecisions.length
    };

    return NextResponse.json({
        decisions: enrichedDecisions,
        stats,
        recentEvents: db.events.slice(-10),
        lastScan: db.lastScan
    });
}
