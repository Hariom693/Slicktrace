// src/pages/SatellitePage.jsx
import { useState } from 'react';
import { Satellite, Globe, Clock, CheckCircle, AlertTriangle, Activity } from 'lucide-react';
import { DEMO_SATELLITE_OBSERVATIONS } from '../data/demoData';

const ALL_SATS = [
  ...DEMO_SATELLITE_OBSERVATIONS,
  {
    id: 'SAT-004',
    satellite: 'Sentinel-1 SAR',
    acquisitionTime: '2026-09-28T06:00:00Z',
    location: '19.6°N, 67.9°E',
    dataType: 'SAR',
    band: 'C-band VH polarization',
    resolution: '10m',
    processingStatus: 'Pending',
    detectionResult: 'Processing',
    spillArea: 'N/A',
    source: 'Copernicus / ESA',
    imageUrl: null,
  },
];

function SatCard({ obs }) {
  const detected = obs.detectionResult.includes('Detected');
  const pending = obs.processingStatus === 'Pending' || obs.detectionResult === 'Processing';

  const bgColors = {
    'Sentinel-1 SAR': 'linear-gradient(135deg, #0a1628 0%, #0f2a45 60%, #062030 100%)',
    'ISRO EOS-06': 'linear-gradient(135deg, #0a1628 0%, #1a2040 60%, #061830 100%)',
    'Sentinel-2 EO': 'linear-gradient(135deg, #051520 0%, #0a2535 60%, #062025 100%)',
  };

  return (
    <div className="sat-card">
      <div className="sat-card-img" style={{ background: bgColors[obs.satellite] || bgColors['Sentinel-1 SAR'] }}>
        {/* Simulated SAR texture */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4, background: 'repeating-linear-gradient(0deg, rgba(10,40,80,0.2) 0px, rgba(10,40,80,0.2) 1px, transparent 1px, transparent 14px)' }} />
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${(i * 37 + 10) % 100}%`, top: `${(i * 53 + 15) % 100}%`,
            width: `${(i % 3) + 1}px`, height: `${(i % 3) + 1}px`,
            borderRadius: '50%', background: `rgba(255,255,255,${0.05 + (i % 5) * 0.02})`,
          }} />
        ))}
        {detected && (
          <svg style={{ position: 'absolute', width: '70%', height: '60%' }} viewBox="0 0 200 120">
            <ellipse cx="100" cy="60" rx="80" ry="32" fill="rgba(239,68,68,0.18)" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5,3" />
            <ellipse cx="95" cy="55" rx="40" ry="18" fill="rgba(239,68,68,0.2)" />
          </svg>
        )}
        <div style={{
          position: 'absolute', bottom: 8, left: 8,
          background: 'rgba(0,0,0,0.7)', padding: '3px 10px', borderRadius: 4,
          fontSize: '0.68rem', color: detected ? '#ef4444' : pending ? '#f59e0b' : '#14b8a6', fontWeight: 700
        }}>
          {detected ? '■ OIL SLICK DETECTED' : pending ? '⟳ PROCESSING' : obs.detectionResult.toUpperCase()}
        </div>
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: 4,
          fontSize: '0.62rem', color: '#94a3b8', fontFamily: 'monospace'
        }}>
          {obs.band}
        </div>
        <div style={{ position: 'absolute', top: 6, left: 8, fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>
          [SAMPLE IMAGE]
        </div>
      </div>
      <div className="sat-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#e8f1ff', marginBottom: 2 }}>{obs.satellite}</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{obs.source}</div>
          </div>
          <span className={`badge ${detected ? 'badge-red' : pending ? 'badge-amber' : 'badge-slate'}`}>
            {detected ? 'Slick Detected' : pending ? 'Pending' : 'No Slick'}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
          {[
            { label: 'Acquisition', value: new Date(obs.acquisitionTime).toISOString().slice(0, 16).replace('T', ' ') + ' UTC' },
            { label: 'Location', value: obs.location },
            { label: 'Data Type', value: obs.dataType },
            { label: 'Resolution', value: obs.resolution },
            { label: 'Processing', value: obs.processingStatus },
            { label: 'Spill Area', value: obs.spillArea },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: '0.65rem', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 500, color: '#94a3b8' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SatellitePage() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? ALL_SATS :
    filter === 'detected' ? ALL_SATS.filter(s => s.detectionResult.includes('Detected')) :
    ALL_SATS.filter(s => s.processingStatus === 'Pending' || s.detectionResult === 'Processing');

  return (
    <div>
      <div className="demo-banner">
        ⚠️ SAMPLE SATELLITE IMAGES — Not live observations. All images are simulated for prototype demonstration.
        Real integration requires Copernicus Open Access Hub / ISRO NRSC data feeds.
      </div>

      <div className="page-header">
        <h1>Satellite Intelligence</h1>
        <p>SAR and EO satellite data acquisition — Sentinel-1 SAR · Sentinel-2 EO · ISRO EOS-06 · Copernicus</p>
      </div>

      {/* Source summary */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { sat: 'Sentinel-1 SAR', src: 'Copernicus / ESA', type: 'SAR (C-band)', status: 'Active', color: 'ocean' },
          { sat: 'Sentinel-2 EO', src: 'Copernicus / ESA', type: 'Multispectral', status: 'Active', color: 'teal' },
          { sat: 'ISRO EOS-06', src: 'ISRO / NRSC', type: 'Ocean Colour', status: 'Active', color: 'amber' },
          { sat: 'CMEMS / ERA5', src: 'Copernicus Marine / ECMWF', type: 'Met-Ocean', status: 'Active', color: 'green' },
        ].map(s => (
          <div key={s.sat} className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div className={`stat-icon ${s.color}`}><Satellite size={16} /></div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e8f1ff' }}>{s.sat}</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{s.src}</div>
              </div>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: 6 }}>Type: {s.type}</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <div className="status-dot active" />
              <span style={{ fontSize: '0.7rem', color: '#4ade80' }}>{s.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          { key: 'all', label: `All Observations (${ALL_SATS.length})` },
          { key: 'detected', label: 'Slick Detected' },
          { key: 'pending', label: 'Pending / Processing' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`btn btn-sm ${filter === f.key ? 'btn-primary' : 'btn-ghost'}`}
          >{f.label}</button>
        ))}
      </div>

      {/* Satellite cards */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {filtered.map(obs => <SatCard key={obs.id} obs={obs} />)}
      </div>

      {/* Data sources table */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe size={14} color="var(--ocean-500)" />
            <span className="card-title">Data Sources & Integration Architecture</span>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Source</th>
                <th>Data Type</th>
                <th>Use in SlickTrace</th>
                <th>Access Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { src: 'Sentinel-1 SAR', type: 'SAR C-band', use: 'Primary oil slick detection', access: 'Copernicus Open Access Hub', status: 'Simulated' },
                { src: 'Sentinel-2 EO', type: 'Multispectral', use: 'Visual confirmation & oil type', access: 'Copernicus Open Access Hub', status: 'Simulated' },
                { src: 'ISRO EOS-06', type: 'Ocean Colour (OCM-3)', use: 'Complementary detection', access: 'ISRO NRSC / Bhuvan', status: 'Simulated' },
                { src: 'INCOIS', type: 'Ocean State Data', use: 'Met-ocean conditions for drift', access: 'INCOIS API', status: 'Planned' },
                { src: 'CMEMS', type: 'Ocean Currents, SST', use: 'OpenDrift environmental input', access: 'Copernicus Marine Service', status: 'Planned' },
                { src: 'ERA5', type: 'Wind, Waves', use: 'OpenDrift wind-vector input', access: 'ECMWF CDS API', status: 'Planned' },
                { src: 'AIS (MarineTraffic)', type: 'Vessel AIS Tracks', use: 'Vessel correlation & attribution', access: 'AIS API / VTS feeds', status: 'Simulated' },
              ].map(row => (
                <tr key={row.src}>
                  <td style={{ fontWeight: 600, color: '#e8f1ff', fontFamily: 'monospace', fontSize: '0.8rem' }}>{row.src}</td>
                  <td>{row.type}</td>
                  <td>{row.use}</td>
                  <td style={{ color: '#64748b', fontSize: '0.78rem' }}>{row.access}</td>
                  <td>
                    <span className={`badge ${row.status === 'Simulated' ? 'badge-amber' : row.status === 'Planned' ? 'badge-ocean' : 'badge-green'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="disclaimer">
        Prototype demonstration — satellite data shown is simulated. Real-time integration requires
        Copernicus Open Access Hub, ISRO NRSC, INCOIS and CMEMS API credentials.
      </div>
    </div>
  );
}
