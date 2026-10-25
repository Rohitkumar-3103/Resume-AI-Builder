import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, register } from "../services/api";
import AnimatedCharacters from "../components/AnimatedCharacters";
import resumecraftLogo from "../assets/resumecraft_raw_icon.png";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [activeField, setActiveField] = useState("email");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFieldChange = (setter, val) => {
    setter(val);
    setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 550);
  };

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
      await new Promise((resolve) => setTimeout(resolve, 5000));
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
      // Run 5 second celebration animation matching user requirement
      await new Promise((resolve) => setTimeout(resolve, 5000));
      onLogin(data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const currentField = focusedField || activeField;

  return (
    <div className="char-auth-page-wrapper">
      <div className={`char-auth-card ${loading ? "card-processing" : ""}`}>
        {/* ========================================================
            LEFT COLUMN: INTERACTIVE ANIMATED CHARACTERS
            ======================================================== */}
        <div className="char-auth-stage-side">
          <AnimatedCharacters
            activeField={currentField}
            isPasswordShown={showPassword}
            isLoading={loading}
            isTyping={isTyping}
          />
        </div>

        {/* ========================================================
            RIGHT COLUMN: CLEAN LOGIN FORM
            ======================================================== */}
        <div className="char-auth-form-side">
          {/* Official ResumeCraft Logo (Animated Float) */}
          <Link to="/" className="char-auth-logo-link" title="ResumeCraft">
            <img
              src={resumecraftLogo}
              alt="ResumeCraft Logo"
              className="char-auth-brand-logo"
            />
          </Link>

          <h1 className="char-auth-title">
            Welcome <span className="char-title-accent">Back.</span>
          </h1>

          {error && (
            <div className="char-auth-error-alert">
              <span>⚠️ {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="char-auth-form">
            {/* Interactive Left Indicator Arrow that smoothly glides between inputs */}
            <div
              className={`char-arrow-indicator ${
                currentField === "email" ? "at-login-email" : "at-login-password"
              }`}
              aria-hidden="true"
            >
              ◀
            </div>

            {/* Email Field with User Icon */}
            <div className="char-form-group">
              <label htmlFor="email">EMAIL</label>
              <div className="char-input-wrap">
                <svg className="char-input-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
                </svg>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => handleFieldChange(setEmail, e.target.value)}
                  onFocus={() => {
                    setFocusedField("email");
                    setActiveField("email");
                  }}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field with Lock Icon */}
            <div className="char-form-group">
              <label htmlFor="password">PASSWORD</label>
              <div className="char-input-wrap">
                <svg className="char-input-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => handleFieldChange(setPassword, e.target.value)}
                  onFocus={() => {
                    setFocusedField("password");
                    setActiveField("password");
                  }}
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
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z" />
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

            {/* Primary Sign In Button with Glowing Aura and Sparkles (Image 4 & 5) */}
            <div className="char-btn-glow-container">
              <button
                type="submit"
                className={`char-submit-pill-btn ${loading ? "is-loading" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="char-btn-loading-state">
                    <span className="char-btn-spinner" />
                    LOGGING IN...
                  </span>
                ) : (
                  <span>
                    SIGN IN <span>→</span>
                  </span>
                )}
              </button>
              <div className="char-btn-sparkles" aria-hidden="true">
                <span className="btn-sparkle p1" />
                <span className="btn-sparkle p2" />
                <span className="btn-sparkle p3" />
                <span className="btn-sparkle p4" />
                <span className="btn-sparkle p5" />
                <span className="btn-sparkle p6" />
                <span className="btn-sparkle p7" />
                <span className="btn-sparkle p8" />
              </div>
            </div>

            {/* Divider */}
            <div className="char-divider">OR</div>

            {/* Social Login Grid (Google & GitHub) */}
            <div className="char-social-buttons">
              <button
                type="button"
                className="char-social-btn"
                onClick={() => handleDemoOrGoogleLogin("Google User", "alex@example.com")}
                disabled={loading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.87c2.26-2.09 3.67-5.17 3.67-9.14z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.04c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.13C3.25 21.31 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.27 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.62H1.27C.46 8.24 0 10.06 0 12s.46 3.76 1.27 5.38l4-3.13z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.69 1.27 6.62l4 3.13c.95-2.85 3.6-4.96 6.73-4.96z"/>
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className="char-social-btn"
                onClick={() => handleDemoOrGoogleLogin("GitHub User", "alex@example.com")}
                disabled={loading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                <span>GitHub</span>
              </button>
            </div>
          </form>

          {/* Footer prompt */}
          <div className="char-auth-footer-prompt">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="char-switch-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
