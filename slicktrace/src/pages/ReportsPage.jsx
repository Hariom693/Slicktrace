// src/pages/ReportsPage.jsx
import { useState } from 'react';
import { FileText, Download, Printer, Share2, AlertTriangle, CheckCircle } from 'lucide-react';
import { DEMO_INCIDENTS, DEMO_VESSELS, DEMO_ATTRIBUTIONS, DEMO_DRIFT_DATA } from '../data/demoData';

const inc = DEMO_INCIDENTS[0];
const primaryAttr = DEMO_ATTRIBUTIONS[0];

function ReportSection({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value, highlight }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
      <span style={{ fontSize: '0.78rem', color: '#64748b', minWidth: 200 }}>{label}</span>
      <span style={{ fontSize: '0.82rem', fontWeight: highlight ? 600 : 400, color: highlight ? '#e8f1ff' : '#94a3b8', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

export default function ReportsPage() {
  const [showReport, setShowReport] = useState(false);

  return (
    <div>
      <div className="demo-banner">
        ⚠️ DEMO REPORT — All content is simulated prototype data for demonstration purposes.
      </div>

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Incident Reports</h1>
          <p>Generate, view and share incident reports for authorized authorities</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowReport(true)}>
          <FileText size={14} /> Generate Report
        </button>
      </div>

      {/* Report list */}
      {!showReport && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <span className="card-title">Available Reports</span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Incident</th>
                  <th>Location</th>
                  <th>Generated</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'RPT-0142-A', inc: 'INC-2026-0142', loc: 'Arabian Sea 19.4°N, 68.2°E', date: '2026-09-27 11:45 UTC', status: 'Final' },
                  { id: 'RPT-0141-A', inc: 'INC-2026-0141', loc: 'Bay of Bengal 13.2°N, 82.6°E', date: '2026-09-25 15:00 UTC', status: 'Draft' },
                  { id: 'RPT-0138-A', inc: 'INC-2026-0138', loc: 'Lakshadweep Sea 10.8°N, 73.4°E', date: '2026-09-22 17:00 UTC', status: 'Archived' },
                ].map(r => (
                  <tr key={r.id}>
                    <td style={{ fontFamily: 'monospace', color: '#14b8a6', fontSize: '0.78rem' }}>{r.id}</td>
                    <td style={{ fontWeight: 600, color: '#e8f1ff' }}>{r.inc}</td>
                    <td>{r.loc}</td>
                    <td style={{ color: '#64748b', fontSize: '0.78rem' }}>{r.date}</td>
                    <td>
                      <span className={`badge ${r.status === 'Final' ? 'badge-green' : r.status === 'Draft' ? 'badge-amber' : 'badge-slate'}`}>{r.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setShowReport(true)}>View</button>
                        <button className="btn btn-ghost btn-sm"><Download size={11} /></button>
                        <button className="btn btn-ghost btn-sm"><Share2 size={11} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showReport && (
        <div>
          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowReport(false)}>← Back to List</button>
            <button className="btn btn-secondary btn-sm"><Download size={13} /> Download PDF</button>
            <button className="btn btn-secondary btn-sm"><Printer size={13} /> Print</button>
            <button className="btn btn-secondary btn-sm"><Share2 size={13} /> Share</button>
          </div>

          {/* Report document */}
          <div style={{ background: '#0d1f38', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '40px 48px', maxWidth: 860, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 32, paddingBottom: 24, borderBottom: '2px solid rgba(20,184,166,0.3)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>
                GOVERNMENT OF INDIA — DISASTER MANAGEMENT SUPPORT
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: 4 }}>SLICKTRACE</div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 16 }}>AI-Powered Oil Spill Detection & Traceability</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e8f1ff' }}>OIL SPILL INCIDENT REPORT</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: 6 }}>
                Report ID: RPT-0142-A &nbsp;|&nbsp; Incident: INC-2026-0142 &nbsp;|&nbsp; Generated: 2026-09-27 11:45 UTC
              </div>
              <div style={{ marginTop: 12, padding: '6px 16px', display: 'inline-block', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 999, fontSize: '0.72rem', color: '#f87171', fontWeight: 700, letterSpacing: '0.06em' }}>
                ⚠️ PROTOTYPE DEMONSTRATION — DATA IS SIMULATED
              </div>
            </div>

            {/* Executive Summary */}
            <ReportSection title="1. Executive Summary">
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.8 }}>
                On 2026-09-26 at 08:32 UTC, an oil slick of approximately <strong style={{ color: '#e8f1ff' }}>47.3 km²</strong> was
                detected in the <strong style={{ color: '#e8f1ff' }}>Arabian Sea</strong> at coordinates
                <strong style={{ color: '#14b8a6' }}> 19.4°N, 68.2°E</strong> using Sentinel-1 SAR imagery processed
                by the SlickTrace AI pipeline (U-Net semantic segmentation). Backward Lagrangian hindcast using OpenDrift
                traced the probable spill origin to <strong style={{ color: '#e8f1ff' }}>19.2°N, 68.6°E</strong> at approximately
                02:00 UTC (T-6h). AIS cross-referencing identified <strong style={{ color: '#f87171' }}>MT ARABIAN STAR</strong> as
                the highest-priority candidate vessel with an analytical attribution score of 87%.
              </p>
            </ReportSection>

            {/* Detection Information */}
            <ReportSection title="2. SAR Detection Information">
              <InfoRow label="Satellite Source" value="Sentinel-1 SAR (C-band VV polarization)" highlight />
              <InfoRow label="Data Provider" value="Copernicus / European Space Agency" />
              <InfoRow label="Acquisition Time" value="2026-09-26 08:32:00 UTC" highlight />
              <InfoRow label="Detected Slick Location" value="19.4°N, 68.2°E (centroid)" highlight />
              <InfoRow label="Detected Slick Area" value="47.3 km²" highlight />
              <InfoRow label="Image Resolution" value="10 m (GRD product)" />
              <InfoRow label="Detection Model" value="U-Net (PyTorch) — Semantic Segmentation" highlight />
              <InfoRow label="Look-Alike Removal" value="Random Forest / XGBoost classifier applied" />
              <InfoRow label="Polygon Format" value="GeoJSON (EPSG:4326 WGS84)" />
              <InfoRow label="Processing Status" value="Processed — Complete" />
            </ReportSection>

            {/* Spill Characterization */}
            <ReportSection title="3. Spill Characterization">
              <InfoRow label="Slick Area" value="47.3 km²" highlight />
              <InfoRow label="Elongation Ratio" value="4.2 (elongated — consistent with petroleum oil)" />
              <InfoRow label="Backscatter Value (σ°)" value="-18.4 dB (dark — consistent with oil slick)" />
              <InfoRow label="Sea Surface Temperature (CMEMS)" value="28.4°C" />
              <InfoRow label="Wind Speed (ERA5)" value="6.4 m/s NW" />
              <InfoRow label="Ocean Current Speed (CMEMS)" value="0.43 m/s westward" />
            </ReportSection>

            {/* Hindcast */}
            <ReportSection title="4. Backward Lagrangian Hindcast">
              <InfoRow label="Model" value="OpenDrift (backward mode)" highlight />
              <InfoRow label="Environmental Input — Wind" value="ERA5 (ECMWF)" />
              <InfoRow label="Environmental Input — Currents" value="CMEMS (Copernicus Marine Service)" />
              <InfoRow label="Environmental Input — Ocean State" value="INCOIS" />
              <InfoRow label="Probable Source Region" value="19.2°N, 68.6°E (radius ~12 km)" highlight />
              <InfoRow label="Estimated Spill Start Time" value="2026-09-26 ~02:00 UTC (±2h)" highlight />
              <InfoRow label="Hindcast Duration" value="18 hours backward" />
            </ReportSection>

            {/* Forward Drift */}
            <ReportSection title="5. Forward Drift Prediction">
              <InfoRow label="Model" value="OpenDrift (forward mode)" highlight />
              <InfoRow label="Prediction Horizon" value="48 hours" />
              <InfoRow label="Predicted Direction" value="North-West (~1.2 km/h)" />
              <InfoRow label="Predicted Position T+48h" value="19.85°N, 67.5°E" highlight />
              <InfoRow label="Environmental Input" value="ERA5 (winds) + CMEMS (currents)" />
            </ReportSection>

            {/* Vessel Attribution */}
            <ReportSection title="6. AIS Vessel Correlation & Attribution">
              <div style={{ padding: '12px 14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, marginBottom: 16 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  ⚠️ Analytical Attribution — NOT Legal Determination
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  The following represents analytical vessel ranking based on XGBoost + SHAP scoring of
                  AIS, spatial and temporal evidence. This is not a legal finding of responsibility.
                </div>
              </div>
              <InfoRow label="Primary Candidate" value="MT ARABIAN STAR (VSL-001)" highlight />
              <InfoRow label="Attribution Status" value="Potential Responsible Vessel" highlight />
              <InfoRow label="Attribution Score (XGBoost)" value="87%" highlight />
              <InfoRow label="AIS Gap Detected" value="42 minutes near source region" highlight />
              <InfoRow label="Vessel Type" value="Oil Tanker" />
              <InfoRow label="Flag State" value="Panama" />
              <InfoRow label="Distance from Source at T-6h" value="8.7 km" highlight />
              <InfoRow label="SHAP Top Factor" value="AIS Proximity to Hindcast Source (92%)" />
            </ReportSection>

            {/* Evidence References */}
            <ReportSection title="7. Evidence References">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['EV-001: Sentinel-1 SAR Image', 'EV-002: Detected Slick Polygon (GDAL)', 'EV-003: AIS Track — MT ARABIAN STAR', 'EV-004: OpenDrift Backward Hindcast Result', 'EV-005: XGBoost/SHAP Attribution Analysis', 'EV-006: OpenDrift Forward Drift Prediction'].map(ev => (
                  <div key={ev} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#94a3b8' }}>
                    <CheckCircle size={12} color="#14b8a6" />
                    {ev}
                  </div>
                ))}
              </div>
            </ReportSection>

            {/* Footer */}
            <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', fontSize: '0.72rem', color: '#334155', lineHeight: 1.8 }}>
              <div style={{ marginBottom: 8 }}>
                Generated by <strong style={{ color: '#64748b' }}>SlickTrace</strong> · SNPSU Infinova · Team ID: SNPSU0178 · Smart India Hackathon 2026
              </div>
              <div style={{ fontStyle: 'italic' }}>
                SlickTrace provides analytical decision support based on available satellite, environmental and AIS data.
                Vessel attribution is analytical and should be verified by authorized authorities before enforcement or legal action.
                Prototype demonstration — data shown is simulated and not a live operational feed.
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="disclaimer">
        Reports generated by SlickTrace are analytical decision-support documents.
        They do not constitute legal evidence or findings of responsibility until verified by authorized authorities.
      </div>
    </div>
  );
}
