// src/pages/DriftPredictionPage.jsx
import { useState } from 'react';
import { Waves, ArrowLeft, ArrowRight, Wind, Thermometer, Activity } from 'lucide-react';
import { DEMO_DRIFT_DATA } from '../data/demoData';
import { MapContainer, TileLayer, Polyline, Circle, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: null, iconUrl: null, shadowUrl: null });

const dotIcon = (color) => L.divIcon({
  html: `<div style="width:10px;height:10px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.6)"></div>`,
  className: '', iconAnchor: [5, 5],
});

const ENV_DATA = [
  { time: 'T-18h', wind: 6.2, current: 0.42, wave: 1.1, temp: 28.4 },
  { time: 'T-12h', wind: 7.1, current: 0.45, wave: 1.3, temp: 28.2 },
  { time: 'T-8h', wind: 6.8, current: 0.41, wave: 1.2, temp: 28.3 },
  { time: 'T-4h', wind: 5.9, current: 0.38, wave: 1.0, temp: 28.5 },
  { time: 'T0', wind: 6.4, current: 0.43, wave: 1.15, temp: 28.4 },
  { time: 'T+12h', wind: 7.5, current: 0.48, wave: 1.4, temp: 28.0 },
  { time: 'T+24h', wind: 8.2, current: 0.52, wave: 1.6, temp: 27.8 },
  { time: 'T+36h', wind: 7.8, current: 0.50, wave: 1.5, temp: 27.9 },
  { time: 'T+48h', wind: 7.2, current: 0.46, wave: 1.3, temp: 28.1 },
];

