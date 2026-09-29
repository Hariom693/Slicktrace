// src/pages/DetectionPage.jsx
import { useState } from 'react';
import { Activity, CheckCircle, Clock, AlertTriangle, Layers, BarChart2 } from 'lucide-react';
import { DEMO_INCIDENTS } from '../data/demoData';

const SAR_STEPS = [
  { label: 'Calibration', desc: 'Radiometric calibration of raw SAR data (σ°)', status: 'done' },
  { label: 'Speckle Filtering', desc: 'Lee filter applied to reduce SAR speckle noise (OpenCV)', status: 'done' },
  { label: 'Terrain Correction', desc: 'Range-Doppler terrain correction via GDAL/SNAP', status: 'done' },
  { label: 'Normalization', desc: 'Backscatter normalization for model input', status: 'done' },
];

const AI_PIPELINE = [
  { label: 'Satellite Image Ingestion', desc: 'Sentinel-1 SAR C-band VV polarization, 10m resolution', status: 'done', model: 'Copernicus / ESA' },
  { label: 'SAR Pre-processing', desc: 'Calibration → Speckle Filter → Terrain Correction → Normalization', status: 'done', model: 'GDAL / OpenCV' },
  { label: 'AI-Based Oil Slick Detection', desc: 'U-Net semantic segmentation model detects dark slick pixels', status: 'done', model: 'PyTorch / U-Net' },
  { label: 'Look-Alike Removal', desc: 'Random Forest / XGBoost classifies false positives (biogenic film, wind shadow)', status: 'done', model: 'XGBoost / SHAP' },
  { label: 'Georeferenced Slick Polygon', desc: 'Detected mask rasterized to georeferenced polygon (GDAL / GeoPandas / PostGIS)', status: 'done', model: 'GDAL / GeoPandas' },
];

const LOOKALIKE_FEATURES = [
  { name: 'Normalized Backscatter (σ°)', value: -18.4, unit: 'dB', contribution: 'High' },
  { name: 'Slick Elongation Ratio', value: 4.2, unit: '', contribution: 'High' },
  { name: 'Wind Speed (ERA5)', value: 6.2, unit: 'm/s', contribution: 'Medium' },
  { name: 'Texture Homogeneity', value: 0.83, unit: '', contribution: 'High' },
  { name: 'SST (CMEMS)', value: 28.4, unit: '°C', contribution: 'Low' },
  { name: 'Proximity to Vessel AIS', value: 18.7, unit: 'km', contribution: 'High' },
];

