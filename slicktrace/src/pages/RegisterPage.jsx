// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Radio, AlertTriangle, UserPlus } from 'lucide-react';
import { registerUser } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', organization: '', role: 'viewer', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const user = await registerUser({ email: form.email, password: form.password, name: form.name, organization: form.organization, role: form.role });
      login(
        { uid: user.uid, email: form.email, displayName: form.name, role: form.role },
        { uid: user.uid, name: form.name, email: form.email, role: form.role, organization: form.organization, status: 'active' }
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #0d9488, #0369a1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Radio size={18} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>SlickTrace</div>
              <div style={{ fontSize: '0.62rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI-Powered Oil Spill Detection</div>
            </div>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 16 }}>
            Join the<br /><span style={{ color: '#14b8a6' }}>SlickTrace Platform</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 32, maxWidth: 380 }}>
            Create an authorized account to access the SlickTrace decision-support
            dashboard for oil spill detection and vessel attribution.
          </p>
          <div style={{ padding: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>User Roles</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.8 }}>
              <div><strong style={{ color: '#14b8a6' }}>Analyst/Admin</strong> — Full access: create incidents, upload evidence, generate reports</div>
              <div><strong style={{ color: '#0ea5e9' }}>Viewer</strong> — Read-only access to incidents and reports</div>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div style={{ maxWidth: 360, margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <UserPlus size={15} color="#14b8a6" />
              <span style={{ fontSize: '0.72rem', color: '#14b8a6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>New Account</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: 4 }}>Create Account</h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Register for SlickTrace access</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" placeholder="Your Name" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required id="reg-name" />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="you@organization.gov" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required id="reg-email" />
            </div>
            <div className="form-group">
              <label className="form-label">Organization</label>
              <input className="form-input" type="text" placeholder="INCOIS / Coast Guard / etc." value={form.organization}
                onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} id="reg-org" />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-input" value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))} id="reg-role">
                <option value="viewer">Viewer</option>
                <option value="admin">Analyst / Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min. 6 characters" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required id="reg-password" />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input className="form-input" type="password" placeholder="Repeat password" value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} required id="reg-confirm" />
            </div>

            {error && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, fontSize: '0.8rem', color: '#f87171', marginBottom: 16 }}>
                <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                {error}
              </div>
            )}

            <button type="submit" id="reg-submit" disabled={loading} className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.9rem', marginBottom: 16 }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '0.82rem', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#14b8a6', fontWeight: 600 }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
