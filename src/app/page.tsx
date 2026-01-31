'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DecisionCard } from '@/components/DecisionCard';
import { ScannerPanel } from '@/components/ScannerPanel';
import { ComparisonPanel } from '@/components/ComparisonPanel';
import { DecisionWithSignals } from '@/types';
import { Plus, RotateCcw, Activity, ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';

interface SystemState {
  decisions: DecisionWithSignals[];
  stats: {
    blind: number;
    partial: number;
    clear: number;
    total: number;
  };
  recentEvents: any[];
}

export default function Home() {
  const [data, setData] = useState<SystemState | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCat, setNewCat] = useState('activación');

  const fetchSystem = async (newState?: any) => {
    if (newState) {
      setData(newState);
      return;
    }
    try {
      const res = await fetch('/api/system');
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystem();
  }, []);


  const simulateEvent = async (eventName: string, val?: number) => {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: eventName, value: val })
    });
    fetchSystem();
  };

  const handleCreateDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTitle,
          description: newDesc,
          category: newCat,
          requiredSignalIds: ['sig_tech_tracking'],
          affectedFlowIds: ['flow_acquisition']
        })
      });
      setShowModal(false);
      setNewTitle('');
      setNewDesc('');
      fetchSystem();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-dark)', color: 'var(--text-secondary)'
      }}>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="varko-mono"
          style={{ fontSize: '0.8rem', letterSpacing: '0.2em' }}
        >
          CORE_VARKO_LOADING...
        </motion.div>
      </div>
    );
  }

  if (!data) return <div className="container">Error en el acceso al Kernel.</div>;

  const { decisions, stats } = data;

  return (
    <main className="container animate-fade">
      <header style={{ marginBottom: '80px' }}>
        <div
          className="varko-flex-res"
          style={{
            marginBottom: '64px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '32px'
          }}
        >
          <div>
            <span className="varko-label" style={{ color: 'var(--signal-blue)', marginBottom: '12px', display: 'block' }}>
              Operational System
            </span>
            <h1 className="varko-title" style={{ fontSize: '3.5rem', textTransform: 'uppercase' }}>
              Varko <span style={{ color: 'var(--text-tertiary)' }}>MVP</span>
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px' }} className="varko-mono">
              Control Layer for Strategic Decision Intelligence
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '350px', justifyContent: 'flex-end' }} className="mobile-full-width">
            <button
              onClick={async () => {
                if (confirm('¿Restablecer el Kernel del sistema?')) {
                  await fetch('/api/system/reset', { method: 'POST' });
                  window.location.reload();
                }
              }}
              className="btn-ghost"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--signal-red)', borderColor: 'rgba(255, 59, 48, 0.2)', flex: 1, justifyContent: 'center' }}
            >
              <RotateCcw size={14} /> Reset
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center' }}
            >
              <Plus size={16} /> New Decision
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '48px' }}>
          <ScannerPanel onScanComplete={fetchSystem} />
        </div>

        <div style={{ marginBottom: '64px' }}>
          <ComparisonPanel />
        </div>

        {/* Dynamic Stats Grid */}
        <div className="varko-grid" style={{ '--grid-cols': 4 } as any}>

          {(() => {
            const integrity = Math.round(((stats.clear + stats.partial * 0.5) / (stats.total || 1)) * 100);
            return (
              <StatCard
                label="Integrity Score"
                value={`${integrity}%`}
                icon={<ShieldCheck size={20} />}
                color={integrity > 70 ? 'var(--signal-green)' : integrity > 30 ? 'var(--signal-orange)' : 'var(--signal-red)'}
              />
            );
          })()}
          <StatCard
            label="Blind Zones"
            value={stats.blind}
            color="var(--signal-red)"
            icon={<AlertCircle size={20} />}
            highlight={stats.blind > 0}
          />

          <StatCard
            label="Partial Data"
            value={stats.partial}
            color="var(--signal-orange)"
            icon={<Activity size={20} />}
          />
          <StatCard
            label="Total Logic Units"
            value={stats.total}
            icon={<HelpCircle size={20} />}
          />
        </div>
      </header>

      <section>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '32px', paddingLeft: '4px'
        }}>
          <div>
            <h2 className="varko-title" style={{ fontSize: '1.5rem' }}>Active Decision Map</h2>
            <span className="varko-mono" style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
              PRIORITY_QUEUE_SORTED_BY_CRITICALITY
            </span>
          </div>
        </div>

        <div className="varko-grid">
          {decisions.sort((a, b) => {
            const order = { 'a_ciegas': 0, 'parcial': 1, 'clara': 2 };
            return order[a.status] - order[b.status];
          }).map((d, i) => (
            <DecisionCard key={d.id} decision={d} />
          ))}
        </div>
      </section>

      {/* Footer System Info */}
      <footer style={{
        marginTop: '120px', padding: '64px 0', borderTop: '1px solid var(--border-subtle)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <span className="varko-title" style={{ fontSize: '1.2rem', letterSpacing: '-0.02em' }}>VARKO</span>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '8px' }} className="varko-mono">
            &copy; 2026 VARKO.SYSTEMS / ALPHA_RELEASE_BUILD_01
          </p>
        </div>
        <div style={{ display: 'flex', gap: '32px' }} className="varko-mono">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="varko-label">Stability</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--signal-green)' }}>OPERATIONAL</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="varko-label">Events</span>
            <span style={{ fontSize: '0.75rem' }}>{data.recentEvents.length} Captured</span>
          </div>
        </div>
      </footer>

      {/* Premium Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, backdropFilter: 'blur(20px)'
            }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel"
              style={{ width: '100%', maxWidth: '500px', padding: '40px' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ marginBottom: '32px' }}>
                <span className="varko-label" style={{ color: 'var(--signal-blue)' }}>Kernel Entry</span>
                <h3 className="varko-title" style={{ fontSize: '1.75rem' }}>Create Decision Unit</h3>
              </div>

              <form onSubmit={handleCreateDecision} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="varko-label">Identification</label>
                  <input
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="Decision Key Title"
                    style={{
                      background: 'var(--bg-surface)', border: '1px solid var(--border-medium)',
                      color: 'white', padding: '14px', borderRadius: '4px', fontSize: '0.9rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="varko-label">Logic Hypothesis</label>
                  <textarea
                    required
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    placeholder="Describe the expected impact..."
                    style={{
                      background: 'var(--bg-surface)', border: '1px solid var(--border-medium)',
                      color: 'white', padding: '14px', borderRadius: '4px', minHeight: '100px',
                      fontSize: '0.9rem', fontFamily: 'inherit', resize: 'none'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="varko-label">Domain Category</label>
                  <select
                    value={newCat}
                    onChange={e => setNewCat(e.target.value)}
                    style={{
                      background: 'var(--bg-surface)', border: '1px solid var(--border-medium)',
                      color: 'white', padding: '14px', borderRadius: '4px',
                      fontSize: '0.9rem', fontFamily: 'inherit'
                    }}
                  >
                    <option value="pricing">ST_PRICING</option>
                    <option value="conversión">ST_CONVERSION</option>
                    <option value="activación">ST_ACTIVATION</option>
                    <option value="retención">ST_RETENTION</option>
                    <option value="escalado">ST_SCALING</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '16px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-ghost" style={{ border: 'none' }}>Cancel</button>
                  <button type="submit" className="btn-primary">Execute Entry</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function StatCard({ label, value, color, icon, highlight }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="glass-panel"
      style={{
        padding: '24px',
        borderLeft: highlight ? `2px solid ${color}` : undefined,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '140px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span className="varko-label">{label}</span>
        <div style={{ color: color || 'var(--text-tertiary)' }}>{icon}</div>
      </div>
      <span className="varko-title" style={{ fontSize: '2.5rem', color: color || 'var(--text-primary)' }}>
        {value}
      </span>
    </motion.div>
  )
}
