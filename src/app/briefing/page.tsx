'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, TrendingUp, BarChart3, Globe, ExternalLink, ChevronRight, Lock, Unlock, Download } from 'lucide-react';

function BriefingContent() {
    const searchParams = useSearchParams();
    const [data, setData] = useState<any>(null);
    const [unlocked, setUnlocked] = useState(false);

    useEffect(() => {
        const encodedData = searchParams.get('payload');
        if (encodedData) {
            try {
                const decoded = JSON.parse(decodeURIComponent(atob(encodedData)));
                setData(decoded);
            } catch (e) {
                console.error("Failed to decode briefing data", e);
            }
        }
    }, [searchParams]);

    if (!data) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#333' }}>
                <div className="varko-mono" style={{ fontSize: '0.7rem' }}>INVALID_PAYLOAD_OR_EXPIRED_TOKEN</div>
            </div>
        );
    }

    const { url, score, insights, brandDNA, tags, duration, aiNarrative } = data;


    return (
        <div className="briefing-container">
            {/* Ambient Background */}
            <div className="ambient-glow" />

            <AnimatePresence>
                {!unlocked ? (
                    <motion.div
                        key="lockscreen"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="lock-screen"
                    >
                        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                            <div className="varko-title" style={{ fontSize: '3rem', marginBottom: '8px', letterSpacing: '-0.05em' }}>VARKO</div>
                            <p className="varko-mono" style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginBottom: '40px' }}>PRIVATE_CLOUD_ACCESS_V4</p>

                            <div className="glass-panel" style={{ padding: '40px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Lock size={32} color="var(--signal-blue)" style={{ marginBottom: '24px' }} />
                                <h2 className="varko-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Inteligencia Estratégica</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '32px' }}>
                                    Este reporte contiene un diagnóstico profundo de la infraestructura de <strong>{url}</strong> generado por Varko OS.
                                </p>
                                <button
                                    onClick={() => setUnlocked(true)}
                                    className="btn-primary"
                                    style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                    Desbloquear Diagnóstico <Unlock size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.main
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="main-report"
                    >
                        {/* Sidebar Info */}
                        <div className="side-info">
                            <div className="varko-title" style={{ fontSize: '1.5rem' }}>VARKO</div>
                            <div className="varko-mono" style={{ fontSize: '0.55rem', marginTop: '4px', opacity: 0.4 }}>OS_PLATFORM_ACCESS</div>

                            <div style={{ marginTop: 'auto' }}>
                                <div className="varko-label" style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)' }}>TARGET_DOMAIN</div>
                                <div className="varko-mono" style={{ fontSize: '0.75rem', marginTop: '4px' }}>{url}</div>
                            </div>
                        </div>

                        {/* Main Body */}
                        <div className="report-content">
                            <header style={{ marginBottom: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <span className="varko-label" style={{ color: 'var(--signal-blue)', fontSize: '0.7rem' }}>Executive Briefing</span>
                                    <h1 className="varko-title" style={{ fontSize: '4rem', margin: '8px 0', letterSpacing: '-0.02em' }}>{url.replace('https://', '').replace('www.', '')}</h1>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div className="varko-mono" style={{ fontSize: '0.7rem', padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px' }}>
                                            SECURITY_VERIFIED
                                        </div>
                                        <div className="varko-mono" style={{ fontSize: '0.7rem', padding: '4px 12px', background: 'rgba(52, 199, 89, 0.1)', color: 'var(--signal-green)', borderRadius: '100px' }}>
                                            CLIENT_READY
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div className="score-circle" style={{ borderColor: score > 70 ? 'var(--signal-green)' : score > 40 ? 'var(--signal-orange)' : 'var(--signal-red)' }}>
                                        <span className="varko-title" style={{ fontSize: '2.5rem' }}>{score}</span>
                                        <span className="varko-mono" style={{ fontSize: '0.6rem', opacity: 0.5 }}>INDEX</span>
                                    </div>
                                </div>
                            </header>

                            <section className="grid-sections">
                                {/* Column 1: DNA & Stats */}
                                <div className="col">
                                    <div className="section-card">
                                        <div className="varko-label" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Globe size={14} color="var(--signal-blue)" /> Brand DNA
                                        </div>
                                        <div className="dna-info">
                                            <div className="info-row">
                                                <span>Tipografía Dominante</span>
                                                <span className="varko-title" style={{ fontSize: '1rem' }}>{brandDNA?.fonts?.join(', ') || 'Standard Sans'}</span>
                                            </div>
                                            <div className="info-row">
                                                <span>Paleta Detectada</span>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    {brandDNA?.colors?.map((c: string, i: number) => (
                                                        <div key={i} style={{ width: '20px', height: '20px', background: c, borderRadius: '2px', border: '1px solid rgba(255,255,255,0.1)' }} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="section-card" style={{ marginTop: '24px' }}>
                                        <div className="varko-label" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Activity size={14} color="var(--signal-green)" /> Metodología Varko
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                            Nuestros sensores han detectado {Object.values(tags).filter(t => !!t).length} señales positivas de madurez digital.
                                            La latencia actual de {duration}ms indica un {duration < 1000 ? 'alto' : 'bajo'} rendimiento de infraestructura base.
                                        </p>
                                    </div>
                                </div>

                                {/* Column 2: Predictive Insights & AI Summary */}
                                <div className="col" style={{ gridColumn: 'span 2' }}>
                                    {/* AI SUMMARY SECTION */}
                                    {aiNarrative && (
                                        <div className="section-card" style={{ marginBottom: '32px', borderLeft: '3px solid var(--signal-blue)', background: 'rgba(0,122,255,0.02)' }}>
                                            <div className="varko-label" style={{ marginBottom: '20px', fontSize: '0.65rem', opacity: 0.6, letterSpacing: '0.2em' }}>
                                                VARKO_INTELLIGENCE_AGENCY // ANALYSIS_SUMMARY
                                            </div>
                                            <h3 className="varko-title" style={{ fontSize: '1.6rem', marginBottom: '20px', background: 'linear-gradient(90deg, #fff 0%, #666 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                                {aiNarrative.headline}
                                            </h3>
                                            <p style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: '1.7', marginBottom: '24px', fontStyle: 'italic' }}>
                                                "{aiNarrative.summary}"
                                            </p>
                                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <span className="varko-label" style={{ fontSize: '0.6rem', color: 'var(--signal-blue)', marginBottom: '8px', display: 'block' }}>RECOMENDACIÓN TÁCTICA:</span>
                                                <span className="varko-mono" style={{ fontSize: '0.9rem', color: 'var(--signal-green)', fontWeight: 600 }}>
                                                    {aiNarrative.strategicRecommendation}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="section-card" style={{ height: 'auto', border: '1px solid var(--signal-blue-glow)' }}>

                                        <div className="varko-label" style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--signal-blue)' }}>
                                            <TrendingUp size={14} /> Proyección de Crecimiento (Varko Predict)
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                            {insights?.map((insight: any, i: number) => (
                                                <div key={i} className="insight-entry">
                                                    <div className="varko-mono" style={{ fontSize: '0.55rem', opacity: 0.4, textTransform: 'uppercase' }}>[{insight.category}]</div>
                                                    <div className="varko-title" style={{ fontSize: '1.1rem', margin: '4px 0' }}>{insight.label}</div>
                                                    <div style={{ color: 'var(--signal-blue)', fontSize: '1.5rem', fontWeight: 800 }}>{insight.estimatedGain}</div>
                                                    <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span className="varko-mono" style={{ fontSize: '0.5rem', padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>IMPACT: {insight.impact}</span>
                                                        <div style={{ display: 'flex', gap: '2px' }}>
                                                            {[1, 2, 3].map(s => (
                                                                <div key={s} style={{ width: '8px', height: '2px', background: s <= (insight.complexity === 'High' ? 3 : insight.complexity === 'Medium' ? 2 : 1) ? '#fff' : '#222' }} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="tactical-footer">
                                            <div className="varko-mono" style={{ fontSize: '0.65rem' }}>
                                                ESTIMATING_ANNUAL_IMPACT: <span style={{ color: 'var(--signal-green)' }}>REVENUE_BOOST_DETECTION_POSITIVE</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <footer className="briefing-footer">
                                <p className="varko-mono" style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', maxWidth: '600px' }}>
                                    Este documento es confidencial y solo para fines de consultoría de crecimiento.
                                    Los datos han sido validados por los protocolos de Varko Intelligence Agency.
                                </p>
                                <button onClick={() => window.print()} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Download size={14} /> Exportar como PDF
                                </button>
                            </footer>
                        </div>
                    </motion.main>
                )}
            </AnimatePresence>

            <style jsx>{`
                .briefing-container {
                    background: #000;
                    color: white;
                    min-height: 100vh;
                    font-family: 'Outfit', sans-serif;
                    position: relative;
                    overflow: hidden;
                }
                .ambient-glow {
                    position: fixed;
                    top: -10%;
                    left: 50%;
                    width: 50%;
                    height: 50%;
                    background: radial-gradient(circle, rgba(0, 122, 255, 0.05) 0%, transparent 70%);
                    filter: blur(100px);
                    z-index: 0;
                    pointer-events: none;
                }
                .lock-screen {
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                    position: relative;
                }
                .main-report {
                    display: flex;
                    min-height: 100vh;
                    z-index: 1;
                    position: relative;
                }
                .side-info {
                    width: 280px;
                    border-right: 1px solid rgba(255,255,255,0.05);
                    padding: 40px;
                    display: flex;
                    flex-direction: column;
                    background: rgba(255,255,255,0.01);
                }
                .report-content {
                    flex: 1;
                    padding: 80px 100px;
                    max-width: 1400px;
                }
                .score-circle {
                    width: 120px;
                    height: 120px;
                    border: 1px solid;
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    box-shadow: inset 0 0 20px rgba(255,255,255,0.02);
                }
                .grid-sections {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 32px;
                }
                .section-card {
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 12px;
                    padding: 32px;
                }
                .dna-info { display: flex; flexDirection: column; gap: 16px; }
                .info-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 12px; font-size: 0.8rem; }
                .insight-entry {
                    padding: 24px;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 8px;
                }
                .tactical-footer {
                    margin-top: 40px;
                    padding: 16px;
                    background: rgba(0, 122, 255, 0.05);
                    border-radius: 4px;
                    border-left: 2px solid var(--signal-blue);
                }
                .briefing-footer {
                    margin-top: 100px;
                    padding-top: 40px;
                    border-top: 1px solid rgba(255,255,255,0.05);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                @media print {
                    .side-info, .lock-screen, .briefing-footer button { display: none; }
                    .main-report { display: block; }
                    .report-content { padding: 40px; }
                    .briefing-container { background: white !important; color: black !important; }
                    .section-card { border: 1px solid #eee !important; background: white !important; }
                    .insight-entry { border: 1px solid #eee !important; background: #fafafa !important; }
                    .varko-title, .varko-label, .score-circle { color: black !important; border-color: black !important; }
                }
            `}</style>
        </div>
    );
}

export default function BriefingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BriefingContent />
        </Suspense>
    );
}

function Activity({ size, color, style }: any) {
    return <BarChart3 size={size} color={color} style={style} />;
}
