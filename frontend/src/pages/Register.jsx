import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, login } from "../services/api";
import AnimatedCharacters from "../components/AnimatedCharacters";
import resumecraftLogo from "../assets/resumecraft_raw_icon.png";

const Register = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
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

  // Quick Google Signup Simulation
  const handleGoogleRegister = async () => {
    const defaultName = "Alex Rivera";
    const defaultEmail = "alex@example.com";
    setName(defaultName);
    setEmail(defaultEmail);
    setPassword("password123");
    setError("");
    setLoading(true);

    try {
      try {
        await register(defaultName, defaultEmail, "password123");
      } catch (regErr) {
        // already registered, proceed to login
      }
      const authData = await login(defaultEmail, "password123");
      if (onLogin) onLogin(authData.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Google signup failed. Try standard registration.");
    } finally {
      setLoading(false);
    }
  };

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
      }, 1400);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="char-auth-page-wrapper">
      <div className={`char-auth-card ${loading ? "card-processing" : ""}`}>
        {/* ========================================================
            LEFT COLUMN: INTERACTIVE ANIMATED CHARACTERS
            ======================================================== */}
        <div className="char-auth-stage-side">
          <AnimatedCharacters
            activeField={focusedField}
            isPasswordShown={showPassword}
            isLoading={loading}
          />
        </div>

        {/* ========================================================
            RIGHT COLUMN: CLEAN REGISTRATION FORM
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

          <h1 className="char-auth-title">Create an account</h1>

          {error && (
            <div className="char-auth-error-alert">
              <span>⚠️ {error}</span>
            </div>
          )}

          {success && (
            <div className="char-auth-success-alert">
              <span>✓ {success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="char-auth-form">
            {/* Interactive Left Indicator Arrow */}
            {focusedField && (
              <div
                className={`char-arrow-indicator ${
                  focusedField === "name"
                    ? "at-reg-name"
                    : focusedField === "email"
                    ? "at-reg-email"
                    : "at-reg-password"
                }`}
              >
                ◀
              </div>
            )}

            {/* Name Field */}
            <div className="char-form-group">
              <label htmlFor="reg-name">Full Name</label>
              <div className="char-input-wrap">
                <input
                  type="text"
                  id="reg-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g. Alex Rivera"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="char-form-group">
              <label htmlFor="reg-email">Email</label>
              <div className="char-input-wrap">
                <input
                  type="email"
                  id="reg-email"
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
              <label htmlFor="reg-password">Password</label>
              <div className="char-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  id="reg-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Min 6 characters"
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

              {/* Strength bar */}
              {strength && (
                <div style={{ marginTop: "4px" }}>
                  <div style={{ height: "4px", width: "100%", background: "rgba(0,0,0,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: strength.width, height: "100%", background: strength.color, transition: "all 0.3s ease" }} />
                  </div>
                  <span style={{ fontSize: "11.5px", color: strength.color, fontWeight: 500, marginTop: "2px", display: "inline-block" }}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Primary Sign Up Pill Button */}
            <button
              type="submit"
              className="char-submit-pill-btn"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>

            {/* Secondary Google Sign up Button */}
            <button
              type="button"
              className="char-google-pill-btn"
              onClick={handleGoogleRegister}
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.87c2.26-2.09 3.67-5.17 3.67-9.14z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.04c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.13C3.25 21.31 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.62H1.27C.46 8.24 0 10.06 0 12s.46 3.76 1.27 5.38l4-3.13z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.69 1.27 6.62l4 3.13c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
              <span>Sign up with Google</span>
            </button>
          </form>

          {/* Footer prompt */}
          <div className="char-auth-footer-prompt">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="char-switch-link">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
