import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Target, TrendingUp, ShieldAlert, CheckCircle2, XCircle, ChevronRight, BarChartHorizontal } from 'lucide-react';

export const ComparisonPanel = () => {
    const [urls, setUrls] = useState({ client: '', competitor: '' });
    const [results, setResults] = useState<{ client: any, competitor: any }>({ client: null, competitor: null });
    const [loading, setLoading] = useState({ client: false, competitor: false });

    const scan = async (key: 'client' | 'competitor') => {
        if (!urls[key]) return;
        setLoading(prev => ({ ...prev, [key]: true }));
        try {
            const res = await fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: urls[key], type: 'web' })
            });
            const json = await res.json();
            setResults(prev => ({ ...prev, [key]: json.result }));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(prev => ({ ...prev, [key]: false }));
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '32px', marginBottom: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)' }}>
                        <Swords size={20} color="var(--signal-orange)" />
                    </div>
                    <div>
                        <h3 className="varko-title" style={{ fontSize: '1.25rem' }}>Battle Card</h3>
                        <span className="varko-mono" style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>MARKET_INTEL_V2.0</span>
                    </div>
                </div>
            </div>

            <div className="comparison-grid">
                {/* Column Client */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    <span className="varko-label" style={{ color: 'var(--signal-blue)' }}>Subject Alpha (Client)</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            placeholder="target-entity.com"
                            value={urls.client}
                            onChange={e => setUrls({ ...urls, client: e.target.value })}
                            style={inputStyle}
                        />
                        <button onClick={() => scan('client')} disabled={loading.client} className="btn-ghost" style={{ padding: '10px 16px' }}>
                            {loading.client ? '...' : <Target size={16} />}
                        </button>
                    </div>
                    <AnimatePresence mode="wait">
                        {results.client ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <CompactResult data={results.client} type="client" />
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>

                {/* Center Radar Chart */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                    {results.client && results.competitor ? (
                        <RadarChart client={results.client} competitor={results.competitor} />
                    ) : (
                        <div style={{ textAlign: 'center', opacity: 0.2 }}>
                            <div className="varko-mono" style={{ fontSize: '0.6rem' }}>STANDING_BY_FOR_DUAL_STREAM...</div>
                        </div>
                    )}
                </div>

                {/* Column Competitor */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <span className="varko-label" style={{ color: 'var(--signal-red)' }}>Subject Bravo (Target)</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            placeholder="competitor-entity.com"
                            value={urls.competitor}
                            onChange={e => setUrls({ ...urls, competitor: e.target.value })}
                            style={inputStyle}
                        />
                        <button onClick={() => scan('competitor')} disabled={loading.competitor} className="btn-ghost" style={{ padding: '10px 16px' }}>
                            {loading.competitor ? '...' : <ChevronRight size={16} />}
                        </button>
                    </div>
                    <AnimatePresence mode="wait">
                        {results.competitor ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <CompactResult data={results.competitor} type="competitor" />
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>
            </div>

            {results.client && results.competitor && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        marginTop: '40px', padding: '32px', background: 'rgba(0,0,0,0.3)',
                        borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)',
                        position: 'relative', overflow: 'hidden'
                    }}
                >
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: results.client.score > results.competitor.score ? 'var(--signal-blue)' : 'var(--signal-red)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <ShieldAlert size={16} color="var(--text-tertiary)" />
                        <h4 className="varko-label">Varko Tactical Directive</h4>
                    </div>
                    <p style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.6, maxWidth: '900px', fontWeight: 500 }}>
                        {results.client.score > results.competitor.score
                            ? `🛡️ DOMINANCE RATIFIED: Subject Alpha holds a technical fortress. The gap is not in infrastructure but in market velocity. Maintain defensive position and optimize conversion friction to secure high-ticket leads.`
                            : `⚠️ CRITICAL ECOSYSTEM BREACH: Subject Bravo is operating with superior signal intelligence. Subject Alpha is currently "Blind" in key conversion zones. IMMEDIATE_ACTION: Deploy missing measurement layers and reduce server latency to parity.`
                        }
                    </p>
                </motion.div>
            )}

        </div>
    );
};

