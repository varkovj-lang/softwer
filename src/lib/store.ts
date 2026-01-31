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
                id: 'sig_signal_integrity',
                name: 'Ley de Integridad de Señal (Pixel + GTM)',
                type: 'activación',
                description: 'Verificación de la capa de inteligencia de datos necesaria para el aprendizaje algorítmico.',
                rules: [
                    { event: 'tech_gtm_detected', condition: '>', value: 0 },
                    { event: 'tech_pixel_detected', condition: '>', value: 0 }
                ],
                currentStatus: 'ausente'
            },
            {
                id: 'sig_conversion_friction',
                name: 'Ley de Fricción Negativa (CRO)',
                type: 'fricción',
                description: 'Nivel de resistencia del usuario antes de completar una acción de valor (Lead/Sale).',
                rules: [
                    { event: 'conversion_point_detected', condition: '>', value: 0 }
                ],
                currentStatus: 'ausente'
            },
            {
                id: 'sig_lifecycle_automation',
                name: 'Ley de Automatización de Ciclo de Vida (CRM)',
                type: 'valor',
                description: 'Capacidad del sistema para retener y monetizar la base de datos sin intervención humana.',
                rules: [
                    { event: 'retention_tool_detected', condition: '>', value: 0 }
                ],
                currentStatus: 'ausente'
            },
            {
                id: 'sig_trust_architecture',
                name: 'Ley de Arquitectura de Confianza (Compliance)',
                type: 'valor',
                description: 'Protocolos de seguridad y cumplimiento legal que eliminan el riesgo de abandono.',
                rules: [
                    { event: 'legal_layer_detected', condition: '>', value: 0 },
                    { event: 'is_secure', condition: '>', value: 0 }
                ],
                currentStatus: 'ausente'
            },
            {
                id: 'sig_infra_velocity',
                name: 'Ley de Velocidad de Respuesta (LCP)',
                type: 'valor',
                description: 'Latencia técnica que impacta directamente en la tasa de rebote y el QA de pauta.',
                rules: [{ event: 'server_latency_ms', condition: '<', value: 300 }],
                currentStatus: 'ausente'
            }
        ];

        const initialDecisions: Decision[] = [
            ...defaultDecisions.map(d => ({ ...d, status: 'a_ciegas' as const })),
            {
                id: 'dec_scaling_protocol',
                name: 'Protocolo de Escalado Vertical',
                description: 'Aumento agresivo de inversión basado en la integridad de la señal de retorno.',
                category: 'escalado',
                status: 'a_ciegas',
                requiredSignalIds: ['sig_signal_integrity', 'sig_infra_velocity'],
                affectedFlowIds: ['flow_monetization'],
                lastUpdated: new Date().toISOString()
            },
            {
                id: 'dec_retention_injection',
                name: 'Inyección de Estrategia de Retención',
                description: 'Activación de flujos de email/SMS para maximizar el LTV del cliente adquirido.',
                category: 'retención',
                status: 'a_ciegas',
                requiredSignalIds: ['sig_lifecycle_automation'],
                affectedFlowIds: ['flow_monetization'],
                lastUpdated: new Date().toISOString()
            },
            {
                id: 'dec_friction_reduction',
                name: 'Reducción de Fricción del Embudo',
                description: 'Optimización de formularios y UX para capturar demanda con el menor esfuerzo posible.',
                category: 'conversión',
                status: 'a_ciegas',
                requiredSignalIds: ['sig_conversion_friction', 'sig_trust_architecture'],
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
