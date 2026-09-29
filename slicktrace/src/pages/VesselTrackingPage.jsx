// src/pages/VesselTrackingPage.jsx
import { useState } from 'react';
import { Ship, MapPin, AlertTriangle, Activity, Anchor, Eye } from 'lucide-react';
import { DEMO_VESSELS, DEMO_ATTRIBUTIONS } from '../data/demoData';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: null, iconUrl: null, shadowUrl: null });

const vesselIcon = (color) => L.divIcon({
  html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.7);box-shadow:0 0 10px ${color}"></div>`,
  className: '', iconAnchor: [7, 7],
});

const AIS_TRACKS = {
  'VSL-001': { color: '#f59e0b', track: [[19.05, 69.3], [19.1, 69.1], [19.15, 68.9], [19.2, 68.7], [19.25, 68.5], [19.28, 68.35], [19.25, 68.1]] },
  'VSL-002': { color: '#0ea5e9', track: [[19.9, 67.5], [19.8, 67.7], [19.75, 67.95], [19.7, 68.15], [19.65, 68.4], [19.6, 68.6], [19.7, 67.9]] },
  'VSL-003': { color: '#94a3b8', track: [[18.6, 69.8], [18.7, 69.5], [18.85, 69.2], [18.9, 68.95], [18.9, 68.7]] },
};

function AttributionBadge({ status }) {
  if (status === 'High Priority') return <span className="badge badge-red">High Priority</span>;
  if (status === 'Medium Priority') return <span className="badge badge-amber">Medium Priority</span>;
  return <span className="badge badge-teal">Low Priority</span>;
}

function AISStatusBadge({ status }) {
  if (status === 'Active') return <span className="badge badge-green">{status}</span>;
  if (status.includes('Gap')) return <span className="badge badge-red">{status}</span>;
  return <span className="badge badge-slate">{status}</span>;
}

