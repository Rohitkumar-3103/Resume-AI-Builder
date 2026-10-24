import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, register } from "../services/api";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    setEmail("alex@example.com");
    setPassword("password123");
    setError("");
    setLoading(true);

    try {
      let data;
      try {
        data = await login("alex@example.com", "password123");
      } catch (loginErr) {
        // If demo user is not yet in the DB, auto-register and login
        if (loginErr.response?.data?.message === "User Not Found" || loginErr.response?.status === 400) {
          try {
            await register("Alex Rivera", "alex@example.com", "password123");
          } catch (regErr) {
            // If already registered or other response, proceed
          }
          data = await login("alex@example.com", "password123");
        } else {
          throw loginErr;
        }
      }
      onLogin(data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Demo login failed. Please try entering credentials manually.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);
      onLogin(data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid email or password");
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
            {/* Segmented Mode Switcher */}
            <div className="auth-nav-tabs">
              <Link to="/login" className="auth-nav-tab active">
                <span>🔐</span> Sign In
              </Link>
              <Link to="/register" className="auth-nav-tab">
                <span>✨</span> Create Account
              </Link>
            </div>

            <h2 className="auth-card-title">Welcome Back</h2>
            <p className="auth-card-subtitle">
              Sign in to manage your resumes, AI optimizations, and cover letters.
            </p>
          </div>

          {error && (
            <div className="auth-error-alert">
              <span className="alert-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form-field">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <span className="field-icon">✉️</span>
                <input
                  type="email"
                  id="email"
                  placeholder="e.g. alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-form-field">
              <div className="field-label-row">
                <label htmlFor="password">Password</label>
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-action-btn" disabled={loading}>
              {loading && email !== "alex@example.com" ? (
                <span className="btn-loading-content">
                  <span className="btn-spinner" /> Authenticating...
                </span>
              ) : (
                <span>Sign In to Dashboard →</span>
              )}
            </button>
          </form>

          <div className="auth-card-footer">
            <p>
              Don't have an account yet?{" "}
              <Link to="/register" className="auth-link">
                Create an account for free
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

export default Login;
