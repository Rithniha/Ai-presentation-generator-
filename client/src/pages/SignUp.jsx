import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth';
import { Presentation, ArrowRight } from 'lucide-react';
import '../styles/Auth.css';

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

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

  return (
    <div className="auth-container">
      <div className="auth-card">
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

          <button type="submit" className="auth-btn-submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Get Started'}
            <ArrowRight size={16} />
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
