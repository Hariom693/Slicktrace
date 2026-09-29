// src/pages/ForgotPasswordPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Radio, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { resetPassword } from '../firebase/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 440, padding: '60px 40px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #0d9488, #0369a1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Radio size={18} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>SlickTrace</div>
            <div style={{ fontSize: '0.62rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Password Recovery</div>
          </div>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, background: 'rgba(20,184,166,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={28} color="#14b8a6" />
            </div>
            <h2 style={{ color: '#fff', marginBottom: 8 }}>Reset Email Sent</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: 32 }}>
              If an account exists for <strong style={{ color: '#94a3b8' }}>{email}</strong>, a password reset link has been sent.
            </p>
            <Link to="/login">
              <button className="btn btn-primary" style={{ justifyContent: 'center' }}>
                <ArrowLeft size={14} /> Back to Sign In
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Mail size={15} color="#14b8a6" />
              <span style={{ fontSize: '0.72rem', color: '#14b8a6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Account Recovery</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: 8 }}>Forgot Password?</h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 28 }}>
              Enter your registered email and we'll send you a password reset link.
            </p>

            {import.meta.env.VITE_DEMO_MODE === 'true' && (
              <div className="demo-banner" style={{ marginBottom: 20 }}>
                ⚠️ Demo Mode — Password reset emails are not sent in demo mode. Use demo credentials on the login page.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  id="forgot-email"
                />
              </div>
              {error && (
                <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, fontSize: '0.8rem', color: '#f87171', marginBottom: 16 }}>
                  {error}
                </div>
              )}
              <button type="submit" id="forgot-submit" disabled={loading} className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px', marginBottom: 20 }}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: '0.82rem' }}>
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
