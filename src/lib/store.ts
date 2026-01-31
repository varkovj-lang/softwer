import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Decision, Signal, Flow } from '../types';
import { decisions as defaultDecisions, signals as defaultSignals, flows as defaultFlows } from '../data/mock';

export interface DBSchema {
    decisions: Decision[];
    signals: Signal[];
    flows: Flow[];
    events: RecordedEvent[];
    lastScan?: any;
}

export interface RecordedEvent {
    name: string;
    timestamp: number;
    value?: number;
}

const SYSTEM_DOC_ID = 'varko_core_state';

export async function getDB(): Promise<DBSchema> {
    try {
        const docRef = doc(db, 'system', SYSTEM_DOC_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as DBSchema;
        } else {
            // Initial Seed
            const initialData = await seedDB();
            return initialData;
        }
    } catch (e) {
        console.error("Error reading from Firebase:", e);
        // Fallback to local defaults if Firebase fails
        return {
            decisions: defaultDecisions as any,
            signals: defaultSignals as any,
            flows: defaultFlows,
            events: []
        };
    }
}

export async function saveDB(data: DBSchema) {
    try {
        const docRef = doc(db, 'system', SYSTEM_DOC_ID);
        await setDoc(docRef, data);
    } catch (e) {
        console.error("Error saving to Firebase:", e);
    }
}

export async function appendEvent(event: RecordedEvent) {
    const dbData = await getDB();
    dbData.events.push(event);
    if (dbData.events.length > 500) dbData.events = dbData.events.slice(-500);
    await saveDB(dbData);
    return dbData;
}

async function seedDB(): Promise<DBSchema> {
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
            description: 'Nivel de resistencia del usuario antes de completar una acción de valor.',
            rules: [{ event: 'conversion_point_detected', condition: '>', value: 0 }],
            currentStatus: 'ausente'
        },
        {
            id: 'sig_lifecycle_automation',
            name: 'Ley de Automatización de Ciclo de Vida (CRM)',
            type: 'valor',
            description: 'Capacidad del sistema para retener y monetizar la base de datos.',
            rules: [{ event: 'retention_tool_detected', condition: '>', value: 0 }],
            currentStatus: 'ausente'
        },
        {
            id: 'sig_trust_architecture',
            name: 'Ley de Arquitectura de Confianza (Compliance)',
            type: 'valor',
            description: 'Protocolos de seguridad y cumplimiento legal.',
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
            description: 'Latencia técnica que impacta en la tasa de rebote.',
            rules: [{ event: 'server_latency_ms', condition: '<', value: 300 }],
            currentStatus: 'ausente'
        }
    ];

    const initialDecisions: Decision[] = [
        ...defaultDecisions.map(d => ({ ...d, status: 'a_ciegas' as const })),
        {
            id: 'dec_scaling_protocol',
            name: 'Protocolo de Escalado Vertical',
            description: 'Aumento agresivo de inversión basado en la integridad de la señal.',
            category: 'escalado',
            status: 'a_ciegas',
            requiredSignalIds: ['sig_signal_integrity', 'sig_infra_velocity'],
            affectedFlowIds: ['flow_monetization'],
            lastUpdated: new Date().toISOString()
        },
        {
            id: 'dec_retention_injection',
            name: 'Inyección de Estrategia de Retención',
            description: 'Activación de flujos para maximizar LTV.',
            category: 'retención',
            status: 'a_ciegas',
            requiredSignalIds: ['sig_lifecycle_automation'],
            affectedFlowIds: ['flow_monetization'],
            lastUpdated: new Date().toISOString()
        },
        {
            id: 'dec_friction_reduction',
            name: 'Reducción de Fricción del Embudo',
            description: 'Optimización de formularios y UX.',
            category: 'conversión',
            status: 'a_ciegas',
            requiredSignalIds: ['sig_conversion_friction', 'sig_trust_architecture'],
            affectedFlowIds: ['flow_acquisition'],
            lastUpdated: new Date().toISOString()
        }
    ];

    const data = {
        decisions: initialDecisions,
        signals: initialSignals,
        flows: defaultFlows,
        events: []
    };

    await saveDB(data);
    return data;
}
