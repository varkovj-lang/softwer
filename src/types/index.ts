export type DecisionCategory = "pricing" | "conversión" | "activación" | "retención" | "escalado";
export type DecisionStatus = "a_ciegas" | "parcial" | "clara";
export type SignalType = "intención" | "fricción" | "activación" | "abandono" | "valor";
export type SignalStatus = "presente" | "ausente" | "débil";
export type FlowObjective = "captar" | "calificar" | "convertir" | "retener";

export interface SignalRule {
  event: string;
  condition: ">" | "<" | "=";
  value: number;
  timeframe?: number; // minutes
}

export interface Signal {
  id: string;
  name: string;
  type: SignalType;
  description: string;
  rules: SignalRule[];
  currentStatus: SignalStatus;
}

export interface Flow {
  id: string;
  name: string;
  objective: FlowObjective;
}

export interface Decision {
  id: string;
  name: string;
  description: string;
  category: DecisionCategory;
  status: DecisionStatus; // Derived in runtime usually, but we can store it for mock
  requiredSignalIds: string[];
  affectedFlowIds: string[];
  lastUpdated: string; // ISO Date
}

// For view components
export interface DecisionWithSignals extends Omit<Decision, 'requiredSignalIds' | 'affectedFlowIds'> {
  requiredSignals: Signal[];
  affectedFlows: Flow[];
}
