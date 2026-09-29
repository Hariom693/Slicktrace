// src/pages/TimelinePage.jsx
import { Clock, Satellite, Ship, Waves, Activity, FileText, Database, MapPin } from 'lucide-react';
import { DEMO_TIMELINE } from '../data/demoData';

const iconMap = {
  'OpenDrift': <Waves size={12} />,
  'Sentinel-1 SAR': <Satellite size={12} />,
  'AIS': <Ship size={12} />,
  'XGBoost': <Activity size={12} />,
  'GDAL': <Database size={12} />,
  'SlickTrace': <FileText size={12} />,
};

function getIcon(source) {
  for (const [key, icon] of Object.entries(iconMap)) {
    if (source.includes(key)) return icon;
  }
  return <Clock size={12} />;
}

function getColor(event) {
  if (event.includes('Detected') || event.includes('Oil Slick')) return '#ef4444';
  if (event.includes('Hindcast') || event.includes('Source Region')) return '#f59e0b';
  if (event.includes('AIS') || event.includes('Vessel')) return '#0ea5e9';
  if (event.includes('Forward') || event.includes('Drift')) return '#22c55e';
  if (event.includes('Attribution')) return '#a78bfa';
  if (event.includes('Report')) return '#94a3b8';
  return '#14b8a6';
}

export default function TimelinePage() {
  return (
    <div>
      <div className="demo-banner">
        ⚠️ DEMO DATA — Timeline events shown are simulated for incident INC-2026-0142.
        Not a live operational feed.
      </div>

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Unified Evidence & Timeline</h1>
          <p>Complete chronological record — INC-2026-0142 · Arabian Sea · 2026-09-26</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge badge-red" style={{ alignSelf: 'center' }}>Active Incident</span>
          <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#14b8a6', alignSelf: 'center' }}>INC-2026-0142</span>
        </div>
      </div>

      {/* Incident summary header */}
      <div className="card" style={{ marginBottom: 28, borderLeft: '3px solid var(--red-500)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 20 }}>
          {[
            { label: 'Incident ID', value: 'INC-2026-0142' },
            { label: 'Detection Time', value: '2026-09-26 08:32 UTC' },
            { label: 'Location', value: '19.4°N, 68.2°E' },
            { label: 'Spill Area', value: '47.3 km²' },
            { label: 'Satellite Source', value: 'Sentinel-1 SAR' },
            { label: 'Primary Suspect', value: 'MT ARABIAN STAR' },
            { label: 'Attribution Score', value: '87% (Potential)' },
            { label: 'Status', value: 'Active — Under Analysis' },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: '0.62rem', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e8f1ff' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={14} color="var(--teal-500)" />
            <span className="card-title">Event Timeline</span>
          </div>
          <span className="badge badge-demo">DEMO DATA</span>
        </div>

        <div className="timeline">
          {DEMO_TIMELINE.map((event, index) => {
            const color = getColor(event.event);
            const isT0 = event.time.includes('T 0') || event.time === 'T0';
            return (
              <div key={index} className="timeline-item">
                <div className="timeline-dot" style={{ borderColor: color, background: isT0 ? color : 'var(--navy-800)' }}>
                  <div style={{ color: isT0 ? '#fff' : color }}>{getIcon(event.source)}</div>
                </div>
                <div style={{ background: isT0 ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isT0 ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)'}`, borderRadius: 8, padding: 14 }}>
                  <div className="timeline-time" style={{ color }}>{event.label}</div>
                  <div className="timeline-event">{event.event}</div>
                  <div className="timeline-desc">{event.description}</div>
                  <div className="timeline-meta">
                    <div className="timeline-meta-item">
                      <Satellite size={11} />
                      <span>Source: {event.source}</span>
                    </div>
                    <div className="timeline-meta-item">
                      <MapPin size={11} />
                      <span>{event.location}</span>
                    </div>
                    {isT0 && (
                      <span className="badge badge-red" style={{ fontSize: '0.6rem' }}>T0 — DETECTION EVENT</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Evidence chain summary */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <span className="card-title">Evidence Chain Summary</span>
        </div>
        <div style={{ display: 'flex', overflowX: 'auto', gap: 0, paddingBottom: 4 }}>
          {[
            { phase: 'Pre-Detection', color: '#f59e0b', items: ['ERA5 / CMEMS data acquired', 'OpenDrift backward simulation', 'Probable source: 19.2°N, 68.6°E'] },
            { phase: 'Detection (T0)', color: '#ef4444', items: ['Sentinel-1 SAR acquired', 'U-Net detection: 47.3 km²', 'Georeferenced slick polygon'] },
            { phase: 'AIS Correlation', color: '#0ea5e9', items: ['3 vessels cross-referenced', 'MT ARABIAN STAR: 8.7 km from source', 'AIS gap detected near T-6h'] },
            { phase: 'Attribution', color: '#a78bfa', items: ['XGBoost scored 3 vessels', 'SHAP explainability generated', 'MT ARABIAN STAR: 87% score'] },
            { phase: 'Forward Drift', color: '#22c55e', items: ['OpenDrift forward simulation', '48h trajectory computed', 'Predicted NW drift: ~1.2 km/h'] },
            { phase: 'Report', color: '#94a3b8', items: ['Evidence locker sealed', 'Incident report generated', 'Forwarded to INCOIS / Coast Guard'] },
          ].map((phase, i) => (
            <div key={phase.phase} style={{ minWidth: 200, borderRight: '1px solid rgba(255,255,255,0.06)', padding: 16, flexShrink: 0 }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: phase.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                Phase {i + 1}: {phase.phase}
              </div>
              {phase.items.map(item => (
                <div key={item} style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 6, display: 'flex', gap: 6 }}>
                  <span style={{ color: phase.color, flexShrink: 0 }}>›</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="disclaimer">
        Unified Evidence & Timeline based on simulated incident data.
        In production, all events are automatically logged from integrated data pipelines and stored in Firestore / PostGIS.
      </div>
    </div>
  );
}