function ProcessStep({ step, index }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', position: 'relative' }}>
      {index < AI_PIPELINE.length - 1 && (
        <div style={{ position: 'absolute', left: 13, top: 28, width: 2, height: 'calc(100% - 4px)', background: 'rgba(20,184,166,0.2)' }} />
      )}
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: step.status === 'done' ? 'rgba(20,184,166,0.15)' : 'rgba(148,163,184,0.1)',
        border: `1.5px solid ${step.status === 'done' ? '#0d9488' : '#64748b'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {step.status === 'done' ? <CheckCircle size={14} color="#14b8a6" /> : <Clock size={14} color="#64748b" />}
      </div>
      <div style={{ paddingBottom: 24 }}>
        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e8f1ff', marginBottom: 3 }}>{step.label}</div>
        <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 4 }}>{step.desc}</div>
        <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#14b8a6', background: 'rgba(20,184,166,0.08)', padding: '2px 8px', borderRadius: 4 }}>{step.model}</span>
      </div>
    </div>
  );
}

// Simple canvas SAR visualization
function SARVisualization({ type }) {
  const isDetected = type === 'detected';
  return (
    <div style={{
      width: '100%', aspectRatio: '16/9',
      background: isDetected ? 'linear-gradient(135deg, #030d1a 0%, #071525 100%)' : 'linear-gradient(135deg, #051520 0%, #0a2535 100%)',
      position: 'relative', overflow: 'hidden', borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      {/* SAR texture dots */}
      {Array.from({ length: 60 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
          width: Math.random() * 3 + 1, height: Math.random() * 3 + 1,
          borderRadius: '50%', background: `rgba(255,255,255,${Math.random() * 0.15})`,
        }} />
      ))}
      {/* Ocean-like texture */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(0deg, rgba(10,40,80,0.3) 0px, rgba(10,40,80,0.3) 1px, transparent 1px, transparent 12px)',
      }} />
      {isDetected ? (
        <>
          {/* Oil slick shape */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 220" preserveAspectRatio="none">
            <ellipse cx="200" cy="110" rx="120" ry="55" fill="rgba(239,68,68,0.2)" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6,3" />
            <ellipse cx="200" cy="110" rx="85" ry="38" fill="rgba(239,68,68,0.15)" />
            <ellipse cx="185" cy="100" rx="40" ry="22" fill="rgba(239,68,68,0.25)" />
          </svg>
          <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(239,68,68,0.8)', padding: '3px 10px', borderRadius: 4, fontSize: '0.7rem', color: '#fff', fontWeight: 700 }}>
            ■ DETECTED OIL SLICK — 47.3 km²
          </div>
          <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)', padding: '3px 8px', borderRadius: 4, fontSize: '0.65rem', color: '#14b8a6', fontFamily: 'monospace' }}>
            U-Net · Sentinel-1 SAR
          </div>
        </>
      ) : (
        <>
          <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(3,105,161,0.7)', padding: '3px 10px', borderRadius: 4, fontSize: '0.7rem', color: '#fff', fontWeight: 700 }}>
            RAW SAR IMAGE · C-band VV
          </div>
          <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)', padding: '3px 8px', borderRadius: 4, fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'monospace' }}>
            Pre-processing...
          </div>
          {/* Dark patch suggesting slick (not highlighted) */}
          <div style={{ position: 'absolute', left: '35%', top: '30%', width: '30%', height: '40%', background: 'rgba(0,0,0,0.25)', borderRadius: '50%' }} />
        </>
      )}
      <div style={{ position: 'absolute', top: 8, left: 10, fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>
        [SAMPLE SAR IMAGE — NOT A LIVE OBSERVATION]
      </div>
    </div>
  );
}

export default function DetectionPage() {
  const [selectedInc, setSelectedInc] = useState(DEMO_INCIDENTS[0]);
  const [activeTab, setActiveTab] = useState('pipeline');

  return (
    <div>
      <div className="demo-banner">
        ⚠️ SAMPLE SATELLITE IMAGE — Not a live satellite observation. AI pipeline results shown are for demonstration only.
      </div>

      <div className="page-header">
        <h1>Oil Spill Detection</h1>
        <p>SAR Pre-processing → AI-Based Oil Slick Detection → Look-Alike Removal → Georeferenced Slick Polygon</p>
        <div className="page-header-actions">
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Incident:</span>
          <select
            className="form-input"
            style={{ width: 'auto', fontSize: '0.82rem', padding: '5px 10px' }}
            value={selectedInc.incidentId}
            onChange={e => setSelectedInc(DEMO_INCIDENTS.find(i => i.incidentId === e.target.value))}
          >
            {DEMO_INCIDENTS.map(i => (
              <option key={i.incidentId} value={i.incidentId}>{i.incidentId} — {i.location}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Incident summary */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="status-dot alert" />
            <span style={{ fontFamily: 'monospace', fontSize: '0.88rem', color: '#14b8a6', fontWeight: 700 }}>{selectedInc.incidentId}</span>
            <span className="badge badge-red">Active</span>
          </div>
          <span className="badge badge-demo">DEMO DATA</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 20 }}>
          {[
            { label: 'Location', value: selectedInc.location },
            { label: 'Spill Area', value: selectedInc.spillArea },
            { label: 'Satellite Source', value: selectedInc.satelliteSource },
            { label: 'Detection Model', value: selectedInc.detectionModel },
            { label: 'Processing Status', value: selectedInc.processingStatus },
            { label: 'Detected At', value: new Date(selectedInc.detectedAt).toISOString().slice(0, 16).replace('T', ' ') + ' UTC' },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Before/After SAR comparison */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <span className="card-title">SAR Image Before / After Detection</span>
          <span className="badge badge-demo">SAMPLE IMAGE</span>
        </div>
        <div className="grid-2">
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>① Raw SAR Image</div>
            <SARVisualization type="raw" />
            <div style={{ marginTop: 8, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Sentinel-1 SAR · C-band VV polarization · 10m resolution · Copernicus
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>② Detected Oil Slick (U-Net)</div>
            <SARVisualization type="detected" />
            <div style={{ marginTop: 8, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Red boundary = Georeferenced slick polygon · Area: 47.3 km² · Confidence: High
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[
          { id: 'pipeline', label: 'AI Detection Pipeline' },
          { id: 'sar', label: 'SAR Pre-processing' },
          { id: 'lookalike', label: 'Look-Alike Removal' },
        ].map(t => (
          <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'pipeline' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity size={14} color="var(--teal-500)" />
                <span className="card-title">Detection Pipeline</span>
              </div>
            </div>
            <div className="pipeline">
              {AI_PIPELINE.map((step, i) => <ProcessStep key={step.label} step={step} index={i} />)}
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Slick Characterization</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Detected Slick Area', value: '47.3 km²', highlight: true },
                { label: 'Slick Perimeter', value: '~38.2 km' },
                { label: 'Coordinates (centroid)', value: '19.4°N, 68.2°E' },
                { label: 'Detection Timestamp', value: '2026-09-26 08:32 UTC' },
                { label: 'Elongation Ratio', value: '4.2 (elongated — consistent with oil)' },
                { label: 'Backscatter (σ°)', value: '-18.4 dB (low — dark slick)' },
                { label: 'Look-alike Removed', value: 'Yes — Random Forest classifier' },
                { label: 'Polygon CRS', value: 'EPSG:4326 (WGS84)' },
                { label: 'Storage', value: 'PostGIS (target) / Firestore (prototype)' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 10 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.label}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: item.highlight ? 'var(--red-400)' : 'var(--text-primary)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sar' && (
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Layers size={14} color="var(--ocean-500)" />
              <span className="card-title">SAR Pre-processing Pipeline</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--green-400)' }}>All steps complete ✓</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {SAR_STEPS.map((step, i) => (
              <div key={step.label} className="process-step">
                <CheckCircle size={16} color="#14b8a6" className="process-check" />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#64748b' }}>Step {i + 1}</span>
                    <span className="process-name" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{step.label}</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{step.desc}</span>
                </div>
                <span className="badge badge-green process-status">Done</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: 14, background: 'rgba(14,165,233,0.06)', borderRadius: 8 }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.6 }}>
              <strong style={{ color: '#0ea5e9' }}>Tools Used:</strong> GDAL · OpenCV · Python · PyTorch<br />
              <strong style={{ color: '#0ea5e9' }}>Input:</strong> Sentinel-1 GRD product, C-band VV+VH polarization, Level-1<br />
              <strong style={{ color: '#0ea5e9' }}>Output:</strong> Normalized backscatter raster — ready for U-Net inference
            </div>
          </div>
        </div>
      )}

      {activeTab === 'lookalike' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BarChart2 size={14} color="var(--amber-500)" />
                <span className="card-title">Look-Alike Removal & Characterization</span>
              </div>
            </div>
            <p style={{ fontSize: '0.82rem', marginBottom: 16 }}>
              Natural phenomena can mimic oil slicks in SAR imagery. SlickTrace uses Random Forest / XGBoost
              classification to distinguish genuine oil slicks from look-alikes such as biogenic films, rain cells,
              low-wind zones and vessel wakes.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { type: 'Biogenic film', risk: 'Medium', removed: true },
                { type: 'Rain cell / atmospheric effect', risk: 'Low', removed: true },
                { type: 'Low-wind shadow zone', risk: 'Medium', removed: true },
                { type: 'Vessel wake', risk: 'High', removed: false },
              ].map(item => (
                <div key={item.type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{item.type}</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className={`badge ${item.risk === 'High' ? 'badge-red' : item.risk === 'Medium' ? 'badge-amber' : 'badge-teal'}`}>{item.risk} look-alike risk</span>
                    <span className={`badge ${item.removed ? 'badge-green' : 'badge-slate'}`}>{item.removed ? 'Classified as look-alike' : 'Retained as oil'}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: 12, background: 'rgba(20,184,166,0.06)', borderRadius: 8, fontSize: '0.78rem', color: '#64748b' }}>
              Model: <strong style={{ color: '#14b8a6' }}>Random Forest + XGBoost</strong> — Feature extraction includes backscatter statistics, shape metrics, wind speed (ERA5), proximity to AIS vessel tracks.
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Feature Extraction Values</span>
              <span className="badge badge-demo">DEMO DATA</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {LOOKALIKE_FEATURES.map(f => (
                <div key={f.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 10 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{f.name}</span>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: 'var(--text-primary)' }}>{f.value} {f.unit}</span>
                    <span className={`badge ${f.contribution === 'High' ? 'badge-amber' : f.contribution === 'Medium' ? 'badge-ocean' : 'badge-slate'}`}>{f.contribution}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="disclaimer">
        Detection results based on Sentinel-1 SAR imagery processed by U-Net semantic segmentation model (PyTorch).
        Look-alike removal via Random Forest / XGBoost classifier using ERA5, CMEMS and AIS proximity features.
        All results shown are simulated prototype data.
      </div>
    </div>
  );
}
