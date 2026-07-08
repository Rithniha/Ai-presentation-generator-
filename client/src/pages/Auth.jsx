import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, getGuestSessionId } from '../services/auth';
import { Mail, Lock, User, Eye, EyeOff, X } from 'lucide-react';
import '../styles/Auth.css';

export default function Auth({ onClose }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) return;

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await authService.login(signInEmail, signInPassword);
      if (onClose) {
        onClose(true);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!signUpName || !signUpEmail || !signUpPassword) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await authService.register(signUpName, signUpEmail, signUpPassword);
      if (onClose) {
        onClose(true);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSSO = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      // Simulate Google SSO by registering/logging in a mock user
      const email = 'google_sso_demo@example.com';
      const name = 'Google Guest';
      const password = 'SSO_Secure_Password_123_Google';

      let user;
      try {
        user = await authService.login(email, password);
      } catch (err) {
        // Fallback to register if user doesn't exist yet
        user = await authService.register(name, email, password);
      }
      if (onClose) {
        onClose(true);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Simulated Google SSO failed');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    // Generate/retrieve guestSessionId to initialize local session
    getGuestSessionId();
    if (onClose) {
      onClose(true);
    } else {
      navigate('/');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setSuccessMessage('Password reset link sent to your email (simulated)');
    setError('');
  };

  return (
    <div className="auth-page-container">
      <div className="auth-bg-blob auth-bg-blob-1"></div>
      <div className="auth-bg-blob auth-bg-blob-2"></div>
      <div className="auth-bg-blob auth-bg-blob-3"></div>
      <div className="auth-grid-overlay"></div>
      <div className="auth-modal-backdrop"></div>

      <div className="auth-card">
        {/* Card Header with Title and Close button */}
        <div className="auth-card-header">
          <h1 className="auth-card-title-left">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h1>
          <button type="button" className="auth-close-button" onClick={onClose || (() => navigate('/'))} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        {!isSignUp ? (
          /* Sign In Screen */
          <div className="auth-view-container">
            {/* Form */}
            <form onSubmit={handleSignIn} className="auth-form">
              <div className="form-group">
                <label className="form-label">Email</label>
                <div className="input-wrapper">
                  <Mail className="input-icon-left" size={18} />
                  <input
                    type="email"
                    className="form-input icon-padding-left"
                    placeholder="name@work-email.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon-left" size={18} />
                  <input
                    type={showSignInPassword ? 'text' : 'password'}
                    className="form-input icon-padding-left"
                    placeholder="Enter your password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    aria-label={showSignInPassword ? "Hide password" : "Show password"}
                  >
                    {showSignInPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="forgot-password-container">
                <a href="#forgot" onClick={handleForgotPassword} className="auth-link font-sm">
                  Forgot password?
                </a>
              </div>

              {/* Primary button */}
              <button type="submit" className="btn-primary-auth" disabled={loading}>
                {loading ? 'Processing...' : 'Continue with email'}
              </button>
            </form>

            {/* Divider */}
            <div className="auth-divider">
              <span>or</span>
            </div>

            {/* Google Sign-In button */}
            <button type="button" onClick={handleGoogleSSO} className="btn-google" disabled={loading}>
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.48c0,-0.61 -0.05,-1.2 -0.16,-1.72Z" fill="#4285F4" />
                <path d="M12,20.6c2.43,0 4.47,-0.8 5.96,-2.2l-3.3,-2.58c-0.91,0.61 -2.08,0.98 -3.3,0.98c-2.34,0 -4.33,-1.58 -5.04,-3.7H2.9v2.66c1.49,2.96 4.54,4.96 8.1,4.96Z" fill="#34A853" />
                <path d="M6.96,13.1c-0.18,-0.54 -0.28,-1.11 -0.28,-1.7c0,-0.59 0.1,-1.16 0.28,-1.7V7.04H2.9C2.3,8.23 2,9.58 2,11c0,1.42 0.3,2.77 0.9,3.96l4.06,-3.16Z" fill="#FBBC05" />
                <path d="M12,5.2c1.32,0 2.5,0.45 3.44,1.35l2.58,-2.58C16.46,2.56 14.43,1.6 12,1.6C8.44,1.6 5.39,3.6 3.9,6.56l4.06,3.16c0.71,-2.12 2.7,-3.72 5.04,-3.72Z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            {/* Bottom text */}
            <div className="auth-bottom-text">
              Don't have an account?{' '}
              <button type="button" onClick={() => { setIsSignUp(true); setError(''); setSuccessMessage(''); }} className="auth-link-button">
                Sign up
              </button>
            </div>
          </div>
        ) : (
          /* Sign Up Screen */
          <div className="auth-view-container">
            {/* Form */}
            <form onSubmit={handleSignUp} className="auth-form">
              <div className="form-group">
                <label className="form-label">Name</label>
                <div className="input-wrapper">
                  <User className="input-icon-left" size={18} />
                  <input
                    type="text"
                    className="form-input icon-padding-left"
                    placeholder="John Doe"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <div className="input-wrapper">
                  <Mail className="input-icon-left" size={18} />
                  <input
                    type="email"
                    className="form-input icon-padding-left"
                    placeholder="you@example.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon-left" size={18} />
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    className="form-input icon-padding-left"
                    placeholder="••••••••"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    aria-label={showSignUpPassword ? "Hide password" : "Show password"}
                  >
                    {showSignUpPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Primary button */}
              <button type="submit" className="btn-primary-auth" disabled={loading}>
                {loading ? 'Creating...' : 'Sign Up'}
              </button>
            </form>

            {/* Divider */}
            <div className="auth-divider">
              <span>or</span>
            </div>

            {/* Google Sign-Up button */}
            <button type="button" onClick={handleGoogleSSO} className="btn-google" disabled={loading}>
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.48c0,-0.61 -0.05,-1.2 -0.16,-1.72Z" fill="#4285F4" />
                <path d="M12,20.6c2.43,0 4.47,-0.8 5.96,-2.2l-3.3,-2.58c-0.91,0.61 -2.08,0.98 -3.3,0.98c-2.34,0 -4.33,-1.58 -5.04,-3.7H2.9v2.66c1.49,2.96 4.54,4.96 8.1,4.96Z" fill="#34A853" />
                <path d="M6.96,13.1c-0.18,-0.54 -0.28,-1.11 -0.28,-1.7c0,-0.59 0.1,-1.16 0.28,-1.7V7.04H2.9C2.3,8.23 2,9.58 2,11c0,1.42 0.3,2.77 0.9,3.96l4.06,-3.16Z" fill="#FBBC05" />
                <path d="M12,5.2c1.32,0 2.5,0.45 3.44,1.35l2.58,-2.58C16.46,2.56 14.43,1.6 12,1.6C8.44,1.6 5.39,3.6 3.9,6.56l4.06,3.16c0.71,-2.12 2.7,-3.72 5.04,-3.72Z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            {/* Bottom text */}
            <div className="auth-bottom-text">
              Already have an account?{' '}
              <button type="button" onClick={() => { setIsSignUp(false); setError(''); setSuccessMessage(''); }} className="auth-link-button">
                Sign in
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Guest button is placed outside/below the card as a subtle link */}
      <div className="auth-guest-container">
        <button onClick={handleContinueAsGuest} className="auth-guest-button" disabled={loading}>
          Continue as Guest
        </button>
      </div>
    </div>
  );
}
