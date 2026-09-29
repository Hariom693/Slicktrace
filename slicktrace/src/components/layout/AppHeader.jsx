// src/components/layout/AppHeader.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, Menu, AlertTriangle, User, ChevronDown, LogOut } from 'lucide-react';
import { DEMO_NOTIFICATIONS } from '../../data/demoData';

export default function AppHeader({ onMenuClick }) {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const unreadCount = DEMO_NOTIFICATIONS.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="btn btn-icon btn-ghost" onClick={onMenuClick} title="Toggle menu">
          <Menu size={18} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="status-dot active" />
          <span className="header-title">AI-Powered Oil Spill Detection & Traceability</span>
          <span className="badge badge-demo">DEMO MODE</span>
        </div>
      </div>

      <div className="header-right">
        {/* Active alert indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}>
          <AlertTriangle size={13} color="var(--red-400)" />
          <span style={{ fontSize: '0.75rem', color: 'var(--red-400)', fontWeight: 600 }}>2 ACTIVE INCIDENTS</span>
        </div>

        {/* Notifications */}
        <Link to="/notifications" style={{ position: 'relative' }}>
          <button className="btn btn-icon btn-ghost" title="Notifications">
            <Bell size={16} />
            {unreadCount > 0 && <span className="notif-dot" />}
          </button>
        </Link>

        {/* Profile dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowProfile(p => !p)}
            style={{ gap: 8 }}
          >
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, var(--teal-600), var(--navy-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'white' }}>
              {userProfile?.name?.charAt(0) || 'A'}
            </div>
            <span style={{ fontSize: '0.8rem', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userProfile?.name || 'Demo Analyst'}
            </span>
            <ChevronDown size={13} />
          </button>

          {showProfile && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              background: 'var(--navy-800)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)', padding: 8, minWidth: 200,
              boxShadow: 'var(--shadow-lg)', zIndex: 200,
            }}
              onMouseLeave={() => setShowProfile(false)}
            >
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: 4 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{userProfile?.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{userProfile?.email}</div>
                <span className="badge badge-teal" style={{ marginTop: 4 }}>{userProfile?.role === 'admin' ? 'Analyst' : 'Viewer'}</span>
              </div>
              <Link to="/profile" onClick={() => setShowProfile(false)}>
                <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'flex-start' }}>
                  <User size={13} /> Profile
                </button>
              </Link>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--red-400)' }}>
                <LogOut size={13} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
