import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  firebaseConfigured,
  loadEvidence,
  login,
  logout,
  persistRecord,
  profileFor,
  register,
  resetPassword,
  saveEvidence,
  subscribeToAuth,
} from './firebase'
import type { AppUser, EvidenceItem } from './data'
import { vessels } from './data'

// ─── Tiny icon helpers (inline SVG, no dependency) ──────────────────────────
const Icon = ({ d, size = 16, color = 'currentColor' }: { d: string; size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const ICONS = {
  ship: 'M3 17l2-8h14l2 8H3zM5 17v3h14v-3M12 9V3M9 6l3-3 3 3',
  alert: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01',
  wave: 'M2 12c2-4 6-4 8 0s6 4 8 0',
  file: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  lock: 'M19 11H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2v-6a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4',
  logout: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
  upload: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12',
  sat: 'M22 12A10 10 0 0012 2M2 12a10 10 0 0010 10M12 8a4 4 0 100 8 4 4 0 000-8zM4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24',
  user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8',
}

// ─── Types ───────────────────────────────────────────────────────────────────
type View = 'login' | 'register' | 'forgot' | 'dashboard' | 'vessels' | 'evidence' | 'reports'

// ─── Shared UI ───────────────────────────────────────────────────────────────
const Spinner = () => (
  <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#14b8a6', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
)

const Badge = ({ label, variant = 'teal' }: { label: string; variant?: 'teal' | 'red' | 'amber' | 'slate' | 'green' }) => {
  const colors: Record<string, string> = {
    teal: 'rgba(20,184,166,0.15)',
    red: 'rgba(239,68,68,0.15)',
    amber: 'rgba(245,158,11,0.15)',
    slate: 'rgba(100,116,139,0.15)',
    green: 'rgba(34,197,94,0.15)',
  }
  const text: Record<string, string> = { teal: '#14b8a6', red: '#f87171', amber: '#fbbf24', slate: '#94a3b8', green: '#4ade80' }
  return (
    <span style={{
      background: colors[variant], color: text[variant],
      padding: '2px 10px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700,
      border: `1px solid ${text[variant]}30`,
    }}>{label}</span>
  )
}

// ─── Auth forms ───────────────────────────────────────────────────────────────
function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #050f1a 0%, #0b1d2b 50%, #071520 100%)',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: 4 }}>
            🛰 SlickTrace
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            AI-Powered Oil Spill Detection & Traceability
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 8, color: '#e2e8f0', fontSize: '0.88rem',
  outline: 'none', fontFamily: 'inherit',
}
const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 12, padding: 28,
}
const btnStyle = (variant: 'primary' | 'ghost' | 'danger' = 'primary'): React.CSSProperties => ({
  width: '100%', padding: '10px 20px', borderRadius: 8, border: 'none',
  cursor: 'pointer', fontSize: '0.88rem', fontWeight: 700, fontFamily: 'inherit',
  background: variant === 'primary' ? 'linear-gradient(to right, #0d9488, #0369a1)'
    : variant === 'danger' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)',
  color: variant === 'danger' ? '#f87171' : '#fff',
})

function LoginForm({ onLogin, onRegister, onForgot }: {
  onLogin: (u: AppUser) => void
  onRegister: () => void
  onForgot: () => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      const profile = await profileFor(user)
      onLogin(profile)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const demoLogin = async () => {
    setError('')
    setLoading(true)
    // Demo mode: skip Firebase
    onLogin({ uid: 'demo-admin', name: 'Demo Analyst', email: 'analyst@slicktrace.demo', role: 'analyst', organization: 'INCOIS / Coast Guard' })
  }

  return (
    <AuthLayout>
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20, color: '#e2e8f0' }}>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: 6 }}>Email Address</label>
            <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="analyst@organization.gov.in" required />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: 6 }}>Password</label>
            <input style={inputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          {error && <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, fontSize: '0.8rem', color: '#f87171', marginBottom: 14 }}>{error}</div>}
          <button type="submit" style={btnStyle('primary')} disabled={loading}>
            {loading ? <Spinner /> : 'Sign In to SlickTrace'}
          </button>
        </form>
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={demoLogin} style={{ ...btnStyle('ghost'), marginBottom: 10 }}>
            🚀 Enter Demo Mode (no credentials needed)
          </button>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', fontSize: '0.78rem', color: '#64748b', marginTop: 8 }}>
            <button onClick={onRegister} style={{ background: 'none', border: 'none', color: '#14b8a6', cursor: 'pointer', fontSize: 'inherit' }}>Create Account</button>
            <span>·</span>
            <button onClick={onForgot} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 'inherit' }}>Forgot Password</button>
          </div>
        </div>
        {!firebaseConfigured && (
          <div style={{ marginTop: 14, padding: '8px 12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, fontSize: '0.72rem', color: '#fbbf24' }}>
            Firebase is not configured — add credentials to .env to enable real authentication.
          </div>
        )}
      </div>
    </AuthLayout>
  )
}

