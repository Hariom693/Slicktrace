// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';
import {
  Satellite, Ship, Activity, GitBranch, Shield, Database, Clock,
  AlertTriangle, ChevronRight, Radio, Waves, Globe, FileText,
  CheckCircle, ArrowRight, Zap, Eye, Target, TrendingUp
} from 'lucide-react';

const WORKFLOW_STEPS = [
  { n: 1, label: 'Multi-Source Data Acquisition', desc: 'Sentinel-1 SAR, ISRO EOS-06, Copernicus imagery + INCOIS / CMEMS / ERA5 ocean & met data', color: 'ocean' },
  { n: 2, label: 'SAR Pre-Processing Pipeline', desc: 'Calibration → Speckle Filter → Terrain Correction → Normalization (GDAL / OpenCV)', color: 'ocean' },
  { n: 3, label: 'AI-Based Oil Slick Detection', desc: 'U-Net / DeepLabv3+ semantic segmentation (PyTorch) — detects oil slick polygon on SAR image', color: 'teal' },
  { n: 4, label: 'Look-Alike Removal & Characterization', desc: 'Random Forest / XGBoost feature extraction removes natural look-alikes (biogenic films, wind shadows)', color: 'teal' },
  { n: 5, label: 'Backward Lagrangian Hindcast', desc: 'OpenDrift backward particle simulation traces slick to probable source region & time', color: 'amber' },
  { n: 6, label: 'AIS Track Integration', desc: 'Historical AIS vessel tracks cross-referenced with probable source region using GeoPandas / PostGIS', color: 'amber' },
  { n: 7, label: 'Explainable Vessel Attribution', desc: 'XGBoost + SHAP values rank candidate vessels. Evidence factors shown transparently.', color: 'red' },
  { n: 8, label: 'Forward Drift Prediction', desc: 'OpenDrift forward simulation predicts spill trajectory using CMEMS + ERA5 environmental data', color: 'green' },
  { n: 9, label: 'Decision-Support Dashboard', desc: 'Unified evidence, timeline, evidence locker and report generation for authorized analysts', color: 'green' },
];

const TECH_STACK = [
  { cat: 'AI / ML', items: ['PyTorch', 'U-Net', 'DeepLabv3+', 'OpenCV', 'Random Forest', 'XGBoost', 'SHAP'] },
  { cat: 'Satellite / EO', items: ['Sentinel-1 SAR', 'Sentinel-2 EO', 'ISRO EOS-06', 'Copernicus'] },
  { cat: 'Ocean Data', items: ['INCOIS', 'CMEMS', 'ERA5', 'OpenDrift'] },
  { cat: 'Geospatial', items: ['GDAL', 'GeoPandas', 'PostGIS', 'QGIS'] },
  { cat: 'Backend', items: ['FastAPI', 'Python', 'PostgreSQL'] },
  { cat: 'Application', items: ['React', 'Firebase Auth', 'Cloud Firestore', 'Firebase Storage'] },
];

const RISKS = [
  { risk: 'Late / missed detection', solution: 'Automated SAR detection via U-Net / DeepLabv3+' },
  { risk: 'Slow manual analysis', solution: 'AI-assisted rapid processing pipeline' },
  { risk: 'Difficult source tracing', solution: 'AIS-based vessel correlation + Lagrangian hindcast' },
  { risk: 'Scattered evidence', solution: 'Unified Evidence Locker & Timeline' },
];

const STRENGTHS = [
  'End-to-end integration of SAR imagery segmentation with OpenDrift Lagrangian hindcasting',
  'Explainable vessel attribution scoring using XGBoost and SHAP values',
  'Comprehensive use of open-source geospatial datasets: Sentinel, ISRO EOS-06, INCOIS, CMEMS, ERA5',
  'Unified Evidence Locker with tamper-evident architecture for future cryptographic hashing',
];

const AREAS_TO_IMPROVE = [
  'Vulnerability to dark vessels operating with disabled AIS transponders',
  'High computational requirements for real-time SAR processing and particle simulations',
  'Absence of explicit cybersecurity and role-based access control protocols (planned for v2)',
];

const FUTURE = [
  'Radar multispectral analysis for improved look-alike removal',
  'Anomaly detection algorithms for vessels lacking active AIS signals',
  'Optimized backend HPC processing for sub-hour alert generation',
  'Role-based access control and cryptographic evidence hashing',
];

