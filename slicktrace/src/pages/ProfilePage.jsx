// src/pages/ProfilePage.jsx
import { useState } from 'react';
import { User, Shield, Building2, Mail, Clock, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { userProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: userProfile?.name || 'Demo Analyst',
    email: userProfile?.email || 'analyst@slicktrace.demo',
    organization: userProfile?.organization || 'INCOIS / Coast Guard',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const initials = form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div>
      <div className="page-header">
        <h1>User Profile</h1>
        <p>Manage your SlickTrace account information</p>
      </div>

      <div className="grid-2">
        <div>
          {/* Profile card */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #0d9488, #0369a1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
                {initials}
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#e8f1ff', marginBottom: 4 }}>{form.name}</div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 12 }}>{form.email}</div>
              <span className="badge badge-teal">{userProfile?.role === 'admin' ? 'Analyst / Admin' : 'Viewer'}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
              {[
                { icon: Building2, label: 'Organization', value: form.organization },
                { icon: Shield, label: 'Access Role', value: userProfile?.role === 'admin' ? 'Analyst / Admin' : 'Viewer' },
                { icon: Clock, label: 'Status', value: 'Active' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <item.icon size={14} color="#14b8a6" />
                  <span style={{ fontSize: '0.78rem', color: '#64748b', width: 110 }}>{item.label}</span>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Access summary */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={14} color="var(--teal-500)" />
                <span className="card-title">Access Permissions</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'View incidents', granted: true },
                { label: 'Create incidents', granted: userProfile?.role === 'admin' },
                { label: 'Upload evidence', granted: userProfile?.role === 'admin' },
                { label: 'Generate reports', granted: userProfile?.role === 'admin' },
                { label: 'View vessel attribution', granted: true },
                { label: 'Manage users', granted: userProfile?.role === 'admin' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.label}</span>
                  <span className={`badge ${item.granted ? 'badge-green' : 'badge-slate'}`}>{item.granted ? 'Granted' : 'Restricted'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edit form */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={14} color="var(--teal-500)" />
              <span className="card-title">Profile Information</span>
            </div>
            {!editing && (
              <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>Edit</button>
            )}
          </div>

          {saved && (
            <div style={{ padding: '8px 14px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 6, marginBottom: 16, fontSize: '0.8rem', color: '#4ade80' }}>
              ✓ Profile updated successfully
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" type="text" value={form.name} disabled={!editing}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={{ opacity: editing ? 1 : 0.7 }} />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" value={form.email} disabled
              style={{ opacity: 0.5, cursor: 'not-allowed' }} />
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Email cannot be changed here. Contact admin.</span>
          </div>
          <div className="form-group">
            <label className="form-label">Organization</label>
            <input className="form-input" type="text" value={form.organization} disabled={!editing}
              onChange={e => setForm(f => ({ ...f, organization: e.target.value }))}
              style={{ opacity: editing ? 1 : 0.7 }} />
          </div>
          <div className="form-group">
            <label className="form-label">User ID (UID)</label>
            <input className="form-input" type="text" value={userProfile?.uid || 'demo-admin'} disabled
              style={{ opacity: 0.5, fontFamily: 'monospace', fontSize: '0.78rem' }} />
          </div>

          {editing && (
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="btn btn-primary" onClick={handleSave}>
                <Save size={13} /> Save Changes
              </button>
              <button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          )}

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="card-title" style={{ marginBottom: 12 }}>Firestore Profile Document</div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 14, fontFamily: 'monospace', fontSize: '0.75rem', color: '#14b8a6', lineHeight: 1.8 }}>
              <div style={{ color: '#334155' }}>// users/{'{uid}'}</div>
              <div><span style={{ color: '#64748b' }}>uid:</span> "{userProfile?.uid || 'demo-admin'}"</div>
              <div><span style={{ color: '#64748b' }}>name:</span> "{form.name}"</div>
              <div><span style={{ color: '#64748b' }}>email:</span> "{form.email}"</div>
              <div><span style={{ color: '#64748b' }}>role:</span> "{userProfile?.role || 'admin'}"</div>
              <div><span style={{ color: '#64748b' }}>organization:</span> "{form.organization}"</div>
              <div><span style={{ color: '#64748b' }}>status:</span> "active"</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
