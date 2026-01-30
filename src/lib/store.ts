import fs from 'fs';
import path from 'path';
import { Decision, Signal, Flow } from '../types';
import { decisions as defaultDecisions, signals as defaultSignals, flows as defaultFlows } from '../data/mock';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'store.json');

export interface DBSchema {
    decisions: Decision[];
    signals: Signal[];
    flows: Flow[];
    events: RecordedEvent[];
    lastScan?: any; // Guardamos el último resultado para el reporte
}

export interface RecordedEvent {
    name: string;
    timestamp: number;
    value?: number;
}

function initDB() {
    if (!fs.existsSync(DB_PATH)) {
        const initialSignals: Signal[] = [
            ...defaultSignals.map(s => ({ ...s, currentStatus: 'ausente' as const })),
            {
                id: 'sig_tech_tracking',
                name: 'Rastreo de Datos (Pixel + GA4)',
                type: 'activación',
                description: 'Verifica si el cliente tiene capacidad de medir conversiones.',
                rules: [
                    { event: 'tech_ga4_detected', condition: '>', value: 0 },
                    { event: 'tech_pixel_detected', condition: '>', value: 0 }
                ],
                currentStatus: 'ausente'
            },
            {
                id: 'sig_cro_ready',
                name: 'Capacidad de Conversión (Leads)',
                type: 'valor',
                description: 'Detecta si la web tiene puntos de contacto activos.',
                rules: [
                    { event: 'conversion_point_detected', condition: '>', value: 0 }
                ],
                currentStatus: 'ausente'
            },
            {
                id: 'sig_social_readiness',
                name: 'Madurez en Redes Sociales',
                type: 'activación',
                description: 'Presencia en plataformas + Optimización de Meta-tags.',
                rules: [
                    { event: 'social_presence_detected', condition: '>', value: 0 },
                    { event: 'social_og_detected', condition: '>', value: 0 }
                ],
                currentStatus: 'ausente'
            },
            {
                id: 'sig_profitability_index',
                name: 'Ley de Rentabilidad (LTV/CAC)',
                type: 'valor',
                description: 'Relación entre el valor de vida del cliente y el coste de adquisición.',
                rules: [{ event: 'ltv_cac_ratio', condition: '>', value: 3 }], // Ratio ideal > 3
                currentStatus: 'ausente'
            },
            {
                id: 'sig_checkout_friction',
                name: 'Ley de Fricción (Checkouts)',
                type: 'fricción',
                description: 'Nivel de dificultad para que el usuario complete una acción.',
                rules: [{ event: 'form_friction_score', condition: '<', value: 5 }], // Menos de 5 campos ideal
                currentStatus: 'ausente'
            },
            {
                id: 'sig_system_health',
                name: 'Ley de Velocidad (TTFB)',
                type: 'valor',
                description: 'Salud técnica del servidor y latencia de respuesta.',
                rules: [{ event: 'server_latency_ms', condition: '<', value: 200 }], // Menos de 200ms ideal
                currentStatus: 'ausente'
            }
        ];

        const initialDecisions: Decision[] = [
            ...defaultDecisions.map(d => ({ ...d, status: 'a_ciegas' as const })),
            {
                id: 'dec_initial_audit',
                name: 'Escalar Campañas de Paid Media',
                description: '¿Estamos listos para invertir 10x?',
                category: 'escalado',
                status: 'a_ciegas',
                requiredSignalIds: ['sig_tech_tracking', 'sig_cro_ready'],
                affectedFlowIds: ['flow_monetization'],
                lastUpdated: new Date().toISOString()
            },
            {
                id: 'dec_business_pivot',
                name: 'Pivot de Modelo de Negocio',
                description: 'Decisión crítica: ¿Es el modelo actual rentable según LTV/CAC?',
                category: 'pricing',
                status: 'a_ciegas',
                requiredSignalIds: ['sig_profitability_index'],
                affectedFlowIds: ['flow_monetization'],
                lastUpdated: new Date().toISOString()
            },
            {
                id: 'dec_funnel_optimization',
                name: 'Simplificación de Funnel',
                description: 'Optimizar el camino de compra eliminando fricción innecesaria.',
                category: 'conversión',
                status: 'a_ciegas',
                requiredSignalIds: ['sig_checkout_friction', 'sig_system_health'],
                affectedFlowIds: ['flow_acquisition'],
                lastUpdated: new Date().toISOString()
            }
        ];

        const initialData: DBSchema = {
            decisions: initialDecisions,
            signals: initialSignals,
            flows: defaultFlows,
            events: []
        };
        fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    }
}

export function getDB(): DBSchema {
    initDB();
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
}

export function saveDB(data: DBSchema) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function appendEvent(event: RecordedEvent) {
    const db = getDB();
    db.events.push(event);
    if (db.events.length > 1000) {
        db.events = db.events.slice(-1000);
    }
    saveDB(db);
    return db;
}
