export type UserRole = 'admin' | 'analyst' | 'viewer'
export type AppUser = {
  uid: string
  name: string
  email: string
  role: UserRole
  organization: string
}

export type Vessel = {
  id: string
  name: string
  status: string
  position: string
  speed: string
  course: string
  distance: string
  correlation: string
  priority: 'High' | 'Medium' | 'Low'
  factors: { name: string; score: number }[]
}

export type EvidenceItem = {
  id: string
  type: string
  source: string
  timestamp: string
  location: string
  hash: string
  uploadedBy: string
  createdAt: string
  storageUrl?: string
}

export const vessels: Vessel[] = [
  {
    id: 'MMSI 419001284',
    name: 'Demo Vessel 01',
    status: 'Active',
    position: '15.08° N, 72.64° E',
    speed: '11.8 kn',
    course: '248°',
    distance: '4.2 nm',
    correlation: 'High',
    priority: 'High',
    factors: [
      { name: 'AIS proximity', score: 86 },
      { name: 'Temporal overlap', score: 72 },
      { name: 'Source-region overlap', score: 84 },
      { name: 'Historical track', score: 64 },
      { name: 'Drift consistency', score: 78 },
    ],
  },
  {
    id: 'MMSI 419008572',
    name: 'MV Coastal Meridian',
    status: 'Active',
    position: '15.11° N, 72.51° E',
    speed: '8.4 kn',
    course: '192°',
    distance: '7.6 nm',
    correlation: 'Medium',
    priority: 'Medium',
    factors: [
      { name: 'AIS proximity', score: 68 },
      { name: 'Temporal overlap', score: 62 },
      { name: 'Source-region overlap', score: 54 },
      { name: 'Historical track', score: 71 },
      { name: 'Drift consistency', score: 58 },
    ],
  },
  {
    id: 'MMSI 419006031',
    name: 'Demo Cargo 03',
    status: 'Intermittent',
    position: '15.19° N, 72.82° E',
    speed: '13.2 kn',
    course: '278°',
    distance: '12.1 nm',
    correlation: 'Low',
    priority: 'Low',
    factors: [
      { name: 'AIS proximity', score: 42 },
      { name: 'Temporal overlap', score: 36 },
      { name: 'Source-region overlap', score: 31 },
      { name: 'Historical track', score: 49 },
      { name: 'Drift consistency', score: 38 },
    ],
  },
]

export const timelineEvents = [
  { offset: 'T − 18h', title: 'Backward hindcast initiated', source: 'OpenDrift · ERA5', location: 'Arabian Sea analysis domain', evidence: 'hindcast-run-07' },
  { offset: 'T − 12h', title: 'Probable source region & time estimated', source: 'OpenDrift · CMEMS', location: '15.06° N, 72.69° E', evidence: 'source-region-v1' },
  { offset: 'T − 8h', title: 'AIS track intersects source-region window', source: 'Historical AIS Vessel Tracks', location: '15.08° N, 72.64° E', evidence: 'ais-correlation-03' },
  { offset: 'T − 4h', title: 'Sample Sentinel-1 SAR observation acquired', source: 'Copernicus Earth Observation Data', location: '15.12° N, 72.71° E', evidence: 'sample-s1-scene' },
  { offset: 'T0', title: 'Oil Slick Detection completed', source: 'U-Net · SAR pre-processing', location: '15.12° N, 72.71° E', evidence: 'slick-polygon-01' },
  { offset: 'T + 12h', title: 'Forward Drift Prediction completed', source: 'OpenDrift · INCOIS Ocean Data', location: 'Arabian Sea forecast domain', evidence: 'drift-forecast-12h' },
  { offset: 'T + 24h', title: 'Predicted Spill Trajectory available', source: 'OpenDrift · CMEMS · ERA5', location: 'Forecast analysis domain', evidence: 'trajectory-24h' },
]

export const sampleEvidence: EvidenceItem[] = [
  { id: 'EV-2401', type: 'Satellite Image', source: 'Sentinel-1 SAR · SAMPLE', timestamp: '2026-09-28 04:12 UTC', location: '15.12° N, 72.71° E', hash: 'Pending cryptographic hashing', uploadedBy: 'System demo', createdAt: '2026-09-28' },
  { id: 'EV-2402', type: 'AIS Track', source: 'Simulated AIS Track', timestamp: '2026-09-28 03:48 UTC', location: 'Arabian Sea', hash: 'Pending cryptographic hashing', uploadedBy: 'System demo', createdAt: '2026-09-28' },
  { id: 'EV-2403', type: 'Drift Prediction', source: 'OpenDrift · DEMO RUN', timestamp: '2026-09-28 05:05 UTC', location: 'Arabian Sea analysis domain', hash: 'Pending cryptographic hashing', uploadedBy: 'System demo', createdAt: '2026-09-28' },
]

export const workflow = [
  'Multi-source data acquisition',
  'SAR pre-processing pipeline',
  'AI-based Oil Slick Detection',
  'Look-Alike Removal & Characterization',
  'Georeferenced Slick Polygon',
  'Backward Lagrangian Hindcast',
  'Probable Source Region & Time',
  'AIS Track Integration',
  'Explainable Vessel Attribution',
  'Forward Drift Prediction',
  'Predicted Spill Trajectory',
  'Decision-support dashboard',
  'Evidence / Incident Report',
]

export const disclaimer = 'SlickTrace provides analytical decision support based on available satellite, environmental and AIS data. Vessel attribution is analytical and should be verified by authorized authorities before enforcement or legal action.'
