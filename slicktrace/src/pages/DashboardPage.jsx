// src/pages/DashboardPage.jsx
import { useState, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, Activity, Ship, UserCheck, Waves, FileText,
  Satellite, MapPin, Clock, TrendingUp, Radio, Database
} from 'lucide-react';
import { DEMO_STATS, DEMO_INCIDENTS, DEMO_NOTIFICATIONS, DEMO_TIMELINE } from '../data/demoData';
import { MapContainer, TileLayer, Polygon, Polyline, Circle, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const ShipVisualization3D = lazy(() => import('../components/ShipVisualization3D'));

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: null, iconUrl: null, shadowUrl: null });

const customIcon = (color) => L.divIcon({
  html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.6);box-shadow:0 0 8px ${color}"></div>`,
  className: '', iconAnchor: [6, 6],
});

const STATS = [
  { label: 'ACTIVE INCIDENTS', value: DEMO_STATS.activeIncidents, icon: AlertTriangle, color: 'red', change: '↑ 1 from yesterday' },
  { label: 'DETECTED OIL SPILLS', value: DEMO_STATS.detectedOilSpills, icon: Activity, color: 'red', change: 'Last 30 days' },
  { label: 'VESSELS ANALYZED', value: DEMO_STATS.vesselsAnalyzed, icon: Ship, color: 'ocean', change: 'Current incident' },
  { label: 'POTENTIAL VESSELS', value: DEMO_STATS.potentialVessels, icon: UserCheck, color: 'amber', change: 'Under attribution' },
  { label: 'ACTIVE DRIFT PREDICTIONS', value: DEMO_STATS.activeDriftPredictions, icon: Waves, color: 'teal', change: 'OpenDrift running' },
  { label: 'PENDING REPORTS', value: DEMO_STATS.pendingReports, icon: FileText, color: 'green', change: 'Awaiting review' },
];

// Demo map data
const SPILL_POLYGON = [
  [19.5, 68.1], [19.5, 68.35], [19.4, 68.4], [19.3, 68.3], [19.3, 68.05], [19.4, 68.0],
];
const AIS_TRACK = [
  [19.0, 69.2], [19.15, 69.0], [19.2, 68.7], [19.25, 68.5], [19.3, 68.3], [19.35, 68.1], [19.4, 67.9],
];
const DRIFT_FORWARD = [[19.4, 68.2], [19.5, 68.05], [19.62, 67.88], [19.74, 67.7], [19.85, 67.5]];
const DRIFT_BACKWARD = [[19.4, 68.2], [19.35, 68.32], [19.3, 68.44], [19.25, 68.52], [19.2, 68.6]];

