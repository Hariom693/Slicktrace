# SlickTrace

**AI-Powered Oil Spill Detection & Traceability**

> Smart India Hackathon 2026 · Problem Statement ID: 26143 · Team: SNPSU Infinova · ID: SNPSU0178

---

## Overview

SlickTrace is a decision-support platform for detecting oil spills at sea using satellite imagery and correlating the detected spill with AIS vessel data to identify possible responsible vessels.

**Problem Statement:** Leveraging Satellite Imagery to Determine Oil Spills at Sea Along with AIS Data Correlations to Identify the Responsible Vessel

**Theme:** Disaster Management | **Category:** Software

---

## Features

| Module | Description |
|---|---|
| 🛰️ **Satellite Intelligence** | Sentinel-1 SAR, Sentinel-2 EO, ISRO EOS-06, Copernicus data cards |
| 🤖 **AI Detection Pipeline** | U-Net / DeepLabv3+ semantic segmentation, SAR pre-processing |
| 🔍 **Look-Alike Removal** | Random Forest / XGBoost classification of false positives |
| ⚓ **AIS Vessel Tracking** | Historical AIS vessel tracks, spatial correlation |
| 🌊 **Drift Prediction** | OpenDrift backward hindcast + forward drift prediction |
| 📊 **Explainable Attribution** | XGBoost + SHAP evidence factors, vessel ranking |
| 🗂️ **Evidence Locker** | Firebase Storage + Firestore metadata, hash architecture |
| 📋 **Incident Reports** | Professional formatted reports for authorities |
| ⏱️ **Unified Timeline** | Complete chronological evidence chain |
| 🚢 **3D Visualization** | Three.js vessel + oil spill animated visualization |

---

## Pages

| Route | Page |
|---|---|
| `/` | Landing page |
| `/login` | Government-style login |
| `/register` | Account registration |
| `/forgot-password` | Password recovery |
| `/dashboard` | Overview dashboard with live map + 3D ship |
| `/detection` | Oil spill detection pipeline |
| `/satellite` | Satellite Intelligence |
| `/vessel-tracking` | AIS vessel tracking & analytics |
| `/drift-prediction` | Backward hindcast & forward drift |
| `/attribution` | Explainable vessel attribution (XGBoost + SHAP) |
| `/timeline` | Unified Evidence & Timeline |
| `/evidence` | Evidence Locker |
| `/reports` | Incident report generation |
| `/notifications` | System notifications |
| `/profile` | User profile |
| `/settings` | Application settings |

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Setup

```bash
# Clone / navigate to project
cd slicktrace

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your Firebase credentials (or leave as demo mode)

# Start dev server
npm run dev
```

Open **http://localhost:5173**

### Demo Login

In demo mode (`VITE_DEMO_MODE=true`), use:
- **Email:** `admin@slicktrace.demo` or any email
- **Password:** `demo1234`

---

## Environment Variables

```env
# Firebase Configuration (required for real auth/storage)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Application
VITE_APP_NAME=SlickTrace
VITE_APP_ENV=development
VITE_DEMO_MODE=true   # Set false to use real Firebase
```

---

## Firebase Architecture

### Authentication
- Firebase Authentication (email/password)
- Role-based: `admin` (Analyst) | `viewer`

### Firestore Collections

| Collection | Purpose |
|---|---|
| `users` | User profiles with role, org, status |
| `incidents` | Oil spill incidents |
| `satelliteObservations` | SAR/EO acquisition records |
| `oilSpills` | Detected slick geometry and metadata |
| `vessels` | AIS vessel profiles |
| `aisTracks` | Historical AIS track data |
| `driftPredictions` | OpenDrift simulation results |
| `attributions` | XGBoost vessel attribution scores + SHAP |
| `timelineEvents` | Chronological incident events |
| `evidence` | Evidence metadata with hash fields |
| `reports` | Generated report metadata |
| `notifications` | System alert records |

### Firebase Storage Structure

```
incidents/{incidentId}/
  satellite/     ← SAR/EO images
  detections/    ← Slick polygon files
  ais/           ← AIS track exports
  drift/         ← OpenDrift output files
  reports/       ← Generated PDF reports
```

---

## Technology Stack

### Frontend
- React 19 + Vite
- React Router DOM v7
- Leaflet / React-Leaflet (maps)
- Three.js / React Three Fiber (3D visualization)
- Recharts (data visualization)
- Lucide React (icons)

### Firebase (Prototype Layer)
- Firebase Authentication
- Cloud Firestore
- Firebase Storage

### AI/ML (Backend — represented in pipeline)
- PyTorch · U-Net · DeepLabv3+
- OpenCV · GDAL
- Random Forest · XGBoost · SHAP
- Python · FastAPI

### Geospatial (Target Architecture)
- PostgreSQL + PostGIS
- GeoPandas · GDAL · QGIS

### Data Sources
- Sentinel-1 SAR (Copernicus / ESA)
- Sentinel-2 EO (Copernicus / ESA)
- ISRO EOS-06 (ISRO / NRSC)
- INCOIS Ocean Data
- CMEMS (Copernicus Marine Service)
- ERA5 (ECMWF)
- AIS vessel data

### Drift Modelling
- OpenDrift (Lagrangian particle simulation)

---

## User Roles

| Role | Permissions |
|---|---|
| **Admin / Analyst** | View + create incidents, upload evidence, generate reports, full dashboard |
| **Viewer** | Read-only access to incidents, reports, dashboard |

---

## Deployment

```bash
# Production build
npm run build

# Deploy dist/ folder to:
# - Firebase Hosting
# - Vercel
# - Netlify
# - Any static host
```

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## Disclaimer

> SlickTrace provides analytical decision support based on available satellite, environmental and AIS data.
> Vessel attribution is analytical and should be verified by authorized authorities before enforcement or legal action.
> This prototype uses simulated data and is not a live operational feed.

---

## Project Information

| Field | Value |
|---|---|
| Problem Statement ID | 26143 |
| Theme | Disaster Management |
| Category | Software |
| Team ID | SNPSU0178 |
| Team Name | SNPSU Infinova |
| Product | SlickTrace |
| Event | Smart India Hackathon 2026 |