export default function VesselTrackingPage() {
  const [selectedVessel, setSelectedVessel] = useState(DEMO_VESSELS[0]);
  const [activeTab, setActiveTab] = useState('map');

  const attr = DEMO_ATTRIBUTIONS.find(a => a.vesselId === selectedVessel.vesselId);

  return (
    <div>
      <div className="demo-banner">
        ⚠️ SIMULATED AIS TRACK — All vessel positions, tracks and correlation data are demo data.
        Real AIS integration requires live VTS / MarineTraffic API feeds.
      </div>

      <div className="page-header">
        <h1>Vessel Tracking & AIS Analytics</h1>
        <p>Historical AIS Vessel Tracks · AIS Track Integration · Spatial Correlation with Spill Source Region</p>
      </div>

      {/* Vessel table */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Ship size={14} color="var(--ocean-500)" />
            <span className="card-title">Candidate Vessels — INC-2026-0142</span>
          </div>
          <span className="badge badge-demo">DEMO DATA</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Vessel ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>AIS Status</th>
                <th>Position</th>
                <th>Speed</th>
                <th>Course</th>
                <th>Dist. to Spill</th>
                <th>Time Correlation</th>
                <th>Attribution</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_VESSELS.map(v => (
                <tr key={v.vesselId} style={{ cursor: 'pointer', background: selectedVessel.vesselId === v.vesselId ? 'rgba(20,184,166,0.06)' : '' }}
                  onClick={() => setSelectedVessel(v)}>
                  <td style={{ fontFamily: 'monospace', color: '#14b8a6', fontSize: '0.78rem' }}>{v.vesselId}</td>
                  <td style={{ fontWeight: 600, color: '#e8f1ff', fontSize: '0.82rem' }}>{v.name}</td>
                  <td>{v.type}</td>
                  <td><AISStatusBadge status={v.aisStatus} /></td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{v.latitude}°N, {v.longitude}°E</td>
                  <td style={{ fontFamily: 'monospace' }}>{v.speed}</td>
                  <td style={{ fontFamily: 'monospace' }}>{v.course}</td>
                  <td style={{ fontWeight: 600, color: parseFloat(v.distanceToSpill) < 30 ? '#ef4444' : '#94a3b8' }}>{v.distanceToSpill}</td>
                  <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{v.timeCorrelation}</td>
                  <td><AttributionBadge status={v.attributionStatus} /></td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedVessel(v); setActiveTab('detail'); }}>
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[
          { id: 'map', label: 'AIS Track Map' },
          { id: 'detail', label: `Vessel Detail: ${selectedVessel.name}` },
        ].map(t => (
          <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'map' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="card-header" style={{ padding: '12px 16px' }}>
            <span className="card-title">AIS Vessel Tracks · Spill Location Overlay</span>
            <div style={{ display: 'flex', gap: 16, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span style={{ color: '#f59e0b' }}>● VSL-001 (High)</span>
              <span style={{ color: '#0ea5e9' }}>● VSL-002 (Medium)</span>
              <span style={{ color: '#94a3b8' }}>● VSL-003 (Low)</span>
              <span style={{ color: '#ef4444' }}>■ Oil Spill</span>
            </div>
          </div>
          <div style={{ height: 460 }}>
            <MapContainer center={[19.3, 68.5]} zoom={7} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com">CARTO</a>' />
              {/* Oil spill */}
              <Circle center={[19.4, 68.2]} radius={12000} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.15, weight: 2 }} />
              {/* Source region */}
              <Circle center={[19.2, 68.6]} radius={14000} pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.08, weight: 1.5, dashArray: '5,5' }} />
              {/* AIS tracks */}
              {Object.entries(AIS_TRACKS).map(([vid, t]) => (
                <Polyline key={vid} positions={t.track}
                  pathOptions={{ color: t.color, weight: vid === 'VSL-001' ? 3 : 2, dashArray: vid === 'VSL-003' ? '5,5' : undefined }} />
              ))}
              {/* Vessel markers */}
              {DEMO_VESSELS.map(v => (
                <Marker key={v.vesselId} position={[v.latitude, v.longitude]}
                  icon={vesselIcon(AIS_TRACKS[v.vesselId]?.color || '#94a3b8')}>
                  <Popup>
                    <div style={{ fontSize: '0.78rem', background: '#0d1f38', color: '#e8f1ff', padding: 6, minWidth: 200 }}>
                      <strong>{v.name}</strong><br />
                      AIS: {v.aisStatus} · {v.type}<br />
                      Speed: {v.speed} · Course: {v.course}<br />
                      Dist. to Spill: <span style={{ color: '#ef4444' }}>{v.distanceToSpill}</span><br />
                      Attribution: <strong>{v.attributionStatus}</strong><br />
                      <span style={{ color: '#f59e0b', fontSize: '0.68rem' }}>DEMO DATA</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      )}

      {activeTab === 'detail' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Anchor size={14} color="var(--ocean-500)" />
                <span className="card-title">Vessel Profile</span>
              </div>
              <AttributionBadge status={selectedVessel.attributionStatus} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Vessel Name', value: selectedVessel.name, highlight: true },
                { label: 'Vessel ID', value: selectedVessel.vesselId },
                { label: 'IMO Number', value: selectedVessel.imo, mono: true },
                { label: 'MMSI', value: selectedVessel.mmsi, mono: true },
                { label: 'Vessel Type', value: selectedVessel.type },
                { label: 'Flag State', value: selectedVessel.flag },
                { label: 'AIS Status', value: selectedVessel.aisStatus },
                { label: 'Last Known Position', value: `${selectedVessel.latitude}°N, ${selectedVessel.longitude}°E` },
                { label: 'Speed Over Ground', value: selectedVessel.speed },
                { label: 'Course Over Ground', value: selectedVessel.course },
                { label: 'Last AIS Update', value: new Date(selectedVessel.lastUpdated).toISOString().slice(0, 16).replace('T', ' ') + ' UTC' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 8 }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.label}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: item.highlight ? 700 : 500, color: item.highlight ? '#e8f1ff' : '#94a3b8', fontFamily: item.mono ? 'monospace' : 'inherit' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity size={14} color="var(--amber-500)" />
                <span className="card-title">Spill Correlation Analysis</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Distance to Detected Spill', value: selectedVessel.distanceToSpill, color: parseFloat(selectedVessel.distanceToSpill) < 30 ? '#ef4444' : '#94a3b8' },
                { label: 'Time Before Detection', value: selectedVessel.timeCorrelation },
                { label: 'Attribution Priority', value: selectedVessel.attributionStatus },
                { label: 'Attribution Score', value: `${(selectedVessel.attributionScore * 100).toFixed(0)}%` },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 10 }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.label}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: item.color || '#e8f1ff' }}>{item.value}</span>
                </div>
              ))}
            </div>

            {selectedVessel.aisStatus.includes('Gap') && (
              <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <AlertTriangle size={14} color="#ef4444" />
                  <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>AIS Gap Detected</span>
                </div>
                <p style={{ fontSize: '0.78rem', marginTop: 6 }}>
                  This vessel's AIS transponder shows a gap near the probable source region.
                  AIS gaps may indicate transponder issues or intentional disabling.
                  This is noted as an evidence factor in attribution analysis.
                </p>
              </div>
            )}

            {attr && (
              <>
                <div style={{ marginTop: 20, marginBottom: 10, fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  SHAP Evidence Factors
                </div>
                {Object.entries(attr.factors).map(([key, val]) => {
                  const labels = {
                    aisProximity: 'AIS Proximity to Source',
                    temporalOverlap: 'Temporal Overlap',
                    sourceRegionOverlap: 'Source Region Overlap',
                    trackConsistency: 'Track Consistency',
                    driftConsistency: 'Drift Consistency',
                    historicalTrack: 'Historical Track Match',
                  };
                  return (
                    <div key={key} className="shap-bar-row">
                      <span className="shap-bar-label">{labels[key] || key}</span>
                      <div className="shap-bar-track">
                        <div className="shap-bar-fill" style={{
                          width: `${val * 100}%`,
                          background: val > 0.8 ? 'var(--red-500)' : val > 0.6 ? 'var(--amber-500)' : 'var(--teal-500)'
                        }} />
                      </div>
                      <span className="shap-bar-value">{(val * 100).toFixed(0)}%</span>
                    </div>
                  );
                })}
              </>
            )}

            <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(14,165,233,0.06)', borderLeft: '3px solid #0369a1', borderRadius: '0 6px 6px 0', fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic' }}>
              Attribution is analytical — based on AIS, drift and spatial correlation.
              Verify with authorities before any legal or enforcement action.
            </div>
          </div>
        </div>
      )}

      <div className="disclaimer">
        AIS data and vessel correlation results shown are simulated prototype data.
        Uses GeoPandas / PostGIS for spatial correlation (planned). Current prototype uses Firestore.
      </div>
    </div>
  );
}