function StatusBadge({ status }) {
  const map = {
    active: { label: 'Active', cls: 'badge-red' },
    'under-analysis': { label: 'Under Analysis', cls: 'badge-amber' },
    closed: { label: 'Closed', cls: 'badge-slate' },
  };
  const s = map[status] || { label: status, cls: 'badge-slate' };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeIncident, setActiveIncident] = useState(DEMO_INCIDENTS[0]);

  return (
    <div>
      <div className="demo-banner">
        ⚠️ PROTOTYPE DEMONSTRATION — Data shown is simulated and is not a live operational feed.
        Satellite, AIS and drift data shown are for demonstration purposes only.
      </div>

      {/* Page header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Overview Dashboard</h1>
          <p>SlickTrace Decision-Support Command Center · Arabian Sea Region</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8 }}>
            <div className="status-dot active" />
            <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: 600 }}>SYSTEM ONLINE</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#334155', fontFamily: 'monospace' }}>
            {new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid-6" style={{ marginBottom: 24 }}>
        {STATS.map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.color}`}>
              <s.icon size={20} />
            </div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-change" style={{ color: s.color === 'red' ? 'var(--red-400)' : 'var(--text-muted)' }}>{s.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main content: map + incidents */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Map */}
        <div className="card" style={{ gridColumn: '1', padding: 0, overflow: 'hidden', minHeight: 420 }}>
          <div className="card-header" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={14} color="var(--teal-500)" />
              <span className="card-title">Live Incident Map</span>
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span style={{ color: '#ef4444' }}>■ Oil Spill</span>
              <span style={{ color: '#0ea5e9' }}>■ AIS Track</span>
              <span style={{ color: '#22c55e' }}>■ Drift Pred</span>
              <span style={{ color: '#f59e0b' }}>■ Source</span>
            </div>
          </div>
          <div style={{ height: 380 }}>
            <MapContainer
              center={[19.4, 68.2]}
              zoom={7}
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com">CARTO</a>'
              />
              {/* Oil spill polygon */}
              <Polygon
                positions={SPILL_POLYGON}
                pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.2, weight: 2 }}
              />
              {/* AIS vessel track */}
              <Polyline positions={AIS_TRACK} pathOptions={{ color: '#0ea5e9', weight: 2, dashArray: '5,5' }} />
              {/* Forward drift */}
              <Polyline positions={DRIFT_FORWARD} pathOptions={{ color: '#22c55e', weight: 2 }} />
              {/* Backward drift */}
              <Polyline positions={DRIFT_BACKWARD} pathOptions={{ color: '#f59e0b', weight: 2, dashArray: '3,3' }} />
              {/* Spill center */}
              <Circle center={[19.4, 68.2]} radius={8000} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1 }}>
                <Popup>
                  <div style={{ fontSize: '0.78rem', background: '#0d1f38', color: '#e8f1ff', padding: 4 }}>
                    <strong>Oil Slick Detected</strong><br />
                    Area: 47.3 km²<br />
                    Source: Sentinel-1 SAR<br />
                    Model: U-Net<br />
                    <span style={{ color: '#f59e0b' }}>DEMO DATA</span>
                  </div>
                </Popup>
              </Circle>
              {/* Probable source */}
              <Circle center={[19.2, 68.6]} radius={12000} pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.1, dashArray: '4,4' }}>
                <Popup>
                  <div style={{ fontSize: '0.78rem' }}>
                    <strong>Probable Source Region</strong><br />
                    Backward Lagrangian Hindcast result<br />
                    OpenDrift + ERA5 + CMEMS
                  </div>
                </Popup>
              </Circle>
              {/* Vessel marker */}
              <Marker position={[19.2, 68.5]} icon={customIcon('#f59e0b')}>
                <Popup>
                  <div style={{ fontSize: '0.78rem' }}>
                    <strong>MT ARABIAN STAR</strong><br />
                    AIS: Active · Oil Tanker<br />
                    Status: <span style={{ color: '#ef4444' }}>Potential Responsible Vessel</span>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        {/* Incident list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={14} color="var(--red-500)" />
                <span className="card-title">Active Incidents</span>
              </div>
              <span className="badge badge-demo">DEMO DATA</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {DEMO_INCIDENTS.map(inc => (
                <div
                  key={inc.incidentId}
                  className={`incident-card ${inc.severity}-severity`}
                  onClick={() => { setActiveIncident(inc); navigate('/detection'); }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <div className={`status-dot ${inc.status === 'active' ? 'active' : inc.status === 'under-analysis' ? 'pending' : 'closed'}`} />
                      <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--teal-400)' }}>{inc.incidentId}</span>
                      <StatusBadge status={inc.status} />
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{inc.location}</div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Area: {inc.spillArea}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Source: {inc.satelliteSource}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Model: {inc.detectionModel}</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      Detected: {new Date(inc.detectedAt).toISOString().slice(0, 16).replace('T', ' ')} UTC
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent notifications */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Recent Activity</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {DEMO_NOTIFICATIONS.slice(0, 3).map(n => (
                <div key={n.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                    background: n.type === 'alert' ? '#ef4444' : n.type === 'success' ? '#22c55e' : '#0ea5e9'
                  }} />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{n.message.slice(0, 80)}...</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      {new Date(n.time).toISOString().slice(0, 16).replace('T', ' ')} UTC
                    </div>
                  </div>
                  {!n.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', flexShrink: 0, marginTop: 6 }} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3D Ship Visualization */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Ship size={14} color="var(--ocean-500)" />
            <span className="card-title">3D Maritime Visualization — Vessel & Spill Simulation</span>
          </div>
          <span className="badge badge-demo">DEMO SIMULATION</span>
        </div>
        <Suspense fallback={<div style={{ height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}><div className="spinner" /></div>}>
          <ShipVisualization3D />
        </Suspense>
      </div>

      {/* Timeline preview */}

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={14} color="var(--teal-500)" />
            <span className="card-title">Incident Timeline · INC-2026-0142</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/timeline')}>View Full Timeline</button>
        </div>
        <div style={{ display: 'flex', gap: 0, overflow: 'auto', paddingBottom: 4 }}>
          {DEMO_TIMELINE.slice(0, 6).map((t, i) => (
            <div key={i} style={{ minWidth: 180, padding: '12px 16px', borderRight: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
              <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#14b8a6', fontWeight: 700, marginBottom: 6 }}>{t.label}</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.3 }}>{t.event}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{t.source}</div>
            </div>
          ))}
          <div style={{ minWidth: 100, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/timeline')}>
              +{DEMO_TIMELINE.length - 6} more →
            </button>
          </div>
        </div>
      </div>

      <div className="disclaimer">
        SlickTrace provides analytical decision support based on available satellite, environmental and AIS data.
        Vessel attribution is analytical and should be verified by authorized authorities before enforcement or legal action.
      </div>
    </div>
  );
}
