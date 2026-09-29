// src/pages/EvidenceLockPage.jsx
import { useState } from 'react';
import { Archive, Satellite, Ship, Activity, Waves, FileText, MapPin, Database, Shield, Download } from 'lucide-react';
import { DEMO_EVIDENCE } from '../data/demoData';

const EVIDENCE_ICON_MAP = {
  'Satellite Image': { icon: Satellite, cls: 'satellite' },
  'Detected Slick Polygon': { icon: MapPin, cls: 'polygon' },
  'AIS Track': { icon: Ship, cls: 'track' },
  'Backward Hindcast Result': { icon: Waves, cls: 'drift' },
  'Attribution Analysis': { icon: Activity, cls: 'attribution' },
  'Forward Drift Prediction': { icon: Waves, cls: 'drift' },
  'Generated Report': { icon: FileText, cls: 'report' },
};

const ALL_EVIDENCE = [
  ...DEMO_EVIDENCE,
  {
    evidenceId: 'EV-007',
    incidentId: 'INC-2026-0141',
    type: 'Satellite Image',
    source: 'ISRO EOS-06 / NRSC',
    timestamp: '2026-09-24T11:18:00Z',
    location: '13.2°N, 82.6°E',
    hash: 'SHA256: h1i2j3...demo',
    uploadedBy: 'SlickTrace Auto-Ingestion',
    createdAt: '2026-09-24T11:20:00Z',
  },
  {
    evidenceId: 'EV-008',
    incidentId: 'INC-2026-0142',
    type: 'Generated Report',
    source: 'SlickTrace Platform',
    timestamp: '2026-09-27T11:45:00Z',
    location: 'SlickTrace Platform',
    hash: 'SHA256: k4l5m6...demo',
    uploadedBy: 'Demo Analyst',
    createdAt: '2026-09-27T11:45:00Z',
  },
];

export default function EvidenceLockPage() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const types = [...new Set(ALL_EVIDENCE.map(e => e.type))];
  const filtered = filter === 'all' ? ALL_EVIDENCE : ALL_EVIDENCE.filter(e => e.type === filter);

  return (
    <div>
      <div className="demo-banner">
        ⚠️ DEMO DATA — Evidence metadata shown is simulated. Firebase Storage integration is ready for real files.
        Cryptographic hashing architecture planned for v2.
      </div>

      <div className="page-header">
        <h1>Evidence Locker</h1>
        <p>Tamper-evident evidence storage · Firebase Storage + Firestore metadata · Future: cryptographic hashing</p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Evidence Items', value: ALL_EVIDENCE.length, color: 'teal' },
          { label: 'Active Incident', value: DEMO_EVIDENCE.filter(e => e.incidentId === 'INC-2026-0142').length, color: 'red' },
          { label: 'Satellite Images', value: ALL_EVIDENCE.filter(e => e.type === 'Satellite Image').length, color: 'ocean' },
          { label: 'Integrity Status', value: 'Verified', color: 'green' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.color}`}><Archive size={18} /></div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Integrity notice */}
      <div style={{ padding: '12px 16px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 8, marginBottom: 24, display: 'flex', gap: 10, alignItems: 'center' }}>
        <Shield size={16} color="#22c55e" />
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4ade80' }}>Evidence Integrity: Architecture Ready</span>
          <span style={{ fontSize: '0.78rem', color: '#64748b', marginLeft: 8 }}>
            SHA-256 hashing architecture prepared for v2. Current prototype uses Firestore metadata + Firebase Storage.
            Full cryptographic evidence hashing planned for production deployment.
          </span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter('all')}>
          All ({ALL_EVIDENCE.length})
        </button>
        {types.map(t => (
          <button key={t} className={`btn btn-sm ${filter === t ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(t)}>
            {t}
          </button>
        ))}
      </div>

      {/* Evidence grid */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {filtered.map(ev => {
          const { icon: Icon, cls } = EVIDENCE_ICON_MAP[ev.type] || { icon: Database, cls: 'satellite' };
          const isSelected = selected?.evidenceId === ev.evidenceId;
          return (
            <div
              key={ev.evidenceId}
              className="evidence-card"
              style={{ cursor: 'pointer', border: isSelected ? '1px solid rgba(20,184,166,0.4)' : undefined }}
              onClick={() => setSelected(isSelected ? null : ev)}
            >
              <div className={`evidence-icon ${cls}`} style={{ width: 40, height: 40 }}>
                <Icon size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#e8f1ff', marginBottom: 2 }}>{ev.type}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{ev.source}</div>
                  </div>
                  <span className="badge badge-teal" style={{ fontSize: '0.62rem', flexShrink: 0 }}>{ev.evidenceId}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', marginBottom: 8 }}>
                  {[
                    { label: 'Incident', value: ev.incidentId },
                    { label: 'Timestamp', value: new Date(ev.timestamp).toISOString().slice(0, 16).replace('T', ' ') + ' UTC' },
                    { label: 'Location', value: ev.location },
                    { label: 'Uploaded By', value: ev.uploadedBy },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={{ fontSize: '0.6rem', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 1 }}>{item.label}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
                {isSelected && (
                  <div style={{ marginTop: 8, padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
                    <div style={{ fontSize: '0.65rem', color: '#334155', textTransform: 'uppercase', marginBottom: 4 }}>Integrity Hash (Demo)</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#14b8a6' }}>{ev.hash}</div>
                    <div style={{ fontSize: '0.65rem', color: '#334155', marginTop: 4 }}>
                      Created: {new Date(ev.createdAt).toISOString().slice(0, 16).replace('T', ' ')} UTC
                    </div>
                    <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost btn-sm">
                        <Download size={11} /> Download
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        <Shield size={11} /> Verify Hash
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Firebase storage info */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Database size={14} color="var(--ocean-500)" />
            <span className="card-title">Storage Architecture</span>
          </div>
        </div>
        <div className="grid-2">
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Firebase Storage (Current Prototype)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem', color: '#94a3b8' }}>
              {[
                'incidents/{incidentId}/satellite/ — SAR/EO images',
                'incidents/{incidentId}/detections/ — Slick polygon files',
                'incidents/{incidentId}/ais/ — AIS track exports',
                'incidents/{incidentId}/drift/ — OpenDrift outputs',
                'incidents/{incidentId}/reports/ — Generated PDFs',
              ].map(p => (
                <div key={p} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: '#14b8a6' }}>›</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>PostgreSQL / PostGIS (Target Architecture)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem', color: '#94a3b8' }}>
              {[
                'Georeferenced slick polygons (GEOMETRY)',
                'Vessel AIS tracks (LINESTRING / PostGIS)',
                'Drift trajectory particles (POINT collections)',
                'Spatial correlation queries (ST_Within, ST_Distance)',
                'Cryptographic evidence hashing (pgcrypto)',
              ].map(p => (
                <div key={p} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: '#0ea5e9' }}>›</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(14,165,233,0.06)', borderRadius: 8, fontSize: '0.72rem', color: '#64748b' }}>
          NOTE: Firebase is the current prototype application layer (auth, storage, notifications).
          PostgreSQL + PostGIS is the intended geospatial backend for the production system.
          Firebase does NOT perform PostGIS spatial analysis.
        </div>
      </div>

      <div className="disclaimer">
        Evidence Locker prototype uses Firebase Storage for file storage and Firestore for metadata.
        Full cryptographic evidence hashing and legal admissibility framework planned for production deployment.
        Do not rely on prototype evidence for legal proceedings.
      </div>
    </div>
  );
}
