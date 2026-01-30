import { DBSchema, saveDB } from './store';
import { Signal, Decision, SignalStatus, DecisionStatus } from '../types';

export function evaluateSystem(db: DBSchema): DBSchema {
    // 1. Evaluate Signals based on Events
    const updatedSignals = db.signals.map(signal => evaluateSignal(signal, db.events));

    // 2. Evaluate Decisions based on Updated Signals
    const updatedDecisions = db.decisions.map(decision => evaluateDecision(decision, updatedSignals));

    // 3. Persist and return
    const newDB = {
        ...db,
        signals: updatedSignals,
        decisions: updatedDecisions
    };

    saveDB(newDB);
    return newDB;
}

function evaluateSignal(signal: Signal, events: any[]): Signal {
    // Logic: Check if rules are met by recent events.
    // For MVP: We check if ALL rules are met in the timeframe (or generally if present)

    // By default, if rules pass, signal is "present". 
    // If we have some events but thresholds not met, maybe "débil"?
    // If no events found matching, "ausente".

    let status: SignalStatus = 'ausente';

    const rulesMet = signal.rules.every(rule => {
        // Filter events matching the rule event name
        const matchingEvents = events.filter(e => e.name === rule.event);

        if (matchingEvents.length === 0) return false;

        // Timeframe check (if exists)
        // const now = Date.now();
        // if (rule.timeframe) { ... }

        // Condition check
        // For MVP, simplistic check on the LATEST event or COUNT of events
        // Rule: "view_pricing > 2" implies count.
        // Rule: "load_time > 3000" implies value check.

        if (rule.condition === '>' || rule.condition === '<' || rule.condition === '=') {
            // Heuristic: If condition value is small (<10), assume it's a COUNT check
            // If condition value is large (>100), assume it's a VALUE check (like milliseconds)
            // This is a rough heuristic for MVP speed.

            if (rule.value < 10) {
                // Count Check
                const count = matchingEvents.length;
                if (rule.condition === '>') return count > rule.value;
                if (rule.condition === '<') return count < rule.value;
                if (rule.condition === '=') return count === rule.value;
            } else {
                // Value Check (on the latest event)
                const lastEvent = matchingEvents[matchingEvents.length - 1];
                const val = lastEvent.value || 0;
                if (rule.condition === '>') return val > rule.value;
                if (rule.condition === '<') return val < rule.value;
                if (rule.condition === '=') return val === rule.value;
            }
        }

        return false;
    });

    if (rulesMet) status = 'presente';
    // Logic for 'débil' could be: Partial rules met, or met but old? 
    // For now, strictly Present or Ausente ensures "Clarity".

    return { ...signal, currentStatus: status };
}

function evaluateDecision(decision: Decision, signals: Signal[]): Decision {
    // Logic from prompt:
    // IF all requiredSignals.status == "presente" -> "clara"
    // ELSE IF some requiredSignals.status == "presente" -> "parcial"
    // ELSE -> "a_ciegas"

    const requiredSignals = signals.filter(s => decision.requiredSignalIds.includes(s.id));

    if (requiredSignals.length === 0) return { ...decision, status: 'a_ciegas' };

    const allPresent = requiredSignals.every(s => s.currentStatus === 'presente');
    const somePresent = requiredSignals.some(s => s.currentStatus === 'presente');

    let status: DecisionStatus = 'a_ciegas';

    if (allPresent) status = 'clara';
    else if (somePresent) status = 'parcial';

    return { ...decision, status, lastUpdated: new Date().toISOString() };
}
