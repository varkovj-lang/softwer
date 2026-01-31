import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, CheckCircle2, AlertTriangle, XCircle, ExternalLink, Shield, BarChart3, Globe, TrendingUp, Zap } from 'lucide-react';



export const ScannerPanel = ({ onScanComplete }: { onScanComplete: (state?: any) => void }) => {

    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [shareLoading, setShareLoading] = useState(false);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev.slice(-5), `> ${msg}`]);
    };

    const copyBriefingLink = () => {
        if (!result) return;
        setShareLoading(true);
        const baseUrl = window.location.origin;
        const payload = btoa(JSON.stringify(result));
        const shareLink = `${baseUrl}/briefing?payload=${encodeURIComponent(payload)}`;

        navigator.clipboard.writeText(shareLink);
        setTimeout(() => setShareLoading(false), 2000);
        alert("Lote de Inteligencia copiado al portapapeles. Listo para entrega Ghost.");
    };

    const handleScan = async () => {

        if (!url) return;
        setLoading(true);
        setResult(null);
        setLogs([]);

        // Simulated Terminal Sequence
        const logSequence = [
            "Initializing deep scan protocol...",
            `Target: ${url}`,
            "Establishing neural link with domain...",
            "SSL/TLS handshake verified.",
            "Analyzing DOM architecture...",
            "Detecting MarTech signatures...",
            "GA4 Core Logic identified.",
            "Meta Pixel footprint mapping...",
            "Capturing traffic metadata...",
            "Finalizing Varko Intelligence Report..."
        ];

        // Start logging sequence
        let logIndex = 0;
        const interval = setInterval(() => {
            if (logIndex < logSequence.length) {
                addLog(logSequence[logIndex]);
                logIndex++;
            } else {
                clearInterval(interval);
            }
        }, 300);

        try {
            const res = await fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, type: 'web' })
            });
            const json = await res.json();

            // Artificial delay to appreciate the terminal work
            setTimeout(() => {
                setResult(json.result);
                if (json.systemState) {
                    onScanComplete(json.systemState);
                } else {
                    onScanComplete();
                }
            }, 1000);


        } catch (e) {
            addLog("!! FATAL ERROR: CONNECTION_REFUSED");
            console.error(e);
        } finally {
            setTimeout(() => setLoading(false), 1200);
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '32px', marginBottom: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)' }}>
                        <Search size={20} color="var(--signal-blue)" />
                    </div>
                    <div>
                        <h3 className="varko-title" style={{ fontSize: '1.25rem' }}>Audit Engine</h3>
                        <span className="varko-mono" style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>DEEP_SCAN_VERSION_4.2</span>
                    </div>
                </div>

                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{ textAlign: 'right' }}
                        >
                            <span className="varko-label" style={{ color: 'var(--text-tertiary)', display: 'block' }}>Varko Score Index</span>
                            <span className="varko-title" style={{
                                fontSize: '2rem',
                                color: result.score > 70 ? 'var(--signal-green)' : result.score > 40 ? 'var(--signal-orange)' : 'var(--signal-red)'
                            }}>
                                {result.score}<span style={{ fontSize: '1rem', color: 'var(--text-tertiary)' }}>/100</span>
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="varko-label">Domain Infrastructure</label>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            <div style={{ position: 'relative', flex: '1 1 300px' }}>
                                <Globe size={16} style={{ position: 'absolute', left: '12px', top: '21px', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                <input
                                    type="text"
                                    placeholder="enterprise-domain.com"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    style={{
                                        background: 'var(--bg-surface)', border: '1px solid var(--border-medium)',
                                        color: 'var(--text-primary)', padding: '12px 12px 12px 40px',
                                        borderRadius: 'var(--radius-xs)', width: '100%', outline: 'none',
                                        fontFamily: 'inherit', fontSize: '1rem'
                                    }}
                                />
                                {loading && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="varko-mono"
                                        style={{
                                            marginTop: '12px', padding: '12px',
                                            background: '#000', borderRadius: '4px',
                                            borderLeft: '2px solid var(--signal-blue)',
                                            fontSize: '0.7rem', color: '#fff',
                                            lineHeight: '1.5', overflow: 'hidden'
                                        }}
                                    >
                                        {logs.map((log, i) => (
                                            <div key={i} style={{ opacity: i === logs.length - 1 ? 1 : 0.4 }}>{log}</div>
                                        ))}
                                        <motion.div
                                            animate={{ opacity: [0, 1] }}
                                            transition={{ repeat: Infinity, duration: 0.8 }}
                                            style={{ width: '8px', height: '0.7rem', background: 'var(--signal-blue)', display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px' }}
                                        />
                                    </motion.div>
                                )}
                            </div>
                            <button
                                onClick={handleScan}
                                disabled={loading}
                                className="btn-primary"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    flex: '1 1 160px', justifyContent: 'center',
                                    height: '46px',
                                    backgroundColor: loading ? 'var(--bg-surface-elevated)' : undefined,
                                    border: loading ? '1px solid var(--border-medium)' : 'none',
                                    color: loading ? 'var(--text-tertiary)' : undefined
                                }}
                            >
                                {loading ? 'Auditing...' : 'Start Audit'}
                            </button>
                        </div>

                    </div>
                </div>


                <AnimatePresence>
                    {result && result.status === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                flex: 1.5, minWidth: '0', background: 'rgba(255,255,255,0.02)',
                                padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)',
                                width: '100%'
                            }}
                        >
                            <div className="varko-flex-res" style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--signal-green)' }} />
                                    <h4 className="varko-mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
                                        {result.url}
                                    </h4>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '16px' }}>
                                    <button
                                        onClick={() => window.open('/report', '_blank')}
                                        className="btn-ghost"
                                        style={{ padding: '6px 12px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        <ExternalLink size={12} /> Full Report
                                    </button>
                                    <button
                                        onClick={copyBriefingLink}
                                        className="btn-primary"
                                        style={{ padding: '6px 12px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px', background: shareLoading ? 'var(--signal-green)' : 'var(--signal-blue)' }}
                                    >
                                        {shareLoading ? <CheckCircle2 size={12} /> : <Zap size={12} />}
                                        {shareLoading ? 'Copied!' : 'Ghost Share'}
                                    </button>
                                </div>
                            </div>

                            <div className="scanner-results-grid">

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                                            <BarChart3 size={12} color="var(--signal-blue)" />
                                            <h5 className="varko-label">Marketing Stack</h5>
                                        </div>
                                        <ResultRow label="Email Lifecycle" value={result.tags.hasKlaviyo || result.tags.hasMailchimp ? 'Klaviyo Active' : 'Inefficient'} status={result.tags.hasKlaviyo || result.tags.hasMailchimp ? 'good' : 'warn'} />
                                        <ResultRow label="Demand Gen" value={result.tags.hasGAds ? 'Google Ads Tracked' : 'No Signal'} status={result.tags.hasGAds ? 'good' : 'warn'} />
                                        <ResultRow label="Behavior CRM" value={result.tags.hasHotjar ? 'Hotjar Connected' : 'Invisible'} status={result.tags.hasHotjar ? 'good' : 'warn'} />
                                    </div>

                                    {result.brandDNA && (
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                                                <Globe size={12} color="var(--signal-blue)" />
                                                <h5 className="varko-label">Brand DNA</h5>
                                            </div>
                                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '4px' }}>
                                                <div className="flex-col gap-2">
                                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Typography</span>
                                                    <span className="varko-title" style={{ fontSize: '0.85rem' }}>{result.brandDNA.fonts.join(', ')}</span>

                                                    <div style={{ marginTop: '12px' }}>
                                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Detected Palette</span>
                                                        <div style={{ display: 'flex', gap: '4px' }}>
                                                            {result.brandDNA.colors.map((c: string, i: number) => (
                                                                <div key={i} style={{ width: '24px', height: '24px', background: c, borderRadius: '2px', border: '1px solid rgba(255,255,255,0.1)' }} title={c} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                                        <Shield size={12} color="var(--signal-green)" />
                                        <h5 className="varko-label">Protocol & Compliance</h5>
                                    </div>
                                    <ResultRow label="SSL integrity" value={result.tags.isSecure ? 'Verified' : 'Compromised'} status={result.tags.isSecure ? 'good' : 'bad'} />
                                    <ResultRow label="Legal Layer" value={result.tags.hasPrivacyPolicy ? 'Compliant' : 'Missing'} status={result.tags.hasPrivacyPolicy ? 'good' : 'bad'} />
                                    <ResultRow label="Network Pixel" value={result.tags.hasFBPixel ? 'Tracking' : 'Leakage'} status={result.tags.hasFBPixel ? 'good' : 'bad'} />
                                </div>
                            </div>


                            <div style={{
                                marginTop: '24px', display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px',
                                borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)'
                            }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {result.socialLinks.instagram && <SocialIcon label="IG" />}
                                    {result.socialLinks.tiktok && <SocialIcon label="TK" />}
                                    {result.socialLinks.linkedin && <SocialIcon label="IN" />}
                                </div>
                                <span className="varko-mono" style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)' }}>
                                    LATENCY: {result.duration}ms
                                </span>
                            </div>

                            {/* Varko Predict Section */}
                            {result.insights && result.insights.length > 0 && (
                                <div style={{ marginTop: '32px', borderTop: '1px solid var(--border-subtle)', paddingTop: '32px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                                        <div style={{ padding: '6px', background: 'var(--signal-blue-glow)', borderRadius: '4px' }}>
                                            <TrendingUp size={14} color="var(--signal-blue)" />
                                        </div>
                                        <div>
                                            <h4 className="varko-label" style={{ color: 'var(--signal-blue)' }}>Varko Predict</h4>
                                            <span className="varko-mono" style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)' }}>ROI_PROJECTION_ENGINE_v1.0</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                        {result.insights.map((insight: any, i: number) => (
                                            <div key={i} style={{
                                                background: 'rgba(255,255,255,0.01)',
                                                border: '1px solid var(--border-subtle)',
                                                borderRadius: '8px',
                                                padding: '16px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '12px'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <span className="varko-mono" style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)' }}>[{insight.category}]</span>
                                                    <div style={{
                                                        fontSize: '0.6rem',
                                                        padding: '2px 6px',
                                                        borderRadius: '100px',
                                                        background: insight.impact === 'High' ? 'var(--signal-green-glow)' : 'var(--signal-orange-glow)',
                                                        color: insight.impact === 'High' ? 'var(--signal-green)' : 'var(--signal-orange)',
                                                        border: `1px solid ${insight.impact === 'High' ? 'rgba(52, 199, 89, 0.2)' : 'rgba(255, 159, 10, 0.2)'}`
                                                    }}>
                                                        IMPACT: {insight.impact}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h5 className="varko-title" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>{insight.label}</h5>
                                                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--signal-blue)' }}>{insight.estimatedGain}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                                                    <span className="varko-label" style={{ fontSize: '0.55rem' }}>Complexity</span>
                                                    <div style={{ display: 'flex', gap: '2px' }}>
                                                        {[1, 2, 3].map(step => (
                                                            <div key={step} style={{
                                                                width: '12px',
                                                                height: '3px',
                                                                borderRadius: '10px',
                                                                background: step <= (insight.complexity === 'High' ? 3 : insight.complexity === 'Medium' ? 2 : 1) ? 'var(--text-primary)' : 'var(--border-medium)'
                                                            }} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>


            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
};

function ResultRow({ label, value, status }: any) {
    const color = status === 'good' ? 'var(--signal-green)' : status === 'bad' ? 'var(--signal-red)' : 'var(--signal-orange)';
    const Icon = status === 'good' ? CheckCircle2 : status === 'bad' ? XCircle : AlertTriangle;

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            borderBottom: '1px solid rgba(255,255,255,0.03)',
            padding: '8px 0'
        }}>
            <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="varko-mono" style={{ color: color, fontWeight: 500 }}>{value}</span>
                <Icon size={12} color={color} />
            </div>
        </div>
    )
}

function SocialIcon({ label }: { label: string }) {
    return (
        <span style={{
            fontSize: '0.6rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            padding: '2px 8px',
            borderRadius: '2px',
            fontFamily: 'monospace'
        }}>
            {label}
        </span>
    )
}