function RegisterForm({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(name, email, password)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20, color: '#e2e8f0' }}>Create Account</h2>
        {success ? (
          <div>
            <div style={{ color: '#4ade80', fontSize: '0.88rem', marginBottom: 16 }}>✓ Account created. You can now sign in.</div>
            <button onClick={onBack} style={btnStyle()}>Back to Login</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {[
              { label: 'Full Name', value: name, set: setName, type: 'text', placeholder: 'Dr. Example Analyst' },
              { label: 'Email', value: email, set: setEmail, type: 'email', placeholder: 'you@organization.gov.in' },
              { label: 'Password', value: password, set: setPassword, type: 'password', placeholder: '••••••••' },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input style={inputStyle} type={f.type} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} required />
              </div>
            ))}
            {error && <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: 8, fontSize: '0.8rem', color: '#f87171', marginBottom: 14 }}>{error}</div>}
            <button type="submit" style={btnStyle()} disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
            <button type="button" onClick={onBack} style={{ ...btnStyle('ghost'), marginTop: 10 }}>Back to Login</button>
          </form>
        )}
      </div>
    </AuthLayout>
  )
}

function ForgotForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16, color: '#e2e8f0' }}>Reset Password</h2>
        {sent ? (
          <div>
            <div style={{ color: '#4ade80', fontSize: '0.88rem', marginBottom: 16 }}>✓ Reset email sent. Check your inbox.</div>
            <button onClick={onBack} style={btnStyle()}>Back to Login</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: 6 }}>Email Address</label>
              <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@organization.gov.in" required />
            </div>
            {error && <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: 8, fontSize: '0.8rem', color: '#f87171', marginBottom: 14 }}>{error}</div>}
            <button type="submit" style={btnStyle()} disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
            <button type="button" onClick={onBack} style={{ ...btnStyle('ghost'), marginTop: 10 }}>Back to Login</button>
          </form>
        )}
      </div>
    </AuthLayout>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function StatCard({ label, value, color, icon }: { label: string; value: string | number; color: string; icon: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'center' }}>
      <div style={{ width: 38, height: 38, borderRadius: 8, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon d={icon} size={18} color={color} />
      </div>
      <div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e2e8f0', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 3 }}>{label}</div>
      </div>
    </div>
  )
}

function VesselsView() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0' }}>Vessel Tracking & AIS Analytics</h2>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>Candidate vessels correlated with detected spill — INC-2026-0142</p>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['Vessel ID', 'Name', 'Status', 'Position', 'Speed', 'Distance to Spill', 'Correlation', 'Attribution'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vessels.map(v => (
              <tr key={v.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#14b8a6', fontSize: '0.78rem' }}>{v.id}</td>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: '#e2e8f0' }}>{v.name}</td>
                <td style={{ padding: '12px 16px' }}><Badge label={v.status} variant="green" /></td>
                <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.78rem' }}>{v.position}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#94a3b8' }}>{v.speed}</td>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: v.priority === 'High' ? '#f87171' : '#94a3b8' }}>{v.distance}</td>
                <td style={{ padding: '12px 16px' }}><Badge label={v.correlation} variant={v.correlation === 'High' ? 'red' : v.correlation === 'Medium' ? 'amber' : 'slate'} /></td>
                <td style={{ padding: '12px 16px' }}><Badge label={`${v.priority} Priority`} variant={v.priority === 'High' ? 'red' : v.priority === 'Medium' ? 'amber' : 'slate'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 16, padding: '10px 16px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, fontSize: '0.72rem', color: '#64748b' }}>
        ⚠️ Vessel attribution is analytical (XGBoost + SHAP). Must be verified by authorized authorities before legal or enforcement action.
      </div>
    </div>
  )
}

