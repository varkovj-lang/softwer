import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST() {
    try {
        const DB_PATH = path.join(process.cwd(), 'src', 'data', 'store.json');
        if (fs.existsSync(DB_PATH)) {
            fs.unlinkSync(DB_PATH); // Borra el archivo
        }
        return NextResponse.json({ success: true, message: 'Sistema reiniciado a valores de fábrica.' });
    } catch (e) {
        return NextResponse.json({ error: 'Fallo al reiniciar' }, { status: 500 });
    }
}
