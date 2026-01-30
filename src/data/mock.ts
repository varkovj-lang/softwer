import { Decision, Signal, Flow, DecisionWithSignals, DecisionStatus, SignalStatus, DecisionCategory } from '../types';

export const signals: Signal[] = [
    {
        id: 'sig_intent_pricing',
        name: 'High Intent (Pricing)',
        type: 'intención',
        description: 'User visited pricing > 2 times + clicked CTA within 7 days',
        rules: [
            { event: 'view_pricing', condition: '>', value: 2 },
            { event: 'click_cta_signup', condition: '>', value: 0 }
        ],
        currentStatus: 'presente'
    },
    {
        id: 'sig_friction_checkout',
        name: 'Friction (Checkout)',
        type: 'fricción',
        description: 'Page load time > 3s or Error Rate > 5% on checkout',
        rules: [
            { event: 'checkout_load_time', condition: '>', value: 3000 }
        ],
        currentStatus: 'ausente' // "Ausente" means the signal is NOT firing/not detected OR we don't have the data? 
        // Prompt says: "Si falta >= 1 señal -> decisión = a_ciegas". 
        // Prompt also says "Signal Status: presente | ausente | débil".
        // "Decision Status Logic: IF all requiredSignals.status == 'presente' -> 'clara'".
        // So 'ausente' here probably means the signal is NOT currently being received/detected, i.e., we are blind to it?
        // Or does it mean the event didn't happen?
        // "Purpose: Detect intent and friction... Output: Signal Status".
        // I'll assume 'ausente' means we are not getting the signal reliably or it's turned off.
    },
    {
        id: 'sig_activation_setup',
        name: 'Workspace Setup Complete',
        type: 'activación',
        description: 'User completed the initial wizard',
        rules: [
            { event: 'wizard_complete', condition: '=', value: 1 }
        ],
        currentStatus: 'débil'
    },
    {
        id: 'sig_churn_risk',
        name: 'Churn Risk (No Login)',
        type: 'abandono',
        description: 'No login in 14 days',
        rules: [{ event: 'login', condition: '=', value: 0 }],
        currentStatus: 'presente'
    }
];

export const flows: Flow[] = [
    { id: 'flow_acquisition', name: 'SaaS Signup Flow', objective: 'captar' },
    { id: 'flow_monetization', name: 'Pro Plan Upgrade', objective: 'convertir' },
    { id: 'flow_onboarding', name: 'New User Onboarding', objective: 'convertir' }
];

export const decisions: Decision[] = [
    {
        id: 'dec_upgrade_pricing',
        name: 'Optimizar Pricing Tier Pro',
        description: 'Determinar si aumentar el precio del plan Pro reduce la conversión significativamente.',
        category: 'pricing',
        status: 'a_ciegas',
        requiredSignalIds: ['sig_intent_pricing', 'sig_friction_checkout'],
        affectedFlowIds: ['flow_monetization'],
        lastUpdated: new Date().toISOString()
    },
    {
        id: 'dec_fix_onboarding',
        name: 'Rediseñar Wizard de Setup',
        description: 'La caída en el paso 2 del wizard sugiere problemas de usabilidad.',
        category: 'activación',
        status: 'a_ciegas',
        requiredSignalIds: ['sig_activation_setup'],
        affectedFlowIds: ['flow_onboarding'],
        lastUpdated: new Date().toISOString()
    },
    {
        id: 'dec_retention_campaign',
        name: 'Lanzar Campaña de Reactivación',
        description: 'Decidir si intervenir usuarios sin login con email agresivo.',
        category: 'retención',
        status: 'a_ciegas',
        requiredSignalIds: ['sig_churn_risk'],
        affectedFlowIds: ['flow_acquisition'], // affecting acquisition LTV? or just flow logic
        lastUpdated: new Date().toISOString()
    }
];

export function getEnrichedDecisions(): DecisionWithSignals[] {
    return decisions.map(d => {
        const dSignals = signals.filter(s => d.requiredSignalIds.includes(s.id));
        const dFlows = flows.filter(f => d.affectedFlowIds.includes(f.id));

        // Logic from prompt:
        // IF all requiredSignals.status == "presente" -> "clara"
        // ELSE IF some requiredSignals.status == "presente" -> "parcial"
        // ELSE -> "a_ciegas"

        let status: DecisionStatus = 'a_ciegas';
        const allPresent = dSignals.every(s => s.currentStatus === 'presente');
        const somePresent = dSignals.some(s => s.currentStatus === 'presente');

        if (dSignals.length > 0) {
            if (allPresent) status = 'clara';
            else if (somePresent) status = 'parcial';
            else status = 'a_ciegas';
        } else {
            // If no signals are mapped, we are definitely blind
            status = 'a_ciegas';
        }

        return {
            ...d,
            requiredSignals: dSignals,
            affectedFlows: dFlows,
            status
        };
    });
}

export function getSystemStats() {
    const enriched = getEnrichedDecisions();
    return {
        blind: enriched.filter(d => d.status === 'a_ciegas').length,
        partial: enriched.filter(d => d.status === 'parcial').length,
        clear: enriched.filter(d => d.status === 'clara').length,
        total: enriched.length
    };
}
