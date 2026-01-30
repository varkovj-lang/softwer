import React from 'react';

type StatusType = 'clara' | 'parcial' | 'a_ciegas' | 'presente' | 'ausente' | 'débil';

interface StatusBadgeProps {
    status: StatusType;
    label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
    let color = 'var(--text-tertiary)';
    let bg = 'rgba(255,255,255,0.05)';
    let text = label || status.replace('_', ' ');

    switch (status) {
        case 'clara':
        case 'presente':
            color = 'var(--signal-green)';
            bg = 'var(--signal-green-glow)';
            break;
        case 'parcial':
        case 'débil':
            color = 'var(--signal-orange)';
            bg = 'var(--signal-orange-glow)';
            break;
        case 'a_ciegas':
        case 'ausente':
            color = 'var(--signal-red)';
            bg = 'var(--signal-red-glow)';
            break;
    }

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 10px',
            borderRadius: '100px',
            fontSize: '0.65rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: color,
            backgroundColor: bg,
            border: `1px solid ${color}20`,
            backdropFilter: 'blur(4px)',
            transition: 'all 0.3s ease'
        }}>
            {text}
        </span>
    );
};