function WorkflowStep({ step, idx }) {
  const colorMap = { ocean: '#0ea5e9', teal: '#14b8a6', amber: '#f59e0b', red: '#ef4444', green: '#22c55e' };
  const color = colorMap[step.color];
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%', background: `rgba(${color === '#ef4444' ? '239,68,68' : color === '#14b8a6' ? '20,184,166' : color === '#0ea5e9' ? '14,165,233' : color === '#f59e0b' ? '245,158,11' : '34,197,94'},0.15)`,
          border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.8rem', fontWeight: 700, color, flexShrink: 0
        }}>{step.n}</div>
        {idx < WORKFLOW_STEPS.length - 1 && (
          <div style={{ width: 2, height: 40, background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
        )}
      </div>
      <div style={{ paddingBottom: idx < WORKFLOW_STEPS.length - 1 ? 24 : 0 }}>
        <div style={{ fontWeight: 600, color: '#e8f1ff', fontSize: '0.95rem', marginBottom: 4 }}>{step.label}</div>
        <div style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>{step.desc}</div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div style={{ background: '#030d1a', minHeight: '100vh', color: '#e8f1ff', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Top Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(3,13,26,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 40px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #0d9488, #0369a1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}><Radio size={16} color="white" /></div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff', letterSpacing: '0.02em' }}>SlickTrace</div>
            <div style={{ fontSize: '0.58rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI-Powered Oil Spill Detection</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', letterSpacing: '0.04em' }}>
            PS-26143 · SNPSU Infinova · SIH 2026
          </span>
          <Link to="/login">
            <button style={{
              background: '#0d9488', color: '#fff', border: 'none', borderRadius: 8,
              padding: '8px 20px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer'
            }}>Access Dashboard →</button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', textAlign: 'center',
        background: 'linear-gradient(180deg, #030d1a 0%, #071525 60%, #030d1a 100%)',
        position: 'relative', padding: '60px 40px', overflow: 'hidden'
      }}>
        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(rgba(20,184,166,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.8) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          pointerEvents: 'none'
        }} />
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 600, height: 400,
          background: 'radial-gradient(ellipse, rgba(20,184,166,0.06) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{ position: 'relative', maxWidth: 820 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px',
            background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.25)',
            borderRadius: 999, marginBottom: 28, fontSize: '0.75rem', color: '#2dd4bf',
            fontWeight: 600, letterSpacing: '0.06em'
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#14b8a6' }} />
            SMART INDIA HACKATHON 2026 · DISASTER MANAGEMENT · PS-26143
          </div>
          <h1 style={{
            fontSize: 'clamp(2.4rem, 6vw, 4rem)', fontWeight: 800, lineHeight: 1.1,
            color: '#fff', marginBottom: 20, letterSpacing: '-0.02em'
          }}>
            <span style={{ color: '#2dd4bf' }}>Slick</span>Trace
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.3rem)', fontWeight: 600,
            color: '#94a3b8', marginBottom: 12, letterSpacing: '0.02em'
          }}>
            AI-Powered Oil Spill Detection &amp; Traceability
          </p>
          <p style={{
            fontSize: '1rem', color: '#64748b', marginBottom: 40, maxWidth: 600, margin: '0 auto 40px'
          }}>
            Detect Earlier → Respond Faster → Reduce Damage → Improve Accountability
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login">
              <button style={{
                background: 'linear-gradient(135deg, #0d9488, #0369a1)', color: '#fff',
                border: 'none', borderRadius: 10, padding: '13px 32px',
                fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8
              }}>
                <Zap size={16} /> Launch Dashboard
              </button>
            </Link>
            <a href="#workflow">
              <button style={{
                background: 'rgba(255,255,255,0.06)', color: '#cbd5e1',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '13px 32px',
                fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8
              }}>
                <Eye size={16} /> How It Works
              </button>
            </a>
          </div>
        </div>

        {/* Flow diagram below hero */}
        <div style={{ marginTop: 80, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          {['SAR Satellite Image', 'AI Detection', 'AIS Correlation', 'Drift Prediction', 'Attribution'].map((label, i, arr) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                padding: '8px 18px', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
                fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500
              }}>{label}</div>
              {i < arr.length - 1 && <ArrowRight size={14} color="#14b8a6" />}
            </div>
          ))}
        </div>
      </section>

      {/* Problem & Solution */}
      <section style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>THE CHALLENGE</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>Problem vs Solution</h2>
          <p style={{ color: '#64748b', marginTop: 8 }}>Addressing the gaps in oil spill monitoring and response</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {RISKS.map(r => (
            <div key={r.risk} style={{
              background: '#0d1f38', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: 24
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <AlertTriangle size={14} color="#ef4444" />
                <span style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Risk</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 600, marginBottom: 16 }}>{r.risk}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <CheckCircle size={14} color="#14b8a6" />
                <span style={{ fontSize: '0.78rem', color: '#14b8a6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>SlickTrace Solution</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{r.solution}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" style={{ padding: '80px 40px', background: 'rgba(10,22,40,0.5)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>SYSTEM ARCHITECTURE</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>How SlickTrace Works</h2>
            <p style={{ color: '#64748b', marginTop: 8, maxWidth: 600, margin: '8px auto 0' }}>
              A complete end-to-end pipeline from satellite acquisition to evidence-based vessel attribution
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 60px' }}>
            <div>{WORKFLOW_STEPS.slice(0, 5).map((s, i) => <WorkflowStep key={s.n} step={s} idx={i} />)}</div>
            <div>{WORKFLOW_STEPS.slice(5).map((s, i) => <WorkflowStep key={s.n} step={s} idx={i} />)}</div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>TECHNOLOGY STACK</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>Built on Proven Technologies</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {TECH_STACK.map(t => (
            <div key={t.cat} style={{
              background: '#0d1f38', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: 20
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{t.cat}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {t.items.map(item => (
                  <span key={item} style={{
                    padding: '3px 10px', borderRadius: 999,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '0.75rem', color: '#cbd5e1', fontFamily: 'monospace'
                  }}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Attribution explainer */}
      <section style={{ padding: '80px 40px', background: 'rgba(10,22,40,0.5)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>EXPLAINABLE AI</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: 16 }}>Transparent Vessel Attribution</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 24 }}>
              SlickTrace uses XGBoost and SHAP (SHapley Additive exPlanations) to produce transparent,
              explainable vessel attribution scores. Every factor is shown to the analyst — not just a number.
            </p>
            <div style={{ padding: 14, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>
              ⚠️ SlickTrace provides analytical decision support. Vessel attribution is analytical and must be verified by authorized authorities before any legal or enforcement action.
            </div>
          </div>
          <div style={{ background: '#0d1f38', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 24 }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 16, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>SHAP Attribution Factors</div>
            {[
              { label: 'AIS Proximity to Source', val: 0.92, color: '#ef4444' },
              { label: 'Temporal Overlap', val: 0.88, color: '#f59e0b' },
              { label: 'Source Region Overlap', val: 0.91, color: '#ef4444' },
              { label: 'Track Consistency', val: 0.84, color: '#f59e0b' },
              { label: 'Drift Consistency', val: 0.86, color: '#14b8a6' },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{f.label}</span>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: f.color }}>{(f.val * 100).toFixed(0)}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${f.val * 100}%`, background: f.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16, padding: '8px 12px', background: 'rgba(239,68,68,0.08)', borderRadius: 6 }}>
              <div style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 700, marginBottom: 2 }}>STATUS: POTENTIAL RESPONSIBLE VESSEL</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Analytical priority — not legal attribution</div>
            </div>
          </div>
        </div>
      </section>

      {/* Strengths & Limitations */}
      <section style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32 }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>Key Strengths</div>
            {STRENGTHS.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <CheckCircle size={15} color="#14b8a6" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>Current Limitations</div>
            {AREAS_TO_IMPROVE.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <AlertTriangle size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>Future Roadmap</div>
            {FUTURE.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <TrendingUp size={15} color="#0ea5e9" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 40px', textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(13,148,136,0.08), rgba(3,105,161,0.08))',
        borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: 12 }}>
          Ready to analyze an incident?
        </h2>
        <p style={{ color: '#64748b', marginBottom: 32 }}>Access the SlickTrace Decision-Support Dashboard</p>
        <Link to="/login">
          <button style={{
            background: 'linear-gradient(135deg, #0d9488, #0369a1)', color: '#fff',
            border: 'none', borderRadius: 10, padding: '14px 40px',
            fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 10
          }}>
            <Shield size={18} /> Access Dashboard <ChevronRight size={16} />
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px 40px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg, #0d9488, #0369a1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Radio size={12} color="white" />
          </div>
          <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>SlickTrace</span>
          <span style={{ fontSize: '0.72rem', color: '#334155', marginLeft: 8 }}>SNPSU Infinova · Team ID: SNPSU0178 · SIH 2026</span>
        </div>
        <div style={{ fontSize: '0.72rem', color: '#334155', maxWidth: 500, textAlign: 'right', fontStyle: 'italic' }}>
          Prototype demonstration — data shown may be simulated and is not a live operational feed.
          SlickTrace provides analytical decision support only.
        </div>
      </footer>
    </div>
  );
}
