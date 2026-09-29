// src/components/layout/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Satellite, Ship, Activity, GitBranch,
  UserCheck, Clock, Archive, FileText, Bell, User,
  Settings, LogOut, ChevronLeft, ChevronRight, Radio, Waves
} from 'lucide-react';

const NAV_ITEMS = [
  { section: 'MONITORING', items: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/detection', icon: Activity, label: 'Spill Detection' },
    { to: '/satellite', icon: Satellite, label: 'Satellite Intel' },
  ]},
  { section: 'ANALYSIS', items: [
    { to: '/vessel-tracking', icon: Ship, label: 'Vessel Tracking' },
    { to: '/drift-prediction', icon: Waves, label: 'Drift Prediction' },
    { to: '/attribution', icon: UserCheck, label: 'Attribution' },
  ]},
  { section: 'EVIDENCE', items: [
    { to: '/timeline', icon: Clock, label: 'Evidence Timeline' },
    { to: '/evidence', icon: Archive, label: 'Evidence Locker' },
    { to: '/reports', icon: FileText, label: 'Reports' },
  ]},
  { section: 'SYSTEM', items: [
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ]},
];

export default function Sidebar({ collapsed, onToggle }) {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = userProfile?.name
    ? userProfile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'DA';

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Radio size={16} color="white" />
        </div>
        {!collapsed && (
          <div className="sidebar-logo-text">
            <h2>SlickTrace</h2>
            <span>Oil Spill Detection</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="btn btn-icon btn-ghost"
          style={{ marginLeft: 'auto', padding: '4px', minWidth: 28 }}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(section => (
          <div key={section.section}>
            {!collapsed && <div className="nav-section-label">{section.section}</div>}
            {section.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <item.icon size={16} />
                {!collapsed && <span className="nav-item-label">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          {!collapsed && (
            <div className="sidebar-user-info">
              <strong className="truncate">{userProfile?.name || 'Demo Analyst'}</strong>
              <span>{userProfile?.role === 'admin' ? 'Analyst' : 'Viewer'}</span>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-ghost btn-sm"
          style={{ width: '100%', marginTop: 10, justifyContent: collapsed ? 'center' : 'flex-start' }}
          title="Logout"
        >
          <LogOut size={14} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
