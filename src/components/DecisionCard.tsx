import React from 'react';
import { motion } from 'framer-motion';
import { DecisionWithSignals } from '@/types';
import { StatusBadge } from './StatusBadge';
import { Shield, Zap, Activity, Info } from 'lucide-react';

interface DecisionCardProps {
    decision: DecisionWithSignals;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({ decision }) => {
    const missingSignals = decision.requiredSignals.filter(s => s.currentStatus === 'ausente');

    // Status mapping for visual cues
    const statusConfig = {
        clara: { color: 'var(--signal-green)', glow: 'var(--signal-green-glow)', icon: Shield },
        parcial: { color: 'var(--signal-orange)', glow: 'var(--signal-orange-glow)', icon: Activity },
        a_ciegas: { color: 'var(--signal-red)', glow: 'var(--signal-red-glow)', icon: Info }
    };

    const config = statusConfig[decision.status] || statusConfig.a_ciegas;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.2)' }}
            className="glass-panel flex-col"
            style={{
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}
        >
            {/* Ambient Background Glow */}
            <div style={{
                position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px',
                background: config.glow,
                filter: 'blur(40px)', opacity: 0.6, borderRadius: '50%', pointerEvents: 'none'
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
                <div>
                    <span className="varko-label" style={{ marginBottom: '8px', display: 'block' }}>
                        {decision.category}
                    </span>
                    <h3 className="varko-title" style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                        {decision.name}
                    </h3>
                </div>
                <StatusBadge status={decision.status} />
            </div>

            <p style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                zIndex: 1,
                minHeight: '48px'
            }}>
                {decision.description}
            </p>

            {/* Signal Infrastructure */}
            <div style={{
                paddingTop: '16px',
                marginTop: '8px',
                borderTop: '1px solid var(--border-subtle)',
                zIndex: 1
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 className="varko-label">Signals Kernel</h4>
                    <span className="varko-mono" style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>
                        SYSTEM_VAR v0.1
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {decision.requiredSignals.map(signal => (
                        <div key={signal.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.75rem',
                            padding: '4px 0'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                    width: '4px', height: '4px', borderRadius: '50%',
                                    backgroundColor: signal.type === 'intención' ? 'var(--signal-blue)' :
                                        signal.type === 'fricción' ? 'var(--signal-red)' :
                                            'var(--signal-green)'
                                }} />
                                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }} className="varko-mono">
                                    {signal.name}
                                </span>
                            </div>
                            <span style={{
                                color: signal.currentStatus === 'presente' ? 'var(--signal-green)' : 'var(--text-tertiary)',
                                fontSize: '0.7rem'
                            }} className="varko-mono">
                                {signal.currentStatus === 'presente' ? 'ONLINE' : 'OFFLINE'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Critical Intervention Area */}
            {decision.status !== 'clara' && missingSignals.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        marginTop: 'auto'
                    }}
                >
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <Zap size={14} color={config.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                            <span style={{ display: 'block', fontWeight: 700, marginBottom: '4px', color: config.color }} className="varko-label">
                                Acción Sugerida
                            </span>
                            Integra <strong style={{ color: 'var(--text-primary)' }}>{missingSignals[0].name}</strong> para reducir fricción.
                        </p>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

