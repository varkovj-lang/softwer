import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/store';
import { Decision } from '@/types';
import { evaluateSystem } from '@/lib/engine';

export async function POST(request: Request) {
    try {
        const db = getDB();
        const newDecision: Decision = await request.json();

        // Add default values
        newDecision.id = `dec_${Date.now()}`;
        newDecision.status = 'a_ciegas';
        newDecision.lastUpdated = new Date().toISOString();

        db.decisions.push(newDecision);
        saveDB(db);

        // Re-evaluate to set initial status based on current events/signals
        const evaluatedDB = evaluateSystem(db);

        return NextResponse.json({ success: true, decisions: evaluatedDB.decisions });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to create decision' }, { status: 500 });
    }
}
