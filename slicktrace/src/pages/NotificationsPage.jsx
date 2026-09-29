// src/pages/NotificationsPage.jsx
import { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Info, X, MailOpen } from 'lucide-react';
import { DEMO_NOTIFICATIONS } from '../data/demoData';

const TYPE_CONFIG = {
  alert: { icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
  info: { icon: Info, color: '#0ea5e9', bg: 'rgba(14,165,233,0.06)', border: 'rgba(14,165,233,0.15)' },
  success: { icon: CheckCircle, color: '#22c55e', bg: 'rgba(34,197,94,0.06)', border: 'rgba(34,197,94,0.15)' },
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(DEMO_NOTIFICATIONS);
  const [filter, setFilter] = useState('all');

  const markRead = (id) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const dismiss = (id) => setNotifs(n => n.filter(x => x.id !== id));

  const filtered = filter === 'all' ? notifs : filter === 'unread' ? notifs.filter(n => !n.read) : notifs.filter(n => n.type === filter);
  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Notifications</h1>
          <p>System alerts, incident updates and pipeline notifications</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {unreadCount > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={markAllRead}>
              <MailOpen size={13} /> Mark all read
            </button>
          )}
          <span className={`badge ${unreadCount > 0 ? 'badge-red' : 'badge-slate'}`}>
            {unreadCount} unread
          </span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: `All (${notifs.length})` },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'alert', label: 'Alerts' },
          { key: 'info', label: 'Info' },
          { key: 'success', label: 'Success' },
        ].map(f => (
          <button key={f.key} className={`btn btn-sm ${filter === f.key ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <Bell size={32} color="#334155" style={{ margin: '0 auto 12px' }} />
            <div style={{ color: '#64748b' }}>No notifications</div>
          </div>
        )}
        {filtered.map(n => {
          const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
          const Icon = cfg.icon;
          return (
            <div
              key={n.id}
              style={{
                background: n.read ? 'var(--bg-card)' : cfg.bg,
                border: `1px solid ${n.read ? 'rgba(255,255,255,0.08)' : cfg.border}`,
                borderRadius: 10, padding: '14px 16px',
                display: 'flex', gap: 14, alignItems: 'flex-start',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onClick={() => markRead(n.id)}
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${cfg.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={16} color={cfg.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div style={{ fontWeight: n.read ? 500 : 700, fontSize: '0.9rem', color: '#e8f1ff' }}>{n.title}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0, marginLeft: 12 }}>
                    {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color }} />}
                    <span style={{ fontSize: '0.7rem', color: '#334155' }}>
                      {new Date(n.time).toISOString().slice(0, 16).replace('T', ' ')} UTC
                    </span>
                    <button
                      onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#334155', padding: 2 }}
                    ><X size={13} /></button>
                  </div>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{n.message}</div>
                <div style={{ marginTop: 6 }}>
                  <span className={`badge badge-${n.type === 'alert' ? 'red' : n.type === 'success' ? 'green' : 'ocean'}`} style={{ fontSize: '0.62rem' }}>
                    {n.type.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