const RadarChart = ({ client, competitor }: { client: any, competitor: any }) => {
    const normalize = (data: any) => {
        const velocity = Math.max(20, 100 - (data.duration / 50));
        const friction = data.tags.hasConversionForm ? 100 : 30;
        const signal = (data.tags.hasGA4 || data.tags.hasGTM ? 50 : 0) + (data.tags.hasFBPixel ? 50 : 0);
        const trust = (data.tags.isSecure ? 50 : 0) + (data.tags.hasPrivacyPolicy ? 50 : 0);
        return [signal, friction, velocity, trust];
    };

    const cData = normalize(client);
    const tData = normalize(competitor);

    const size = 200;
    const center = size / 2;
    const radius = size * 0.4;

    const getPoints = (values: number[]) => {
        return values.map((val, i) => {
            const angle = (i * Math.PI * 2) / 4 - Math.PI / 2;
            const r = (val / 100) * radius;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
        }).join(' ');
    };

    const labels = ['SIGNAL', 'FRICTION', 'VELOCITY', 'TRUST'];


    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} style={{ overflow: 'visible' }}>
                {/* Grid */}
                {[0.25, 0.5, 0.75, 1].map(r => (
                    <polygon
                        key={r}
                        points={getPoints([r * 100, r * 100, r * 100, r * 100])}
                        fill="none"
                        stroke="var(--border-subtle)"
                        strokeWidth="1"
                    />
                ))}

                {/* Axes */}
                {[0, 1, 2, 3].map(i => {
                    const angle = (i * Math.PI * 2) / 4 - Math.PI / 2;
                    return (
                        <line
                            key={i}
                            x1={center}
                            y1={center}
                            x2={center + radius * Math.cos(angle)}
                            y2={center + radius * Math.sin(angle)}
                            stroke="var(--border-subtle)"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Data Polygons */}
                <motion.polygon
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.4, scale: 1 }}
                    points={getPoints(tData)}
                    fill="var(--signal-red)"
                    stroke="var(--signal-red)"
                    strokeWidth="2"
                    style={{ filter: 'blur(2px)' }}
                />
                <motion.polygon
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    points={getPoints(cData)}
                    fill="var(--signal-blue)"
                    stroke="var(--signal-blue)"
                    strokeWidth="2"
                />

                {/* Labels */}
                {labels.map((label, i) => {
                    const angle = (i * Math.PI * 2) / 4 - Math.PI / 2;
                    const x = center + (radius + 20) * Math.cos(angle);
                    const y = center + (radius + 20) * Math.sin(angle);
                    return (
                        <text
                            key={i}
                            x={x}
                            y={y}
                            fill="var(--text-tertiary)"
                            fontSize="8"
                            textAnchor="middle"
                            fontFamily="monospace"
                            fontWeight="bold"
                        >
                            {label}
                        </text>
                    );
                })}
            </svg>

            <div style={{ position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '8px', height: '8px', background: 'var(--signal-blue)' }} />
                    <span className="varko-mono" style={{ fontSize: '0.6rem' }}>SUBJECT_A</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '8px', height: '8px', background: 'var(--signal-red)' }} />
                    <span className="varko-mono" style={{ fontSize: '0.6rem' }}>SUBJECT_B</span>
                </div>
            </div>
        </div>
    );
};

function CompactResult({ data, type }: any) {

    if (!data || data.status === 'error' || !data.tags) {
        return (
            <div style={{
                padding: '16px', borderRadius: '4px', border: '1px solid rgba(255, 59, 48, 0.2)',
                background: 'rgba(255, 59, 48, 0.05)', color: 'var(--signal-red)', fontSize: '0.75rem'
            }} className="varko-mono">
                [ACCESS_DENIED] Subject rejected audit signals.
            </div>
        );
    }

    const borderColor = type === 'client' ? 'rgba(0, 122, 255, 0.2)' : 'rgba(255, 59, 48, 0.2)';

    return (
        <div style={{
            padding: '20px', background: 'rgba(255,255,255,0.01)', borderRadius: 'var(--radius-xs)',
            border: `1px solid ${borderColor}`
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'baseline' }}>
                <span className="varko-mono" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{data.url}</span>
                <span className="varko-title" style={{ color: 'var(--signal-green)', fontSize: '1.25rem' }}>{data.score} <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>PTS</span></span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <ComparisonRow label="Traffic Volume" value={data.traffic.estimate} icon={<TrendingUp size={10} />} />
                <ComparisonRow label="Auth. Rank" value={`${data.traffic.authority}/100`} />
                <ComparisonRow label="Network Pixel" value={data.tags.hasFBPixel ? <CheckCircle2 size={12} color="var(--signal-green)" /> : <XCircle size={12} color="var(--signal-red)" />} />
                <ComparisonRow label="Acquisition" value={data.tags.hasGAds ? <CheckCircle2 size={12} color="var(--signal-green)" /> : <XCircle size={12} color="var(--signal-red)" />} />
                <ComparisonRow label="Retention Logic" value={data.tags.hasKlaviyo || data.tags.hasMailchimp ? <CheckCircle2 size={12} color="var(--signal-green)" /> : <XCircle size={12} color="var(--signal-red)" />} />
            </div>
        </div>
    );
}

function ComparisonRow({ label, value, icon }: any) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.7rem',
            borderBottom: '1px solid rgba(255,255,255,0.03)',
            padding: '6px 0'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-tertiary)' }}>
                {icon}
                <span className="varko-mono">{label}</span>
            </div>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }} className="varko-mono">{value}</span>
        </div>
    );
}

const inputStyle = {
    flex: 1,
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-medium)',
    color: 'white',
    padding: '12px 14px',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontFamily: 'inherit',
    outline: 'none'
};

