// src/pages/AttributionPage.jsx
import { useState } from 'react';
import { UserCheck, AlertTriangle, BarChart2, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { DEMO_VESSELS, DEMO_ATTRIBUTIONS } from '../data/demoData';

const FACTOR_LABELS = {
  aisProximity: 'AIS Proximity to Source Region',
  temporalOverlap: 'Temporal Overlap with Spill Estimate',
  sourceRegionOverlap: 'Source Region Overlap',
  trackConsistency: 'AIS Track Consistency',
  driftConsistency: 'Drift Model Consistency',
  historicalTrack: 'Historical Track Correlation',
};

function ShapBar({ label, value, max = 1 }) {
  const pct = Math.round((value / max) * 100);
  const color = value > 0.8 ? '#ef4444' : value > 0.6 ? '#f59e0b' : '#14b8a6';
  return (
    <div className="shap-bar-row">
      <span className="shap-bar-label" style={{ width: 220 }}>{label}</span>
      <div className="shap-bar-track">
        <div className="shap-bar-fill" style={{ width: `${pct}%`, background: `linear-gradient(to right, ${color}88, ${color})` }} />
      </div>
      <span className="shap-bar-value" style={{ color }}>{pct}%</span>
    </div>
  );
}

function VesselRankRow({ rank, vessel, attribution }) {
  const [expanded, setExpanded] = useState(false);
  const isHighPriority = vessel.attributionStatus === 'High Priority';
  const isMedium = vessel.attributionStatus === 'Medium Priority';
  const statusLabel = attribution ? attribution.status : 'Under Analysis';

  return (
    <>
      <tr
        style={{ cursor: 'pointer', background: expanded ? 'rgba(20,184,166,0.05)' : '' }}
        onClick={() => setExpanded(e => !e)}
      >
        <td>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: rank === 1 ? 'rgba(239,68,68,0.15)' : rank === 2 ? 'rgba(245,158,11,0.15)' : 'rgba(148,163,184,0.1)', border: `1.5px solid ${rank === 1 ? '#ef4444' : rank === 2 ? '#f59e0b' : '#64748b'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, color: rank === 1 ? '#ef4444' : rank === 2 ? '#f59e0b' : '#94a3b8' }}>
            {rank}
          </div>
        </td>
        <td style={{ fontWeight: 700, color: '#e8f1ff' }}>{vessel.name}</td>
        <td><span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#64748b' }}>{vessel.mmsi}</span></td>
        <td>{vessel.type}</td>
        <td>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(attribution?.factors?.aisProximity || 0.3) * 100}%`, background: isHighPriority ? '#ef4444' : isMedium ? '#f59e0b' : '#14b8a6' }} />
            </div>
            <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', width: 32 }}>{Math.round((attribution?.factors?.aisProximity || 0.3) * 100)}%</span>
          </div>
        </td>
        <td>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(attribution?.factors?.sourceRegionOverlap || 0.2) * 100}%`, background: isHighPriority ? '#ef4444' : isMedium ? '#f59e0b' : '#14b8a6' }} />
            </div>
            <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', width: 32 }}>{Math.round((attribution?.factors?.sourceRegionOverlap || 0.2) * 100)}%</span>
          </div>
        </td>
        <td>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(attribution?.factors?.temporalOverlap || 0.2) * 100}%`, background: isHighPriority ? '#ef4444' : isMedium ? '#f59e0b' : '#14b8a6' }} />
            </div>
            <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', width: 32 }}>{Math.round((attribution?.factors?.temporalOverlap || 0.2) * 100)}%</span>
          </div>
        </td>
        <td>
          <span className={`badge ${isHighPriority ? 'badge-red' : isMedium ? 'badge-amber' : 'badge-teal'}`}>{statusLabel}</span>
        </td>
        <td style={{ color: '#64748b' }}>{expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</td>
      </tr>
      {expanded && attribution && (
        <tr>
          <td colSpan={9} style={{ padding: 0 }}>
            <div style={{ padding: '16px 24px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>SHAP Evidence Factors</div>
                  {Object.entries(attribution.factors).map(([key, val]) => (
                    <ShapBar key={key} label={FACTOR_LABELS[key] || key} value={val} />
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Why This Vessel Was Flagged</div>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: 12 }}>{attribution.shapExplanation}</p>
                  <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic' }}>
                    ⚠️ Potential attribution based on available evidence. SlickTrace has not legally proven that this vessel caused the spill.
                    Verify with authorized authorities before any enforcement or legal action.
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AttributionPage() {
  const [activeTab, setActiveTab] = useState('ranking');
  const primaryAttr = DEMO_ATTRIBUTIONS[0];

  return (
    <div>
      <div className="demo-banner">
        ⚠️ DEMO DATA — Vessel attribution scores are simulated. XGBoost + SHAP results shown for demonstration only.
      </div>

      <div className="page-header">
        <h1>Explainable Vessel Attribution</h1>
        <p>XGBoost scoring · SHAP explainability · Analytical vessel ranking — NOT legal attribution</p>
      </div>

      {/* Disclaimer banner */}
      <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, marginBottom: 24, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f87171', marginBottom: 4 }}>Important — Analytical Decision Support Only</div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.6 }}>
            SlickTrace uses XGBoost and SHAP to rank vessels by analytical evidence score.
            Terms like "Potential Responsible Vessel" and "Suspect Vessel" reflect analytical priority — not legal guilt.
            Attribution must be verified by authorized maritime and environmental authorities before any legal or enforcement action.
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[
          { id: 'ranking', label: 'Potential Vessel Ranking' },
          { id: 'primary', label: 'Primary Suspect Analysis' },
          { id: 'methodology', label: 'Methodology' },
        ].map(t => (
          <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'ranking' && (
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <UserCheck size={14} color="var(--amber-500)" />
              <span className="card-title">Potential Vessel Ranking — INC-2026-0142</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="badge badge-demo">DEMO DATA</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Model: XGBoost + SHAP</span>
            </div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Vessel Name</th>
                  <th>MMSI</th>
                  <th>Type</th>
                  <th>AIS Match</th>
                  <th>Spatial Match</th>
                  <th>Temporal Match</th>
                  <th>Attribution Risk</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {DEMO_VESSELS.map((v, i) => {
                  const attr = DEMO_ATTRIBUTIONS.find(a => a.vesselId === v.vesselId);
                  return <VesselRankRow key={v.vesselId} rank={i + 1} vessel={v} attribution={attr} />;
                })}
                {/* Third vessel without formal attribution */}
                <VesselRankRow
                  rank={3}
                  vessel={DEMO_VESSELS[2]}
                  attribution={{
                    vesselId: 'VSL-003', status: 'Low Priority',
                    factors: { aisProximity: 0.28, temporalOverlap: 0.32, sourceRegionOverlap: 0.25, trackConsistency: 0.3, driftConsistency: 0.28, historicalTrack: 0.22 },
                    shapExplanation: 'MT OCEAN PRIME was operating at a distance beyond the probable source region radius. Spatial and temporal correlation scores are low. AIS gap detected but location does not intersect source region.'
                  }}
                />
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 16, padding: '8px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 6, fontSize: '0.72rem', color: '#334155' }}>
            * "Attribution Risk / Analytical Priority" — not legal guilt. Scores based on XGBoost model with SHAP explainability.
            Click a row to expand evidence factors.
          </div>
        </div>
      )}

      {activeTab === 'primary' && primaryAttr && (
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <UserCheck size={14} color="var(--red-500)" />
                <span className="card-title">Primary: MT ARABIAN STAR</span>
              </div>
              <span className="badge badge-red">Potential Responsible Vessel</span>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>SHAP Evidence Factors</div>
              {Object.entries(primaryAttr.factors).map(([key, val]) => (
                <ShapBar key={key} label={FACTOR_LABELS[key] || key} value={val} />
              ))}
            </div>
            <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ef4444', marginBottom: 4 }}>ATTRIBUTION SCORE: {Math.round(primaryAttr.score * 100)}%</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Analytical priority — not legal proof</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Info size={14} color="var(--ocean-500)" />
                <span className="card-title">Why This Vessel Was Flagged</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.8, marginBottom: 20 }}>
              {primaryAttr.shapExplanation}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Vessel Type', value: 'Oil Tanker (high-risk category)', highlight: true },
                { label: 'AIS Gap Duration', value: '42 minutes near source region', highlight: true },
                { label: 'Distance from Source', value: '8.7 km at T-06:42', highlight: true },
                { label: 'Flag State', value: 'Panama' },
                { label: 'Track Intersection', value: 'Backward hindcast source region' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 8 }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.label}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: item.highlight ? '#f87171' : '#94a3b8' }}>{item.value}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 14px', background: 'rgba(14,165,233,0.06)', borderLeft: '3px solid #0369a1', borderRadius: '0 6px 6px 0', fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic' }}>
              Potential attribution based on available satellite, AIS and drift evidence.
              SlickTrace does not determine legal responsibility. Verification by authorized authorities is required.
            </div>
          </div>
        </div>
      )}

      {activeTab === 'methodology' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BarChart2 size={14} color="var(--teal-500)" />
                <span className="card-title">Attribution Methodology</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.7 }}>
              <div>
                <div style={{ fontWeight: 700, color: '#e8f1ff', marginBottom: 4 }}>1. Feature Engineering</div>
                <p>For each candidate vessel, spatial and temporal features are computed: distance from probable source region, time overlap with estimated spill window, AIS continuity, drift model consistency.</p>
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#e8f1ff', marginBottom: 4 }}>2. XGBoost Scoring</div>
                <p>An XGBoost gradient-boosted classifier trained on historical confirmed oil spill cases scores each vessel across multiple evidence dimensions simultaneously.</p>
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#e8f1ff', marginBottom: 4 }}>3. SHAP Explainability</div>
                <p>SHAP (SHapley Additive exPlanations) values decompose each vessel's score into individual feature contributions, making the analysis transparent and auditable.</p>
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#e8f1ff', marginBottom: 4 }}>4. Analyst Review</div>
                <p>Ranked vessels and SHAP factors are presented to authorized analysts. The system supports — but does not replace — human judgement and authority verification.</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Feature Importance (Demo)</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
              {[
                { feature: 'AIS Proximity to Hindcast Source', importance: 0.28, color: '#ef4444' },
                { feature: 'Source Region Overlap', importance: 0.24, color: '#f59e0b' },
                { feature: 'Temporal Overlap', importance: 0.21, color: '#f59e0b' },
                { feature: 'Drift Model Consistency', importance: 0.15, color: '#14b8a6' },
                { feature: 'AIS Gap Detected', importance: 0.08, color: '#0ea5e9' },
                { feature: 'Historical Track Match', importance: 0.04, color: '#94a3b8' },
              ].map(f => (
                <div key={f.feature}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{f.feature}</span>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: f.color }}>{(f.importance * 100).toFixed(0)}%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${f.importance * 100}%`, background: f.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, fontSize: '0.72rem', color: '#64748b' }}>
              Feature importance derived from XGBoost model trained on historical spill-vessel correlation data.
              SHAP values shown are per-vessel marginal contributions.
            </div>
          </div>
        </div>
      )}

      <div className="disclaimer">
        SlickTrace provides analytical decision support based on available satellite, environmental and AIS data.
        Vessel attribution is analytical and should be verified by authorized authorities before enforcement or legal action.
      </div>
    </div>
  );
}
