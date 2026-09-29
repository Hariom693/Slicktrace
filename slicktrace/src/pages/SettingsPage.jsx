// src/pages/SettingsPage.jsx
import { useState } from 'react';
import { Settings, Bell, Shield, Database, Globe, Save, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [notifSettings, setNotifSettings] = useState({
    newSpill: true, vesselCorrelation: true, driftComplete: true, reportReady: true, systemAlerts: true,
  });
  const [mapSettings, setMapSettings] = useState({
    defaultLayer: 'carto-dark', showAIS: true, showDrift: true, showSpill: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Settings</h1>
          <p>Application preferences and system configuration</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={13} /> Save Settings
        </button>
      </div>

      {saved && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 16px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, marginBottom: 20, fontSize: '0.82rem', color: '#4ade80' }}>
          <CheckCircle size={14} /> Settings saved successfully
        </div>
      )}

      <div className="grid-2">
        {/* Notifications */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bell size={14} color="var(--amber-500)" />
              <span className="card-title">Notification Settings</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { key: 'newSpill', label: 'New oil spill detected', desc: 'Alert when AI pipeline detects a new oil slick' },
              { key: 'vesselCorrelation', label: 'Vessel correlation identified', desc: 'Alert when AIS correlation is found' },
              { key: 'driftComplete', label: 'Drift prediction complete', desc: 'Notify when OpenDrift simulation finishes' },
              { key: 'reportReady', label: 'Incident report ready', desc: 'Notify when a report is generated' },
              { key: 'systemAlerts', label: 'System alerts', desc: 'Critical system and pipeline alerts' },
            ].map(item => (
              <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#e8f1ff', fontWeight: 500, marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.desc}</div>
                </div>
                <button
                  onClick={() => setNotifSettings(s => ({ ...s, [item.key]: !s[item.key] }))}
                  style={{
                    width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', flexShrink: 0, marginLeft: 16,
                    background: notifSettings[item.key] ? '#0d9488' : 'rgba(255,255,255,0.1)',
                    position: 'relative', transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', background: '#fff',
                    position: 'absolute', top: 3, transition: 'left 0.2s',
                    left: notifSettings[item.key] ? 'calc(100% - 21px)' : '3px',
                  }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Map settings */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Globe size={14} color="var(--ocean-500)" />
              <span className="card-title">Map Display Settings</span>
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <div className="form-group">
              <label className="form-label">Default Map Layer</label>
              <select className="form-input" value={mapSettings.defaultLayer}
                onChange={e => setMapSettings(s => ({ ...s, defaultLayer: e.target.value }))}>
                <option value="carto-dark">CartoDB Dark (Recommended)</option>
                <option value="osm">OpenStreetMap</option>
                <option value="satellite">Satellite (Planned)</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { key: 'showAIS', label: 'Show AIS vessel tracks by default' },
              { key: 'showDrift', label: 'Show drift prediction overlays' },
              { key: 'showSpill', label: 'Show detected spill polygons' },
            ].map(item => (
              <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{item.label}</span>
                <button
                  onClick={() => setMapSettings(s => ({ ...s, [item.key]: !s[item.key] }))}
                  style={{
                    width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', flexShrink: 0,
                    background: mapSettings[item.key] ? '#0d9488' : 'rgba(255,255,255,0.1)',
                    position: 'relative', transition: 'background 0.2s',
                  }}
                >
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, transition: 'left 0.2s', left: mapSettings[item.key] ? 'calc(100% - 21px)' : '3px' }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* System info */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Database size={14} color="var(--teal-500)" />
              <span className="card-title">System Information</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Application', value: 'SlickTrace v0.1.0 (Prototype)' },
              { label: 'Environment', value: import.meta.env.VITE_APP_ENV || 'development' },
              { label: 'Demo Mode', value: import.meta.env.VITE_DEMO_MODE === 'true' ? 'Enabled' : 'Disabled' },
              { label: 'Frontend', value: 'React + Vite' },
              { label: 'Maps', value: 'Leaflet / React-Leaflet' },
              { label: 'Auth', value: 'Firebase Authentication' },
              { label: 'Database', value: 'Cloud Firestore (prototype)' },
              { label: 'File Storage', value: 'Firebase Storage (prototype)' },
              { label: 'Target DB', value: 'PostgreSQL + PostGIS (production)' },
              { label: 'Drift Model', value: 'OpenDrift (integration planned)' },
              { label: 'AI Backend', value: 'FastAPI + PyTorch (planned)' },
              { label: 'Project', value: 'SIH 2026 · PS-26143 · SNPSU0178' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 8 }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.label}</span>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'monospace' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={14} color="var(--red-500)" />
              <span className="card-title">Security & Firebase Rules</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.7 }}>
            <div>
              <div style={{ fontWeight: 700, color: '#e8f1ff', marginBottom: 6 }}>Current Security Model</div>
              <div>Firebase Authentication + Firestore Security Rules enforce role-based access.
                Admin/Analyst users have read-write access. Viewers have read-only access.
                No direct Firestore access without authentication.</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#e8f1ff', marginBottom: 6 }}>Firestore Rules (Prototype)</div>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: 12, fontFamily: 'monospace', fontSize: '0.72rem', color: '#14b8a6', lineHeight: 1.8 }}>
                <div style={{ color: '#64748b' }}>{'// match /incidents/{incidentId}'}</div>
                <div>allow read: if request.auth != null;</div>
                <div>allow write: if request.auth != null</div>
                <div>&nbsp;&nbsp;&amp;&amp; get(/users/$(request.auth.uid))</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;.data.role == "admin";</div>
              </div>
            </div>
            <div style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8, fontSize: '0.72rem', color: '#64748b' }}>
              ⚠️ Production deployment requires full security audit, role-based access control review,
              and cryptographic evidence hashing. Current prototype rules are for demonstration only.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
