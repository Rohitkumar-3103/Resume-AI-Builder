import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, register } from "../services/api";
import AnimatedCharacters from "../components/AnimatedCharacters";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Instant demo or Google login simulation
  const handleDemoOrGoogleLogin = async (userName = "Alex Rivera", userEmail = "alex@example.com") => {
    setEmail(userEmail);
    setPassword("password123");
    setError("");
    setLoading(true);

    try {
      let data;
      try {
        data = await login(userEmail, "password123");
      } catch (loginErr) {
        if (loginErr.response?.data?.message === "User Not Found" || loginErr.response?.status === 400) {
          try {
            await register(userName, userEmail, "password123");
          } catch (regErr) {
            // Already registered
          }
          data = await login(userEmail, "password123");
        } else {
          throw loginErr;
        }
      }
      onLogin(data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
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
    <div className="char-auth-page-wrapper">
      <div className="char-auth-card">
        {/* ========================================================
            LEFT COLUMN: INTERACTIVE ANIMATED CHARACTERS
            ======================================================== */}
        <div className="char-auth-stage-side">
          <AnimatedCharacters
            activeField={focusedField}
            isPasswordShown={showPassword}
          />
        </div>

        {/* ========================================================
            RIGHT COLUMN: CLEAN LOGIN FORM (Matching Video Design)
            ======================================================== */}
        <div className="char-auth-form-side">
          {/* Top Geometric Prism Delta Logo (Animated) */}
          <Link to="/" className="char-auth-logo-link" title="ResumeCraft">
            <svg
              className="char-auth-geometric-logo"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Modern Folded Delta Prism matching YouTube reference */}
              <path d="M20 4L36 32H28L20 18L12 32H4L20 4Z" fill="currentColor" fillOpacity="0.9" />
              <path d="M20 4L28 32H20L15 22L20 4Z" fill="#ffffff" fillOpacity="0.35" />
              <path d="M20 18L28 32H12L20 18Z" fill="#000000" fillOpacity="0.22" />
            </svg>
          </Link>

          <h1 className="char-auth-title">Welcome back!</h1>

          {error && (
            <div className="char-auth-error-alert">
              <span>⚠️ {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="char-auth-form">
            {/* Interactive Left Indicator Arrow */}
            {focusedField && (
              <div
                className={`char-arrow-indicator ${
                  focusedField === "email" ? "at-login-email" : "at-login-password"
                }`}
              >
                ◀
              </div>
            )}

            {/* Email Field */}
            <div className="char-form-group">
              <label htmlFor="email">Email</label>
              <div className="char-input-wrap">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="char-form-group">
              <label htmlFor="password">Password</label>
              <div className="char-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="char-password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="char-auth-row">
              <label className="char-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
            </div>

            {/* Primary Log In Pill Button */}
            <button
              type="submit"
              className="char-submit-pill-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>

            {/* Secondary Google Login Button */}
            <button
              type="button"
              className="char-google-pill-btn"
              onClick={() => handleDemoOrGoogleLogin("Google User", "alex@example.com")}
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.87c2.26-2.09 3.67-5.17 3.67-9.14z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.04c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.13C3.25 21.31 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.62H1.27C.46 8.24 0 10.06 0 12s.46 3.76 1.27 5.38l4-3.13z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.69 1.27 6.62l4 3.13c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
              <span>Log in with Google</span>
            </button>
          </form>

          {/* Footer prompt */}
          <div className="char-auth-footer-prompt">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="char-switch-link">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
