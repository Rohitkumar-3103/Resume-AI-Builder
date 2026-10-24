import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, login } from "../services/api";

const Register = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return null;
    if (password.length < 6) return { level: "weak", label: "Too Short (Min 6)", color: "#ef4444", width: "30%" };
    const hasNum = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUpper = /[A-Z]/.test(password);

    if (password.length >= 8 && (hasNum || hasSpecial) && hasUpper) {
      return { level: "strong", label: "Strong Password", color: "#10b981", width: "100%" };
    }
    return { level: "good", label: "Good", color: "#f59e0b", width: "65%" };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);

      // If onLogin callback is available, automatically authenticate
      if (onLogin) {
        setSuccess("Account created successfully! Launching your workspace...");
        try {
          const authData = await login(email, password);
          onLogin(authData.token);
          setTimeout(() => {
            navigate("/dashboard");
          }, 800);
          return;
        } catch (loginErr) {
          console.error("Auto login error:", loginErr);
        }
      }

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Dynamic ambient background glow orbs */}
      <div className="auth-ambient-orb orb-primary" />
      <div className="auth-ambient-orb orb-secondary" />
      <div className="auth-ambient-orb orb-tertiary" />
      <div className="auth-grid-overlay" />

      <div className="auth-card-container">
        <div className="auth-card">
          <div className="auth-card-header">
            <Link to="/" className="auth-brand-link" title="Return to Home">
              <div className="auth-logo-glow-wrap">
                <img src="/resumecraft.png" alt="ResumeCraft" className="auth-brand-logo" />
              </div>
            </Link>

            <div className="auth-kicker-badge">
              <span className="kicker-dot" /> NEXT-GEN AI RESUME ENGINE
            </div>

            {/* Segmented Mode Switcher */}
            <div className="auth-nav-tabs">
              <Link to="/login" className="auth-nav-tab">
                <span>🔐</span> Sign In
              </Link>
              <Link to="/register" className="auth-nav-tab active">
                <span>✨</span> Create Account
              </Link>
            </div>

            <h2 className="auth-card-title">Create Your Account</h2>
            <p className="auth-card-subtitle">
              Start crafting job-winning, ATS-optimized resumes & cover letters in minutes.
            </p>
          </div>

          {error && (
            <div className="auth-error-alert">
              <span className="alert-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="auth-success-alert">
              <span className="alert-icon">✓</span>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form-field">
              <label htmlFor="name">Full Name</label>
              <div className="input-with-icon">
                <span className="field-icon">👤</span>
                <input
                  type="text"
                  id="name"
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-form-field">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <span className="field-icon">✉️</span>
                <input
                  type="email"
                  id="email"
                  placeholder="e.g. alex.rivera@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-form-field">
              <div className="field-label-row">
                <label htmlFor="password">Create Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-link"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="input-with-icon">
                <span className="field-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Password Strength Meter */}
              {strength && (
                <div className="password-strength-deck">
                  <div className="strength-bar-track">
                    <div
                      className="strength-bar-fill"
                      style={{ width: strength.width, backgroundColor: strength.color }}
                    />
                  </div>
                  <span className="strength-label" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <button type="submit" className="auth-action-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loading-content">
                  <span className="btn-spinner" /> Creating Account...
                </span>
              ) : (
                <span>Create Account & Get Started →</span>
              )}
            </button>
          </form>

          <div className="auth-card-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>

            <div className="auth-trust-row">
              <span className="auth-trust-item">🔒 256-Bit SSL Secure</span>
              <span className="auth-trust-item">⚡ ATS-Compliant</span>
              <span className="auth-trust-item">🤖 Gemini AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
