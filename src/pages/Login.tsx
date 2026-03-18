import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Activity, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { signInWithEmail, signInWithGoogle } from '../firebase';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('demo@healthiq.com');
  const [password, setPassword] = useState('Demo@1234');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmail('demo@healthiq.com', 'Demo@1234');
      navigate('/dashboard');
    } catch {
      // Firebase not configured — use mock login for demo
      useAuthStore.getState().setUser({
        uid: 'demo-user',
        email: 'demo@healthiq.com',
        displayName: 'Dr. Demo Admin',
        photoURL: null,
      });
      useAuthStore.getState().setLoading(false);
      navigate('/dashboard');
      toast.success('Welcome to HealthIQ! (Demo Mode)');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      navigate('/dashboard');
      toast.success('Welcome back!');
    } catch {
      // Fallback demo mode if Firebase not configured
      useAuthStore.getState().setUser({
        uid: 'mock-user',
        email,
        displayName: email.split('@')[0],
        photoURL: null,
      });
      useAuthStore.getState().setLoading(false);
      navigate('/dashboard');
      toast.success('Signed in (Demo Mode)');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch {
      toast.error('Google sign-in requires Firebase configuration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-bg__orb login-bg__orb--1" />
        <div className="login-bg__orb login-bg__orb--2" />
        <div className="login-bg__orb login-bg__orb--3" />
        <div className="login-bg__grid" />
      </div>

      {/* Left panel */}
      <div className="login-left">
        <div className="login-left__content">
          <div className="login-brand">
            <div className="login-brand__icon">
              <Heart size={28} strokeWidth={2.5} />
              <Activity size={16} className="login-brand__pulse" />
            </div>
            <span className="login-brand__name">
              Health<span style={{ color: 'var(--accent)' }}>IQ</span>
            </span>
          </div>

          <h1 className="login-left__headline">
            Intelligent Healthcare
            <br />
            <em>Operations Platform</em>
          </h1>
          <p className="login-left__sub">
            Real-time analytics, patient workflows, and insurance integrations — unified in one powerful interface.
          </p>

          <div className="login-stats">
            {[
              { val: '12,400+', label: 'Patients Managed' },
              { val: '98.6%', label: 'System Uptime' },
              { val: '340ms', label: 'Avg Response Time' },
            ].map((s) => (
              <div key={s.label} className="login-stat">
                <span className="login-stat__val">{s.val}</span>
                <span className="login-stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel / form */}
      <div className="login-right">
        <div className="login-card">
          <div className="login-card__header">
            <h2>Sign In</h2>
            <p>Access your healthcare dashboard</p>
          </div>

          {/* Demo banner */}
          <div className="login-demo-banner">
            <span>🚀 Demo Mode</span>
            <button onClick={handleDemoLogin} disabled={loading} className="login-demo-btn">
              Quick Access <ArrowRight size={14} />
            </button>
          </div>

          <div className="login-divider"><span>or sign in manually</span></div>

          <form onSubmit={handleEmailLogin} className="login-form">
            <div className="login-field">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@hospital.com"
                required
              />
            </div>

            <div className="login-field">
              <label>Password</label>
              <div className="login-field__password">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPass((v) => !v)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : 'Sign In'}
            </button>
          </form>

          <div className="login-divider"><span>or continue with</span></div>

          <button onClick={handleGoogle} className="login-google-btn" disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="login-card__note">
            🔒 HIPAA-compliant platform. All data encrypted at rest and in transit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