export default function DriftPredictionPage() {
  const [mode, setMode] = useState('both');

  const showBackward = mode === 'both' || mode === 'backward';
  const showForward = mode === 'both' || mode === 'forward';

  return (
    <div>
      <div className="demo-banner">
        ⚠️ SIMULATED DRIFT PREDICTION — OpenDrift particle trajectories shown are demo data.
        Real predictions use ERA5 wind, CMEMS ocean currents and INCOIS ocean state data.
      </div>

      <div className="page-header">
        <h1>Spill Drift Prediction</h1>
        <p>Backward Lagrangian Hindcast → Probable Source Region & Time &nbsp;|&nbsp; Forward Drift → Predicted Spill Trajectory</p>
        <div className="page-header-actions">
          {['both', 'backward', 'forward'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`btn btn-sm ${mode === m ? 'btn-primary' : 'btn-ghost'}`}>
              {m === 'both' ? 'Both' : m === 'backward' ? '← Backward Hindcast' : 'Forward Drift →'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card" style={{ borderLeft: '3px solid var(--amber-500)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <ArrowLeft size={16} color="var(--amber-500)" />
            <span style={{ fontWeight: 700, color: '#e8f1ff' }}>Backward Lagrangian Hindcast</span>
          </div>
          <p style={{ fontSize: '0.82rem', marginBottom: 16 }}>
            OpenDrift backward particle simulation traces the detected oil slick to its probable source region and
            estimated start time. Uses ERA5 wind vectors and CMEMS ocean current fields.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Model', value: 'OpenDrift (backward mode)' },
              { label: 'Environmental Input', value: 'ERA5 + CMEMS + INCOIS' },
              { label: 'Probable Source Region', value: '19.2°N, 68.6°E (radius ~12 km)' },
              { label: 'Estimated Start Time', value: '2026-09-26 ~02:00 UTC (T-6h)' },
              { label: 'Hindcast Duration', value: '18 hours backward' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 8 }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.label}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e8f1ff' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ borderLeft: '3px solid var(--green-500)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <ArrowRight size={16} color="var(--green-500)" />
            <span style={{ fontWeight: 700, color: '#e8f1ff' }}>Forward Drift Prediction</span>
          </div>
          <p style={{ fontSize: '0.82rem', marginBottom: 16 }}>
            OpenDrift forward particle simulation predicts the spill's movement trajectory over the
            next 48 hours based on CMEMS ocean currents and ERA5 wind-vector data.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Model', value: 'OpenDrift (forward mode)' },
              { label: 'Environmental Input', value: 'CMEMS + ERA5' },
              { label: 'Predicted Position T+48h', value: '19.85°N, 67.5°E' },
              { label: 'Predicted Direction', value: 'NW at ~1.2 km/h' },
              { label: 'Prediction Horizon', value: '48 hours forward' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 8 }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.label}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e8f1ff' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
        <div className="card-header" style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Waves size={14} color="var(--teal-500)" />
            <span className="card-title">Drift Trajectory Map</span>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {showBackward && <span style={{ color: '#f59e0b' }}>← Backward Hindcast</span>}
            {showForward && <span style={{ color: '#22c55e' }}>→ Forward Drift</span>}
            <span style={{ color: '#ef4444' }}>● Oil Slick (T0)</span>
            <span style={{ color: '#f59e0b' }}>◌ Probable Source</span>
          </div>
        </div>
        <div style={{ height: 420 }}>
          <MapContainer center={[19.5, 68.0]} zoom={7} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com">CARTO</a>' />
            {/* Detected slick */}
            <Circle center={[19.4, 68.2]} radius={10000}
              pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.2, weight: 2 }} />
            {/* Backward track */}
            {showBackward && (
              <>
                <Polyline positions={DEMO_DRIFT_DATA.backward.map(p => [p.lat, p.lng])}
                  pathOptions={{ color: '#f59e0b', weight: 2.5, dashArray: '6,4' }} />
                {DEMO_DRIFT_DATA.backward.map((p, i) => (
                  <Marker key={i} position={[p.lat, p.lng]} icon={dotIcon(i === DEMO_DRIFT_DATA.backward.length - 1 ? '#f59e0b' : '#78350f')}>
                    <Popup><div style={{ fontSize: '0.78rem' }}>{p.label}</div></Popup>
                  </Marker>
                ))}
                <Circle center={[19.2, 68.6]} radius={12000}
                  pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.1, dashArray: '5,5' }} />
              </>
            )}
            {/* Forward track */}
            {showForward && (
              <>
                <Polyline positions={DEMO_DRIFT_DATA.forward.map(p => [p.lat, p.lng])}
                  pathOptions={{ color: '#22c55e', weight: 2.5 }} />
                {DEMO_DRIFT_DATA.forward.map((p, i) => (
                  <Marker key={i} position={[p.lat, p.lng]} icon={dotIcon(i === DEMO_DRIFT_DATA.forward.length - 1 ? '#22c55e' : '#14532d')}>
                    <Popup><div style={{ fontSize: '0.78rem' }}>{p.label}</div></Popup>
                  </Marker>
                ))}
              </>
            )}
          </MapContainer>
        </div>
      </div>

      {/* Environmental conditions chart */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Wind size={14} color="var(--ocean-500)" />
            <span className="card-title">Environmental Conditions — ERA5 / CMEMS / INCOIS</span>
          </div>
          <span className="badge badge-demo">DEMO DATA</span>
        </div>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ENV_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={{ background: '#0d1f38', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: '0.78rem' }} />
              <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
              <Line type="monotone" dataKey="wind" stroke="#0ea5e9" dot={false} name="Wind (m/s)" strokeWidth={2} />
              <Line type="monotone" dataKey="current" stroke="#14b8a6" dot={false} name="Current (m/s)" strokeWidth={2} />
              <Line type="monotone" dataKey="wave" stroke="#f59e0b" dot={false} name="Wave Ht (m)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', gap: 24, marginTop: 12, flexWrap: 'wrap' }}>
          {[
            { label: 'Wind Speed (ERA5)', value: '6.4 m/s', direction: 'NW', src: 'ERA5' },
            { label: 'Ocean Current (CMEMS)', value: '0.43 m/s', direction: 'W', src: 'CMEMS' },
            { label: 'Significant Wave Height', value: '1.15 m', direction: '—', src: 'CMEMS' },
            { label: 'Sea Surface Temp', value: '28.4°C', direction: '—', src: 'INCOIS' },
          ].map(item => (
            <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '10px 16px', flex: '1 1 160px' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#e8f1ff' }}>{item.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#14b8a6', marginTop: 2 }}>Src: {item.src} · Dir: {item.direction}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="disclaimer">
        Drift prediction uses OpenDrift Lagrangian particle simulation.
        Environmental inputs: ERA5 (wind/waves), CMEMS (ocean currents, SST), INCOIS (ocean state data).
        All predictions shown are simulated demonstration data.
      </div>
    </div>
  );
}
