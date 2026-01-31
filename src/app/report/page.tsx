'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Printer, AlertCircle, CheckCircle2, XCircle, Search, Shield, Zap, Activity } from 'lucide-react';

export default function ReportPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSystem = async () => {
            const res = await fetch('/api/system');
            const json = await res.json();
            setData(json);
            setLoading(false);
        };
        fetchSystem();
    }, []);

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: 'white' }}>
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} className="varko-mono">
                    INITIATING_DIAGNOSIS_PROTOCOL...
                </motion.div>
            </div>
        );
    }

    if (!data || !data.lastScan) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000', color: 'white', textAlign: 'center' }}>
                <AlertCircle size={48} color="var(--signal-red)" style={{ marginBottom: '24px' }} />
                <h2 className="varko-title" style={{ fontSize: '1.5rem', marginBottom: '16px' }}>DATA_KERNEL_EMPTY</h2>
                <p className="varko-mono" style={{ fontSize: '0.8rem', color: '#666' }}>Run an Audit Scan before generating the briefing.</p>
            </div>
        );
    }

    const { lastScan, decisions } = data;
    const dateStr = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();

    return (
        <div className="report-root">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="report-paper">
                <header className="report-header">
                    <div className="header-top">
                        <div className="varko-title" style={{ fontSize: '2.5rem', letterSpacing: '-0.05em' }}>VARKO</div>
                        <div style={{ textAlign: 'right' }}>
                            <span className="varko-label" style={{ color: '#000' }}>Auth Code</span>
                            <div className="varko-mono" style={{ fontSize: '0.75rem', fontWeight: 600 }}>{Math.random().toString(36).substring(7).toUpperCase()} // {dateStr}</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '60px' }}>
                        <span className="varko-label" style={{ color: 'var(--signal-blue)', fontSize: '0.8rem' }}>Subject Identity Audit</span>
                        <h1 className="varko-title" style={{ fontSize: '4rem', color: '#000', wordBreak: 'break-all', margin: '12px 0 40px 0' }}>{lastScan.url}</h1>

                        <div style={{ display: 'flex', gap: '60px' }}>
                            <div className="stat-block">
                                <span className="varko-label" style={{ fontSize: '0.65rem' }}>Ecosystem Efficiency</span>
                                <span className="varko-title" style={{ fontSize: '2.5rem', display: 'block', color: getScoreColor(lastScan.score) }}>
                                    {lastScan.score}<span style={{ fontSize: '1rem', color: '#999' }}>/100</span>
                                </span>
                            </div>
                            <div className="stat-block">
                                <span className="varko-label" style={{ fontSize: '0.65rem' }}>Operating Status</span>
                                <span className="varko-title" style={{ fontSize: '2.5rem', display: 'block' }}>{lastScan.score > 60 ? 'STABLE' : 'CRITICAL'}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="report-section">
                    <h2 className="varko-label section-header">01. Executive System Diagnostics</h2>
                    <p className="executive-text">
                        The digital architecture of <strong>{lastScan.url}</strong> exhibits an efficiency coefficient of {lastScan.score}%.
                        {lastScan.score < 50
                            ? " We have identified critical infrastructure gaps and signal leakages that invalidate current growth projections."
                            : " The infrastructure core is performing within nominal parameters, allowing for high-velocity optimization cycles."}
                    </p>
                </section>

                <section className="report-section">
                    <h2 className="varko-label section-header">02. Infrastructure Layer Analysis</h2>
                    <div className="audit-grid">
                        <AuditBlock title="Data Intelligence" items={[
                            { label: 'Pixel Integrity', status: lastScan.tags.hasFBPixel },
                            { label: 'GA4 Core Logic', status: lastScan.tags.hasGA4 },
                            { label: 'Demand Signals', status: lastScan.tags.hasGAds },
                        ]} />
                        <AuditBlock title="Security & Trust" items={[
                            { label: 'SSL Integrity', status: lastScan.tags.isSecure },
                            { label: 'Metatag Social', status: lastScan.tags.hasOpenGraph },
                            { label: 'Legal Layer', status: lastScan.tags.hasPrivacyPolicy },
                        ]} />
                        <AuditBlock title="Retention Logic" items={[
                            { label: 'Lead Capturing', status: lastScan.tags.hasConversionForm },
                            { label: 'Behavioral Radar', status: lastScan.tags.hasHotjar },
                            { label: 'Email Automation', status: lastScan.tags.hasKlaviyo || lastScan.tags.hasMailchimp },
                        ]} />
                    </div>
                </section>

                <section className="report-section">
                    <h2 className="varko-label section-header">03. Matrix of Digital Laws (Precise Accuracy)</h2>
                    <div className="laws-matrix">
                        <LawRow law="Law of Signal Integrity" metric={lastScan.tags.hasGA4 && lastScan.tags.hasFBPixel ? 'Complete' : 'Fragmented'} verdict={lastScan.tags.hasGA4 && lastScan.tags.hasFBPixel ? 'STRENGTH' : 'LEAKAGE'} />
                        <LawRow law="Law of Friction" metric={lastScan.tags.hasConversionForm ? 'Negative' : 'Maximum'} verdict={lastScan.tags.hasConversionForm ? 'OPTIMAL' : 'BLOCKAGE'} />
                        <LawRow law="Law of Trust Architecture" metric={lastScan.tags.isSecure ? 'Verified' : 'Compromised'} verdict={lastScan.tags.isSecure ? 'STRENGTH' : 'CRITICAL'} />
                    </div>
                </section>


                <section className="report-section">
                    <h2 className="varko-label section-header">04. Blind Horizon: Blocked Strategic Units</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {decisions.filter((d: any) => d.status === 'a_ciegas').length === 0 ? (
                            <div className="varko-mono" style={{ fontSize: '0.8rem', color: '#999' }}>[NO_STRATEGIC_BLOCKS_DETECTED]</div>
                        ) : (
                            decisions.filter((d: any) => d.status === 'a_ciegas').map((d: any) => (
                                <div key={d.id} className="blocked-item">
                                    <div className="varko-title" style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{d.name}</div>
                                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '12px' }}>{d.description}</p>
                                    <div className="action-tag">CONTROL_ACTION: Implement {d.category} signals.</div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <footer className="report-footer">
                    <div className="varko-mono" style={{ fontSize: '0.65rem' }}>VARKO.SYSTEMS // CONFIDENTIAL_BRIEFING</div>
                    <div className="varko-title">VARKO</div>
                </footer>
            </motion.div>

            <button onClick={() => window.print()} className="print-fab">
                <Printer size={18} /> GENERATE BRIEFING PDF
            </button>

            <style jsx>{`
                .report-root { background: #111; min-height: 100vh; padding: 60px 20px; }
                .report-paper { 
                    background: white; max-width: 900px; margin: 0 auto; padding: 80px; 
                    color: #000; font-family: 'Inter', sans-serif;
                }
                .header-top { display: flex; justify-content: space-between; border-bottom: 4px solid #000; padding-bottom: 30px; }
                .stat-block { border-left: 3px solid #000; padding-left: 20px; }
                .section-header { border-bottom: 1px solid #eee; padding-bottom: 12px; margin-bottom: 24px; margin-top: 60px; font-size: 1rem; }
                .executive-text { font-size: 1.25rem; line-height: 1.6; color: #333; font-style: italic; }
                .audit-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
                .audit-block { border: 1px solid #000; padding: 20px; }
                .audit-item { display: flex; justify-content: space-between; font-size: 0.8rem; border-bottom: 1px solid #eee; padding: 8px 0; }
                .laws-matrix { border: 2px solid #000; }
                .law-row { border-bottom: 1px solid #eee; padding: 20px; display: grid; grid-template-columns: 1fr 1fr 1fr; }
                .blocked-item { padding: 20px; background: #fafafa; border-left: 4px solid var(--signal-red); }
                .action-tag { background: #fff; border: 1px dashed var(--signal-red); padding: 8px; font-size: 0.75rem; color: var(--signal-red); font-family: monospace; }
                .report-footer { margin-top: 80px; padding-top: 40px; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; color: #999; }
                .print-fab { 
                    position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%);
                    background: white; color: black; border: none; padding: 18px 36px;
                    border-radius: 100px; font-family: 'Outfit', sans-serif; font-weight: 800; cursor: pointer;
                    display: flex; gap: 10px; align-items: center; box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                }
                @media print {
                    .report-root { background: white; padding: 0; }
                    .report-paper { box-shadow: none; padding: 40px; }
                    .print-fab { display: none; }
                }
                .varko-title { font-family: 'Outfit', sans-serif; font-weight: 900; }
                .varko-label { font-family: 'Outfit', sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
                .varko-mono { font-family: 'monospace'; }
            `}</style>
        </div>
    );
}

function getScoreColor(score: number) {
    if (score > 70) return '#10b981';
    if (score > 40) return '#f59e0b';
    return '#ef4444';
}

function AuditBlock({ title, items }: any) {
    return (
        <div className="audit-block">
            <h5 className="varko-label" style={{ marginBottom: '16px', fontSize: '0.7rem' }}>{title}</h5>
            {items.map((item: any) => (
                <div key={item.label} className="audit-item">
                    <span className="varko-mono" style={{ color: '#666' }}>{item.label}</span>
                    <span className="varko-mono" style={{ fontWeight: 800, color: item.status ? '#10b981' : '#ef4444' }}>{item.status ? 'PASS' : 'FAIL'}</span>
                </div>
            ))}
        </div>
    );
}

function LawRow({ law, metric, verdict }: any) {
    const isGood = verdict === 'OPTIMAL' || verdict === 'LOW' || verdict === 'STRENGTH';
    return (
        <div className="law-row">
            <span className="varko-title" style={{ fontSize: '0.9rem' }}>{law}</span>
            <span className="varko-mono" style={{ fontSize: '0.8rem' }}>{metric}</span>
            <span className="varko-mono" style={{ fontSize: '0.75rem', fontWeight: 800, textAlign: 'right', color: isGood ? '#10b981' : '#ef4444' }}>[{verdict}]</span>
        </div>
    );
}