function EvidenceView({ user }: { user: AppUser }) {
  const [items, setItems] = useState<EvidenceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadEvidence().then(ev => { setItems(ev); setLoading(false) })
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const item = await saveEvidence(file, 'INC-2026-0142', user.name)
      setItems(prev => [item, ...prev])
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0' }}>Evidence Locker</h2>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>Tamper-evident evidence chain — INC-2026-0142</p>
        </div>
        <div>
          <input ref={fileRef} type="file" onChange={handleUpload} style={{ display: 'none' }} id="evidence-upload" />
          <label htmlFor="evidence-upload" style={{ ...btnStyle(), width: 'auto', padding: '8px 18px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 8 }}>
            {uploading ? <Spinner /> : <Icon d={ICONS.upload} size={14} />}
            {uploading ? 'Uploading...' : 'Upload Evidence'}
          </label>
        </div>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}><Spinner /></div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#64748b' }}>No evidence uploaded yet</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(item => (
            <div key={item.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 18px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(20,184,166,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon d={ICONS.lock} size={16} color="#14b8a6" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#e2e8f0' }}>{item.type}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#14b8a6' }}>{item.id}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 6 }}>Source: {item.source} · Uploaded by: {item.uploadedBy}</div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: '#94a3b8', background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: 6 }}>{item.hash}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: 16, padding: '10px 16px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8, fontSize: '0.72rem', color: '#64748b' }}>
        SHA-256 cryptographic hashing planned for v2. Current prototype uses Firebase Storage metadata.
      </div>
    </div>
  )
}

function ReportsView({ user }: { user: AppUser }) {
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const generate = async () => {
    setGenerating(true)
    const id = `RPT-${Date.now()}`
    await persistRecord('reports', id, {
      incidentId: 'INC-2026-0142',
      generatedBy: user.name,
      status: 'final',
      summary: 'Oil slick detected in Arabian Sea. MT ARABIAN STAR identified as potential responsible vessel.',
    })
    setGenerating(false)
    setGenerated(true)
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0' }}>Incident Reports</h2>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>Generate and manage analytical reports</p>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.95rem' }}>INC-2026-0142 — Arabian Sea Oil Spill</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>Sentinel-1 SAR · U-Net detection · 47.3 km² · MT ARABIAN STAR potential attribution</div>
          </div>
          <Badge label="Active" variant="red" />
        </div>
        <button onClick={generate} style={{ ...btnStyle(), width: 'auto', padding: '10px 24px', display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 8 }} disabled={generating}>
          {generating ? <Spinner /> : <Icon d={ICONS.file} size={14} />}
          {generating ? 'Generating...' : 'Generate Incident Report'}
        </button>
        {generated && (
          <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, fontSize: '0.8rem', color: '#4ade80' }}>
            ✓ Report generated and saved to Firestore (or localStorage in demo mode).
          </div>
        )}
        <div style={{ marginTop: 20, padding: '10px 14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, fontSize: '0.72rem', color: '#64748b', lineHeight: 1.6 }}>
          ⚠️ SlickTrace provides analytical decision support only. Vessel attribution is analytical and must be verified by authorized authorities before enforcement or legal action.
        </div>
      </div>
    </div>
  )
}

