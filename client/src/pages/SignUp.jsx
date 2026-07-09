import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { authService } from '../services/auth';
import { Presentation, ArrowRight } from 'lucide-react';
import '../styles/Auth.css';

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authService.register(name.trim(), email.trim(), password);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        await authService.googleLogin(tokenResponse.access_token);
        setSuccess('Account connected securely! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1000);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Google Sign-Up failed.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google Sign-Up was cancelled or failed.')
  });

  return (
    <div className="auth-container">
      <div className="auth-card auth-fade-in">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <div className="auth-logo-icon">
              <Presentation size={18} />
            </div>
            <span>DeckFlow</span>
          </Link>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Get started with DeckFlow presentation tools</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label className="auth-label">Full Name</label>
            <input
              type="text"
              className="auth-input"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              className="auth-input"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="auth-label">Password</label>
            <input
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="auth-label">Confirm Password</label>
            <input
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-btn-submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Get Started'}
            <ArrowRight size={16} />
          </button>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <button 
            type="button" 
            className="auth-btn-google"
            onClick={() => handleGoogleLogin()}
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/signin" className="auth-link">
            Sign In
          </Link>
        </div>
      </div>

      <Link to="/" className="auth-back-link">
        ← Back to Home
      </Link>
    </div>
  );
}
