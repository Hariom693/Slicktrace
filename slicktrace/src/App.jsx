// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Suspense, lazy } from 'react';

// Auth pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// App layout
import AppLayout from './components/layout/AppLayout';

// Dashboard pages
import DashboardPage from './pages/DashboardPage';
import DetectionPage from './pages/DetectionPage';
import SatellitePage from './pages/SatellitePage';
import VesselTrackingPage from './pages/VesselTrackingPage';
import DriftPredictionPage from './pages/DriftPredictionPage';
import AttributionPage from './pages/AttributionPage';
import TimelinePage from './pages/TimelinePage';
import EvidenceLockPage from './pages/EvidenceLockPage';
import ReportsPage from './pages/ReportsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

// Loading spinner
const LoadingScreen = () => (
  <div className="loading-overlay">
    <div style={{ textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto 16px' }} />
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>SlickTrace Loading...</div>
    </div>
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Public-only route (redirect to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

      {/* Protected app routes */}
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="detection" element={<DetectionPage />} />
        <Route path="satellite" element={<SatellitePage />} />
        <Route path="vessel-tracking" element={<VesselTrackingPage />} />
        <Route path="drift-prediction" element={<DriftPredictionPage />} />
        <Route path="attribution" element={<AttributionPage />} />
        <Route path="timeline" element={<TimelinePage />} />
        <Route path="evidence" element={<EvidenceLockPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0d1f38',
              color: '#e8f1ff',
              border: '1px solid rgba(255,255,255,0.08)',
              fontSize: '0.85rem',
            },
          }}
        />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