function Dashboard({ user, onView, activeView }: { user: AppUser; onView: (v: View) => void; activeView: View }) {
  const stats = [
    { label: 'Active Incidents', value: 2, color: '#ef4444', icon: ICONS.alert },
    { label: 'Vessels Analyzed', value: 34, color: '#0ea5e9', icon: ICONS.ship },
    { label: 'Drift Predictions', value: 2, color: '#14b8a6', icon: ICONS.wave },
    { label: 'Reports Generated', value: 7, color: '#22c55e', icon: ICONS.file },
  ]

  const nav: { id: View; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Overview', icon: ICONS.sat },
    { id: 'vessels', label: 'Vessel Tracking', icon: ICONS.ship },
    { id: 'evidence', label: 'Evidence Locker', icon: ICONS.lock },
    { id: 'reports', label: 'Reports', icon: ICONS.file },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: '#060f1a', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>🛰 SlickTrace</div>
          <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: 2 }}>SIH 2026 · SNPSU0178</div>
        </div>
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {nav.map(item => (
            <button key={item.id} onClick={() => onView(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                marginBottom: 2, fontSize: '0.82rem', fontWeight: 500, fontFamily: 'inherit',
                background: activeView === item.id ? 'rgba(20,184,166,0.15)' : 'transparent',
                color: activeView === item.id ? '#14b8a6' : '#64748b',
                textAlign: 'left',
              }}>
              <Icon d={item.icon} size={14} color={activeView === item.id ? '#14b8a6' : '#64748b'} />
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#0d9488,#0369a1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700 }}>
              {user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>{user.role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '14px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#e2e8f0' }}>
              {nav.find(n => n.id === activeView)?.label ?? 'Overview'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ padding: '4px 12px', background: 'rgba(34,197,94,0.1)', borderRadius: 20, fontSize: '0.68rem', color: '#4ade80', fontWeight: 700 }}>
              ● DEMO MODE
            </div>
            <button onClick={logout} title="Sign out"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}>
              <Icon d={ICONS.logout} size={14} />
            </button>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
          {activeView === 'dashboard' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#e2e8f0' }}>Overview Dashboard</h1>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>
                  SlickTrace Decision Support · Arabian Sea Region · {new Date().toISOString().slice(0, 10)}
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
                {stats.map(s => <StatCard key={s.label} {...s} />)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                {/* Active incident card */}
                <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                    <Badge label="ACTIVE" variant="red" />
                    <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#14b8a6' }}>INC-2026-0142</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#e2e8f0', marginBottom: 6 }}>Arabian Sea Oil Spill</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.6 }}>
                    Detected: 2026-09-26 08:32 UTC<br />
                    Location: 19.4°N, 68.2°E<br />
                    Area: 47.3 km²<br />
                    Satellite: Sentinel-1 SAR · U-Net
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <Badge label="Potential Responsible Vessel: MT ARABIAN STAR" variant="red" />
                  </div>
                </div>
                {/* Attribution summary */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#e2e8f0', marginBottom: 14 }}>Attribution Summary</div>
                  {vessels.slice(0, 3).map((v, i) => (
                    <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', width: 18, textAlign: 'center' }}>{i + 1}</span>
                        <span style={{ fontSize: '0.82rem', color: '#e2e8f0' }}>{v.name}</span>
                      </div>
                      <Badge label={v.priority === 'High' ? 'High' : v.priority === 'Medium' ? 'Medium' : 'Low'} variant={v.priority === 'High' ? 'red' : v.priority === 'Medium' ? 'amber' : 'slate'} />
                    </div>
                  ))}
                  <div style={{ marginTop: 14, fontSize: '0.7rem', color: '#64748b', fontStyle: 'italic' }}>
                    XGBoost + SHAP analytical attribution — not legal determination
                  </div>
                </div>
              </div>
              <div style={{ padding: '12px 16px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8, fontSize: '0.72rem', color: '#94a3b8' }}>
                ⚠️ SlickTrace provides analytical decision support. Vessel attribution is analytical and must be verified by authorized authorities before enforcement or legal action. Prototype demonstration — data is simulated.
              </div>
            </div>
          )}
          {activeView === 'vessels' && <VesselsView />}
          {activeView === 'evidence' && <EvidenceView user={user} />}
          {activeView === 'reports' && <ReportsView user={user} />}
        </div>
      </div>
    </div>
  )
}

// ─── App root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState<View>('login')
  const [activeView, setActiveView] = useState<View>('dashboard')
  const [user, setUser] = useState<AppUser | null>(null)

  useEffect(() => {
    const unsub = subscribeToAuth(async (fbUser) => {
      if (fbUser) {
        const profile = await profileFor(fbUser)
        setUser(profile)
        setView('dashboard')
      } else {
        setUser(null)
        setView(v => v === 'dashboard' || v === 'vessels' || v === 'evidence' || v === 'reports' ? 'login' : v)
      }
    })
    return unsub
  }, [])

  const handleLogin = useCallback((u: AppUser) => {
    setUser(u)
    setView('dashboard')
    setActiveView('dashboard')
  }, [])

  const handleLogout = useCallback(async () => {
    await logout()
    setUser(null)
    setView('login')
  }, [])

  const handleNavigation = useCallback((v: View) => {
    setActiveView(v)
  }, [])

  if (view === 'register') return <RegisterForm onBack={() => setView('login')} />
  if (view === 'forgot') return <ForgotForm onBack={() => setView('login')} />

  if ((view === 'dashboard' || view === 'vessels' || view === 'evidence' || view === 'reports') && user) {
    return <Dashboard user={user} onView={handleNavigation} activeView={activeView} />
  }

  return <LoginForm onLogin={handleLogin} onRegister={() => setView('register')} onForgot={() => setView('forgot')} />
}
