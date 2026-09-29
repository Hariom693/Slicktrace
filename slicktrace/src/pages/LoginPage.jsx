// src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Radio, Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';
import { loginUser } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await loginUser({ email: form.email, password: form.password });
      login(
        { uid: user.uid, email: user.email || form.email, displayName: user.displayName, role: user.role || 'admin' },
        { uid: user.uid, name: user.displayName || 'Demo Analyst', email: user.email || form.email, role: user.role || 'admin', organization: 'INCOIS / Coast Guard', status: 'active' }
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (type) => {
    if (type === 'admin') setForm({ email: 'admin@slicktrace.demo', password: 'demo1234' });
    else setForm({ email: 'viewer@slicktrace.demo', password: 'demo1234' });
  };

  return (
    <div className="auth-page">
      {/* Left panel */}
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

          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 16 }}>
            Maritime Intelligence<br />
            <span style={{ color: '#14b8a6' }}>Command Center</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 40, maxWidth: 380 }}>
            Detect, trace and report oil spills at sea using satellite imagery,
            AI detection and AIS-based vessel correlation.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: '🛰️', label: 'Sentinel-1 SAR · ISRO EOS-06 · Copernicus' },
              { icon: '🤖', label: 'U-Net / DeepLabv3+ Semantic Segmentation' },
              { icon: '⚓', label: 'AIS Vessel Tracking & Attribution' },
              { icon: '🌊', label: 'OpenDrift Lagrangian Hindcast & Drift Prediction' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{item.label}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, padding: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Problem Statement</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>
              PS-26143 · Leveraging Satellite Imagery to Determine Oil Spills at Sea
              Along with AIS Data Correlations to Identify the Responsible Vessel
            </div>
            <div style={{ marginTop: 8, fontSize: '0.7rem', color: '#334155' }}>Team: SNPSU Infinova · ID: SNPSU0178 · SIH 2026</div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div style={{ maxWidth: 360, margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Shield size={15} color="#14b8a6" />
              <span style={{ fontSize: '0.72rem', color: '#14b8a6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Secure Access</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: 4 }}>Sign In</h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Authorized analysts and viewers only</p>
          </div>

          {/* Demo account pills */}
          <div style={{ display: 'flex', gap: 8, margin: '20px 0', flexWrap: 'wrap' }}>
            <button onClick={() => fillDemo('admin')} style={{
              padding: '5px 12px', background: 'rgba(20,184,166,0.1)',
              border: '1px solid rgba(20,184,166,0.25)', borderRadius: 999,
              fontSize: '0.72rem', color: '#14b8a6', cursor: 'pointer', fontWeight: 600
            }}>
              Demo Analyst
            </button>
            <button onClick={() => fillDemo('viewer')} style={{
              padding: '5px 12px', background: 'rgba(14,165,233,0.1)',
              border: '1px solid rgba(14,165,233,0.25)', borderRadius: 999,
              fontSize: '0.72rem', color: '#0ea5e9', cursor: 'pointer', fontWeight: 600
            }}>
              Demo Viewer
            </button>
            <span style={{ fontSize: '0.7rem', color: '#334155', alignSelf: 'center' }}>pw: demo1234</span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="analyst@slicktrace.demo"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                id="login-email"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  id="login-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0
                  }}
                >{showPass ? <EyeOff size={15} /> : <Eye size={15} />}</button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
              <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: '#14b8a6' }}>Forgot Password?</Link>
            </div>

            {error && (
              <div style={{
                display: 'flex', gap: 8, alignItems: 'flex-start',
                padding: '10px 14px', background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8,
                fontSize: '0.8rem', color: '#f87171', marginBottom: 16
              }}>
                <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                {error}
              </div>
            )}

            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.9rem', marginBottom: 16 }}
            >
              {loading ? 'Authenticating...' : 'Sign In to SlickTrace'}
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '0.82rem', color: '#64748b' }}>
            New user?{' '}
            <Link to="/register" style={{ color: '#14b8a6', fontWeight: 600 }}>Create Account</Link>
          </div>

          <div style={{ marginTop: 32, padding: '12px', background: 'rgba(14,165,233,0.06)', borderLeft: '3px solid #0369a1', borderRadius: '0 6px 6px 0', fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic' }}>
            SlickTrace provides analytical decision support. Vessel attribution is analytical and must be verified by
            authorized authorities before any enforcement or legal action.
          </div>
        </div>
      </div>
    </div>
  );
}
