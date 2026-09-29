SlickTrace 🌊🛰️

AI-Powered Oil Spill Detection & Traceability

SlickTrace is a disaster-management platform for detecting oil spills at sea.
It uses satellite imagery, AI/ML, ocean data, and AIS vessel data.
The system automatically detects possible oil slicks from satellite images.
It identifies the location and estimated starting time of a spill.
Historical AIS data is used to find vessels near the spill location.
The system analyzes vessel movements and possible source areas.
OpenDrift is used for backward and forward spill drift prediction.
Backward hindcast helps estimate the probable spill source region and time.
Forward prediction helps estimate the future spill trajectory.
U-Net / DeepLabv3 models are used for oil slick segmentation.
Look-alike removal helps reduce false oil-spill detections.
XGBoost is used for explainable vessel attribution.
SHAP values help explain the vessel scoring process.

🛰️ Data Sources
Sentinel-1 SAR
Sentinel-2 EO
ISRO EOS-06
Copernicus Data Space
AIS Vessel Data
INCOIS Ocean Data
CMEMS
ERA5 Weather Data
⚙️ Technology Stack
Python
PyTorch
OpenCV
OpenDrift
GeoPandas
PostgreSQL/PostGIS
FastAPI
React
Firebase
Docker
QGIS
📊 Dashboard Features
Interactive oil-spill map
Satellite imagery visualization
Vessel track visualization
3D ship visualization
Spill detection information
Drift prediction
Vessel attribution
Evidence timeline
Evidence Locker
Analytics and reports

Firebase can be used for authentication and application data storage.
The dashboard provides a single place for investigation and analysis.
The system aims to reduce manual investigation time.
It combines satellite, ocean, weather, and vessel information.
The system provides evidence and reasoning instead of only an ML score.
Possible risks include AIS gaps and satellite look-alikes.
Weather and ocean-current uncertainty can affect drift prediction.
False vessel attribution is another important risk.
Future improvements can include stronger cybersecurity and RBAC.
The system can also use HPC/cloud processing for faster analysis.
SlickTrace supports faster response and better spill traceability.
