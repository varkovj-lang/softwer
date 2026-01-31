import { NextResponse } from 'next/server';
import { getDB, appendEvent } from '@/lib/store';
import { evaluateSystem } from '@/lib/engine';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { event, value } = body;

        if (!event) {
            return NextResponse.json({ error: 'Event name required' }, { status: 400 });
        }

        // 1. Record Event
        const newEvent = { name: event, timestamp: Date.now(), value: value || 0 };
        await appendEvent(newEvent);

        // 2. Re-evaluate System
        const db = await getDB();
        const evaluatedDB = await evaluateSystem(db);


        return NextResponse.json({ success: true, system: evaluatedDB });
    } catch (e) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
